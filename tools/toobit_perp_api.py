#!/usr/bin/env python3
import hmac
import hashlib
import time
import requests
import json
import os
import sys
import argparse
from typing import Dict, Any
from urllib.parse import urlencode


# Low-latency HMAC signing for Toobit USDT-M perp API
class ToobitSigner:
    """Handles HMAC SHA256 signing for Toobit API requests."""

    def __init__(self, secret: str):
        self.secret = secret.encode("utf-8")

    def sign(self, params: Dict[str, Any]) -> str:
        # Toobit signature works with alphabetical urlencode
        query_string = urlencode(sorted(params.items()))
        return hmac.new(
            self.secret, query_string.encode("utf-8"), hashlib.sha256
        ).hexdigest()


class ToobitUSDTMClient:
    """
    Low-latency client for Toobit USDT-M Perpetual Futures.
    Uses connection pooling and URL-parameter signing for speed and reliability.
    """

    def __init__(
        self, api_key: str, api_secret: str, base_url: str = "https://api.toobit.com"
    ):
        self.api_key = api_key
        self.signer = ToobitSigner(api_secret)
        self.base_url = base_url
        self.session = requests.Session()

        # Pre-configure headers
        self.session.headers.update(
            {"X-BB-APIKEY": self.api_key, "User-Agent": "ToobitSweeper/1.1"}
        )

    def place_order(
        self,
        symbol: str,
        side: str,
        quantity: float,
        price: float,
        order_type: str = "LIMIT",
    ) -> Dict:
        """
        Places a new order on Toobit USDT-M Perpetual.
        """
        endpoint = "/api/v1/futures/order"

        # Correct symbol format for Toobit Futures is SYMBOL-SWAP-USDT
        # e.g. BTC-SWAP-USDT
        formatted_symbol = symbol.upper()
        if "SWAP" not in formatted_symbol:
            # Try to convert BTCUSDT -> BTC-SWAP-USDT
            base = formatted_symbol.replace("USDT", "")
            formatted_symbol = f"{base}-SWAP-USDT"

        # Rounding (BTC-SWAP-USDT: p=0.1, q=0.0001)
        p_prec, q_prec = 1, 4
        if "ETH" in formatted_symbol:
            p_prec, q_prec = 2, 3

        # Current millisecond timestamp
        ts = int(time.time() * 1000)

        # side must be BUY_OPEN, SELL_OPEN, etc.
        final_side = side.upper()
        if final_side in ["BUY", "SELL"]:
            final_side += "_OPEN"

        params = {
            "symbol": formatted_symbol,
            "side": final_side,
            "type": "LIMIT",
            "timeInForce": "IOC" if order_type.upper() == "IOC" else "GTC",
            "quantity": str(round(quantity, q_prec)),
            "price": str(round(price, p_prec)),
            "newClientOrderId": f"swp_{int(time.time() * 1000)}",
            "recvWindow": "5000",
            "timestamp": ts,
        }

        # Sign the parameters
        signature = self.signer.sign(params)

        # Toobit requires parameters in the query string for POST
        qs = urlencode(sorted(params.items()))
        full_url = f"{self.base_url}{endpoint}?{qs}&signature={signature}"

        try:
            # POST with empty body, all params in URL
            response = self.session.post(full_url, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            error_info = {
                "status": "ERROR",
                "message": str(e),
                "url": full_url,
                "response": e.response.json()
                if hasattr(e, "response") and e.response is not None
                else str(e),
            }
            return error_info


def execute_from_memory(client: ToobitUSDTMClient, memory_key: str = "pending_order"):
    order_raw = os.getenv(memory_key.upper())
    if not order_raw:
        path = os.path.join(os.getcwd(), f"{memory_key}.json")
        if os.path.exists(path):
            with open(path, "r") as f:
                order_raw = f.read()

    if not order_raw:
        return {"status": "SKIPPED", "reason": "No order found"}

    try:
        order = json.loads(order_raw)
        result = client.place_order(
            symbol=order.get("symbol"),
            side=order.get("side"),
            quantity=order.get("quantity"),
            price=order.get("price"),
            order_type=order.get("type", "LIMIT"),
        )
        return {"status": "EXECUTED", "api_response": result}
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Toobit USDT-M Perp Order Executor")
    parser.add_argument("--symbol", help="e.g. BTCUSDT")
    parser.add_argument("--side", help="BUY_OPEN, SELL_OPEN, etc.")
    parser.add_argument("--qty", type=float)
    parser.add_argument("--price", type=float)
    parser.add_argument("--type", choices=["LIMIT", "IOC"], default="LIMIT")
    parser.add_argument("--execute-pending", action="store_true")
    parser.add_argument("--dry-run", action="store_true")

    args = parser.parse_args()

    api_key = os.getenv("TOOBIT_API_KEY")
    api_secret = os.getenv("TOOBIT_API_SECRET")

    if not api_key or not api_secret:
        print("Error: TOOBIT_API_KEY/SECRET missing")
        sys.exit(1)

    client = ToobitUSDTMClient(api_key, api_secret)

    if args.execute_pending:
        res = execute_from_memory(client)
        print(json.dumps(res, indent=2))
    elif args.symbol and args.side and args.qty and args.price:
        if args.dry_run:
            print(
                f"[DRY RUN] {args.type} {args.side} {args.qty} {args.symbol} @ {args.price}"
            )
        else:
            res = client.place_order(
                args.symbol, args.side, args.qty, args.price, args.type
            )
            print(json.dumps(res, indent=2))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
