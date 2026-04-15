#!/usr/bin/env python3
import json
import os
import time
from typing import Dict, Optional


class RiskManager:
    """
    Enforces risk limits for Toobit Sweeper.
    Tracks drawdown and max exposure.
    """

    def __init__(
        self,
        max_symbol_exposure: float = 1000.0,  # Nominal USDT
        max_portfolio_exposure: float = 5000.0,
        max_daily_drawdown_pct: float = 3.0,
    ):
        self.max_symbol_exposure = max_symbol_exposure
        self.max_portfolio_exposure = max_portfolio_exposure
        self.max_daily_drawdown_pct = max_daily_drawdown_pct

        self.start_balance = 0.0
        self.current_balance = 0.0
        self.realized_pnl = 0.0
        self.open_positions: Dict[str, Dict] = {}

        self.memory_path = os.path.join(os.getcwd(), "toobit_risk.json")
        self.load_state()

    def load_state(self):
        if os.path.exists(self.memory_path):
            try:
                with open(self.memory_path, "r") as f:
                    state = json.load(f)
                    self.realized_pnl = state.get("realized_pnl", 0.0)
                    self.start_balance = state.get("start_balance", 0.0)
            except Exception:
                pass

    def save_state(self):
        state = {
            "realized_pnl": self.realized_pnl,
            "start_balance": self.start_balance,
            "timestamp": time.time(),
        }
        with open(self.memory_path, "w") as f:
            json.dump(state, f)

    def check_halt(self) -> bool:
        if self.start_balance == 0:
            return False

        drawdown_pct = abs(min(0, self.realized_pnl)) / self.start_balance * 100
        if drawdown_pct >= self.max_daily_drawdown_pct:
            return True  # HALT
        return False

    def can_trade(self, symbol: str, nominal_size: float) -> Dict:
        if self.check_halt():
            return {"can_trade": False, "reason": "DAILY_DRAWDOWN_LIMIT_HIT"}

        # Check symbol exposure
        current_symbol_exp = self.open_positions.get(symbol, {}).get("nominal", 0.0)
        if current_symbol_exp + nominal_size > self.max_symbol_exposure:
            return {"can_trade": False, "reason": "SYMBOL_EXPOSURE_LIMIT_HIT"}

        # Check portfolio exposure
        total_exp = sum(p.get("nominal", 0.0) for p in self.open_positions.values())
        if total_exp + nominal_size > self.max_portfolio_exposure:
            return {"can_trade": False, "reason": "PORTFOLIO_EXPOSURE_LIMIT_HIT"}

        return {"can_trade": True}

    def update_pnl(self, pnl: float):
        self.realized_pnl += pnl
        self.save_state()


if __name__ == "__main__":
    # Test
    rm = RiskManager(max_daily_drawdown_pct=1.0)
    rm.start_balance = 1000.0

    print("Initial check:", rm.can_trade("BTCUSDT", 100))

    rm.update_pnl(-15.0)  # Lose $15 (1.5%)
    print("After loss check:", rm.can_trade("BTCUSDT", 100))
    print("Halt status:", rm.check_halt())
