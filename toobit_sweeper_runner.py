#!/usr/bin/env python3
import os
import time
import json
import logging
from dotenv import load_dotenv
from tools.toobit_perp_api import ToobitUSDTMClient
from tools.toobit_spike_detector import SpikeDetector
from tools.toobit_risk_manager import RiskManager

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("toobit_sweeper.log"), logging.StreamHandler()],
)
logger = logging.getLogger("ToobitSweeper")

# Load environment variables
load_dotenv()  # Load from .env
load_dotenv("trading.env", override=True)  # Load from trading.env (takes priority)

logger.info(
    f"Loaded TOOBIT_API_KEY: {os.getenv('TOOBIT_API_KEY')[:8] if os.getenv('TOOBIT_API_KEY') else 'NONE'}..."
)
logger.info(
    f"Loaded TOOBIT_API_SECRET: {os.getenv('TOOBIT_API_SECRET')[:8] if os.getenv('TOOBIT_API_SECRET') else 'NONE'}..."
)


class ToobitSweeper:
    def __init__(self, symbol: str):
        self.symbol = symbol
        self.api_key = os.getenv("TOOBIT_API_KEY")
        self.api_secret = os.getenv("TOOBIT_API_SECRET")

        if not self.api_key or not self.api_secret:
            logger.error("Missing TOOBIT_API_KEY or TOOBIT_API_SECRET")
            raise ValueError("API credentials required")

        self.client = ToobitUSDTMClient(self.api_key, self.api_secret)
        self.detector = SpikeDetector(symbol)
        self.risk = RiskManager()

        self.active_trade = None
        self.p_ref = None
        self.extreme = None

    def run_loop(self):
        logger.info(f"Starting Toobit Sweeper for {self.symbol}...")

        last_heartbeat = 0

        # In a real scenario, this would be a WebSocket listener
        # Here we simulate or poll for demonstration
        while True:
            try:
                now = time.time()
                if now - last_heartbeat > 60:
                    logger.info(
                        f"Heartbeat: Monitoring {self.symbol}. Waiting for spikes..."
                    )
                    last_heartbeat = now

                # 1. Check for Halt
                if self.risk.check_halt():
                    logger.warning("Risk Halt Active. Standing by.")
                    time.sleep(60)
                    continue

                # 2. Get Market Data (Mocking for now, would be WS in prod)
                # ticker = self.client.get_ticker(self.symbol)
                # price = float(ticker['lastPrice'])
                # ... detector.update(price, volume, side) ...

                # 3. Check for Spike (Reading from shared memory if another process detects it)
                spike = self.poll_spike_memory()
                if spike and not self.active_trade:
                    self.handle_spike(spike)

                # 4. Manage Active Trade
                if self.active_trade:
                    self.manage_exit()

                time.sleep(0.1)  # 100ms loop
            except KeyboardInterrupt:
                break
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                time.sleep(1)

    def poll_spike_memory(self):
        path = os.path.join(os.getcwd(), "market_spike.json")
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    spike = json.load(f)
                # Clear after read to prevent double-entry
                os.remove(path)
                return spike
            except Exception:
                pass
        return None

    def handle_spike(self, spike):
        logger.info(f"SPIKE DETECTED: {spike['direction']} {spike['move_pct']:.2f}%")

        # Sizing: 0.5% of max exposure for this symbol
        # Ensure it meets exchange minimum (approx 1 unit for BTC = 0.001 BTC)
        nominal_size = max(
            self.risk.max_symbol_exposure * 0.005, 70.0
        )  # At least $70 for BTC

        check = self.risk.can_trade(self.symbol, nominal_size)
        if not check["can_trade"]:
            logger.warning(f"Trade rejected by Risk: {check['reason']}")
            return

        side = "BUY" if spike["direction"] == "DOWN" else "SELL"
        price = spike["current"]  # In a real system, we'd use best bid/ask

        # Toobit USDT-M quantity is in UNITS
        # 1 unit = 0.001 BTC or 0.01 ETH (approx)
        # We calculate based on nominal USDT
        multiplier = 0.001 if "BTC" in self.symbol.upper() else 0.01
        quantity = (nominal_size / price) / multiplier
        # Ensure at least 1 unit
        quantity = max(round(quantity), 1)

        logger.info(f"Placing sweep {side} order at {price} (Qty: {quantity} units)")

        # Execution (LIMIT/GTX for post-only)
        res = self.client.place_order(
            symbol=self.symbol,
            side=side,
            quantity=quantity,
            price=price,
            order_type="POST_ONLY",
        )

        if res.get("status") != "ERROR":
            self.active_trade = {
                "id": res.get("orderId"),
                "side": side,
                "quantity": quantity,
                "entry_price": price,
                "p_ref": spike["p_ref"],
                "extreme": spike["extreme"],
                "start_time": time.time(),
            }
            logger.info(f"Position opened: {self.active_trade['id']}")
        else:
            logger.error(f"Failed to open position: {res}")

    def manage_exit(self):
        # 1. Time Stop (120s)
        elapsed = time.time() - self.active_trade["start_time"]
        if elapsed > 120:
            logger.info("Time stop hit. Closing position.")
            self.close_position("TIME_STOP")
            return

        # 2. Get current price (Mocking)
        current_price = (
            self.active_trade["entry_price"] * 1.002
        )  # Assume slight recovery

        # 3. Profit Target (45% snapback)
        move = abs(self.active_trade["p_ref"] - self.active_trade["extreme"])
        target_recovery = move * 0.45

        if self.active_trade["side"] == "BUY":
            target_price = self.active_trade["extreme"] + target_recovery
            if current_price >= target_price:
                logger.info(
                    f"Profit target hit ({current_price} >= {target_price}). Closing."
                )
                self.close_position("PROFIT_TARGET")
        else:
            target_price = self.active_trade["extreme"] - target_recovery
            if current_price <= target_price:
                logger.info(
                    f"Profit target hit ({current_price} <= {target_price}). Closing."
                )
                self.close_position("PROFIT_TARGET")

        # 4. Protective Stop (0.3% beyond extreme)
        if self.active_trade["side"] == "BUY":
            stop_price = self.active_trade["extreme"] * (1 - 0.003)
            if current_price <= stop_price:
                logger.info("Protective stop hit. Closing.")
                self.close_position("STOP_LOSS")
        else:
            stop_price = self.active_trade["extreme"] * (1 + 0.003)
            if current_price >= stop_price:
                logger.info("Protective stop hit. Closing.")
                self.close_position("STOP_LOSS")

    def close_position(self, reason: str):
        if not self.active_trade:
            return

        side = "SELL" if self.active_trade["side"] == "BUY" else "BUY"
        logger.info(
            f"Closing position {self.active_trade['id']} via {side} for {reason}"
        )

        # Place market-equivalent limit order (or just use IOC for close)
        res = self.client.place_order(
            symbol=self.symbol,
            side=side,
            quantity=self.active_trade["quantity"],
            price=self.active_trade["entry_price"]
            * (0.99 if side == "SELL" else 1.01),  # Aggressive price for fill
            order_type="IOC",
        )

        if res.get("status") != "ERROR":
            logger.info(f"Close order placed successfully: {res.get('orderId')}")
            self.log_to_graph(reason, res)
            self.active_trade = None
        else:
            logger.error(f"Failed to close position: {res}")

    def log_to_graph(self, reason: str, api_response: dict):
        # Implementation to log results to Forage graph
        logger.info(
            f"LOGGING TO GRAPH: trade {api_response.get('orderId')} closed due to {reason}"
        )


if __name__ == "__main__":
    # Create instance and run
    # Usage: python toobit_sweeper_runner.py --symbol BTCUSDT
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--symbol", default="BTCUSDT")
    args = parser.parse_args()

    try:
        sweeper = ToobitSweeper(args.symbol)
        sweeper.run_loop()
    except Exception as e:
        print(f"Startup failed: {e}")
