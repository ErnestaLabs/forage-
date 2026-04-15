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


# Low-latency HMAC signing for Toobit USDT-M perp API
class ToobitSigner:
    """Handles HMAC SHA256 signing for Toobit API requests."""

    def __init__(self, secret: str):
        self.secret = secret.encode("utf-8")

    def sign(self, params: Dict[str, Any]) -> str:
        # Toobit requires alphabetical sorting of parameters for the signature
        query_string = "&".join([f"{k}={v}" for k, v in sorted(params.items())])
        return hmac.new(
            self.secret, query_string.encode("utf-8"), hashlib.sha256
        ).hexdigest()


class ToobitUSDTMClient:
    """
    Low-latency client for Toobit USDT-M Perpetual Futures.
    Uses connection pooling and pre-built templates for speed.
    """

    def __init__(
        self, api_key: str, api_secret: str, base_url: str = "https://api.toobit.com"
    ):
        self.api_key = api_key
        self.signer = ToobitSigner(api_secret)
        self.base_url = base_url
        self.session = requests.Session()

        # Pre-configure headers for connection persistence
        self.session.headers.update(
            {
                "X-TOOBIT-APIKEY": self.api_key,
                "Content-Type": "application/x-www-form-urlencoded",
            }
        )

        # Pre-build templates for rapid execution (reduces logic branches during trade)
        self.templates = {
            "LIMIT": {"type": "LIMIT", "timeInForce": "GTC"},
            "POST_ONLY": {
                "type": "LIMIT",
                "timeInForce": "GTX",
            },  # GTX = Good Till Crossing (Post-Only)
            "IOC": {"type": "LIMIT", "timeInForce": "IOC"},  # IOC = Immediate or Cancel
        }

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

        Args:
            symbol: Trading pair (e.g., 'BTCUSDT')
            side: 'BUY' or 'SELL'
            quantity: Amount to trade
            price: Order price
            order_type: 'LIMIT', 'POST_ONLY', or 'IOC'
        """
        endpoint = "/fapi/v1/order"

        # Current millisecond timestamp
        ts = int(time.time() * 1000)

        # Base parameters
        params = {
            "symbol": symbol.upper(),
            "side": side.upper(),
            "quantity": str(quantity),  # API expects strings or specific precision
            "price": str(price),
            "timestamp": ts,
            "recvWindow": 5000,
        }

        # Merge with pre-built template for specific order behavior
        params.update(self.templates.get(order_type.upper(), self.templates["LIMIT"]))

        # HMAC signing across all params
        params["signature"] = self.signer.sign(params)

        # Immediate execution via persistent session
        try:
            # Note: Toobit uses POST for order placement
            response = self.session.post(
                f"{self.base_url}{endpoint}", data=params, timeout=5
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            # Log error details for debugging
            error_info = {
                "status": "ERROR",
                "message": str(e),
                "endpoint": endpoint,
                "symbol": symbol,
                "ts": ts,
            }
            if hasattr(e, "response") and e.response is not None:
                try:
                    error_info["response"] = e.response.json()
                except:
                    error_info["response_text"] = e.response.text
            return error_info


def execute_from_memory(client: ToobitUSDTMClient, memory_key: str = "pending_order"):
    """
    Simulates reading from a memory key and executing the order.
    In a full Ruflo/MCP environment, this would call memory_search or memory_store.
    """
    # 1. Attempt to find the pending order in environment (set by previous agent/swarm)
    order_raw = os.getenv(memory_key.upper())

    # 2. Check for local persistence if environment is empty
    if not order_raw:
        path = os.path.join(os.getcwd(), f"{memory_key}.json")
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    order_raw = f.read()
            except Exception:
                pass

    if not order_raw:
        return {
            "status": "SKIPPED",
            "reason": f"No order found in memory key: {memory_key}",
        }

    try:
        order = json.loads(order_raw)
        result = client.place_order(
            symbol=order.get("symbol"),
            side=order.get("side"),
            quantity=order.get("quantity"),
            price=order.get("price"),
            order_type=order.get("type", "LIMIT"),
        )
        return {"status": "EXECUTED", "memory_key": memory_key, "api_response": result}
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Toobit USDT-M Perp Order Executor")
    parser.add_argument("--symbol", help="e.g. BTCUSDT")
    parser.add_argument("--side", choices=["BUY", "SELL"])
    parser.add_argument("--qty", type=float)
    parser.add_argument("--price", type=float)
    parser.add_argument(
        "--type", choices=["LIMIT", "POST_ONLY", "IOC"], default="LIMIT"
    )
    parser.add_argument(
        "--execute-pending",
        action="store_true",
        help="Execute order from 'pending_order' memory",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Show parameters without sending"
    )

    args = parser.parse_args()

    # Priority: Env vars for API keys
    api_key = os.getenv("TOOBIT_API_KEY")
    api_secret = os.getenv("TOOBIT_API_SECRET")

    if not api_key or not api_secret:
        # Check trading.env as fallback
        print("Warning: TOOBIT_API_KEY/SECRET not in env. Check trading.env?")
        sys.exit(1)

    client = ToobitUSDTMClient(api_key, api_secret)

    if args.execute_pending:
        res = execute_from_memory(client)
        print(json.dumps(res, indent=2))
    elif args.symbol and args.side and args.qty and args.price:
        if args.dry_run:
            print(
                f"[DRY RUN] Would place {args.type} {args.side} {args.qty} {args.symbol} @ {args.price}"
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
