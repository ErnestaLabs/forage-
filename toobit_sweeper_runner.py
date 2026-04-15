#!/usr/bin/env python3
import os
import time
import json
import logging
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

        # In a real scenario, this would be a WebSocket listener
        # Here we simulate or poll for demonstration
        while True:
            try:
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
        nominal_size = self.risk.max_symbol_exposure * 0.005

        check = self.risk.can_trade(self.symbol, nominal_size)
        if not check["can_trade"]:
            logger.warning(f"Trade rejected by Risk: {check['reason']}")
            return

        side = "BUY" if spike["direction"] == "DOWN" else "SELL"
        price = spike["current"]  # In a real system, we'd use best bid/ask

        logger.info(f"Placing sweep {side} order at {price}")

        # Execution (LIMIT/GTX for post-only)
        res = self.client.place_order(
            symbol=self.symbol,
            side=side,
            quantity=nominal_size / price,  # Simplified qty calc
            price=price,
            order_type="POST_ONLY",
        )

        if res.get("status") != "ERROR":
            self.active_trade = {
                "id": res.get("orderId"),
                "side": side,
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
        # Implementation of market close...
        side = "SELL" if self.active_trade["side"] == "BUY" else "BUY"
        logger.info(f"Closing position via {side} for {reason}")

        # Write to graph
        self.log_to_graph(reason)

        self.active_trade = None

    def log_to_graph(self, reason: str):
        # Mocking graph_write_signal
        logger.info(f"LOGGING TO GRAPH: trade closed due to {reason}")


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
