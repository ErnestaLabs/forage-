#!/usr/bin/env python3
import json
import time
import websocket
import logging
import threading
import os
from tools.toobit_spike_detector import SpikeDetector, monitor_memory_spike

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("toobit_market_data.log"), logging.StreamHandler()],
)
logger = logging.getLogger("ToobitMarketData")


class ToobitMarketData:
    def __init__(self, symbols: list):
        self.symbols = [s.upper() for s in symbols]
        self.detectors = {s: SpikeDetector(s) for s in self.symbols}
        self.ws_url = "wss://stream.toobit.com/quote/ws/v1"
        self.ws = None

    def on_message(self, ws, message):
        try:
            # logger.debug(f"RAW WS: {message}")
            data = json.loads(message)

            if "pong" in data:
                # logger.debug(f"Received Pong: {data['pong']}")
                return

            # Toobit trade message format:
            # {"topic": "trade", "symbol": "BTCUSDT", "data": [{"p": "65000.1", "q": "0.01", "m": true, "t": 123456789}]}

            if data.get("topic") == "trade" and "data" in data and "symbol" in data:
                symbol = data["symbol"]
                for trade in data["data"]:
                    price = float(trade["p"])
                    qty = float(trade["q"])
                    side = "SELL" if trade["m"] else "BUY"

                    res = self.detectors[symbol].update(price, qty, side)
                    if res:
                        monitor_memory_spike(res)
                        logger.info(
                            f"!!! SPIKE TRIGGERED !!! {symbol} {res['direction']} {res['move_pct']:.2f}%"
                        )
            elif "data" in data and not data.get("topic"):
                # Handle unexpected format if topic is missing but data is present
                pass

        except Exception as e:
            logger.error(f"Error parsing message: {e}")

    def on_error(self, ws, error):
        logger.error(f"WS Error: {error}")

    def on_close(self, ws, close_status_code, close_msg):
        logger.warning(f"WS Closed: {close_status_code} {close_msg}")

    def on_open(self, ws):
        logger.info("WS Connection Opened")
        # Start heartbeat thread
        threading.Thread(target=self.heartbeat, args=(ws,), daemon=True).start()
        # Subscribe to trades for all symbols using Toobit format
        # Format: { "symbol": "BTCUSDT,ETHUSDT", "topic": "trade", "event": "sub" }
        symbols_str = ",".join(self.symbols)
        sub_msg = {
            "symbol": symbols_str,
            "topic": "trade",
            "event": "sub",
            "params": {"binary": "false"},
        }
        ws.send(json.dumps(sub_msg))
        logger.info(f"Subscribed to trade for {symbols_str}")

    def heartbeat(self, ws):
        while True:
            if not ws.sock or not ws.sock.connected:
                break
            try:
                ping_msg = {"ping": int(time.time() * 1000)}
                ws.send(json.dumps(ping_msg))
                # logger.info("Sent Ping")
                time.sleep(15)  # Ping every 15s
            except Exception as e:
                logger.error(f"Heartbeat error: {e}")
                break

    def run(self):
        websocket.enableTrace(False)
        while True:
            try:
                self.ws = websocket.WebSocketApp(
                    self.ws_url,
                    on_open=self.on_open,
                    on_message=self.on_message,
                    on_error=self.on_error,
                    on_close=self.on_close,
                )
                self.ws.run_forever(ping_interval=20, ping_timeout=10)
                logger.info("WS disconnected, reconnecting in 5s...")
                time.sleep(5)
            except Exception as e:
                logger.error(f"WS Run Loop Error: {e}")
                time.sleep(5)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--symbols", default="BTCUSDT,ETHUSDT")
    args = parser.parse_args()

    symbols_list = args.symbols.split(",")
    md = ToobitMarketData(symbols_list)
    md.run()
