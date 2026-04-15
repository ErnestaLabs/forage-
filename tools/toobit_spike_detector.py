#!/usr/bin/env python3
import time
import json
import os
import numpy as np
from collections import deque
from typing import Dict, List, Optional


class SpikeDetector:
    """
    Detects short-lived price dislocations on Toobit.
    Uses sliding window for volatility calculation and spike detection.
    """

    def __init__(
        self,
        symbol: str,
        window_secs: int = 10,
        vol_window_mins: int = 15,
        spike_std_dev: float = 2.5,
        spike_percent: float = 0.7,
    ):
        self.symbol = symbol
        self.window_secs = window_secs
        self.spike_std_dev = spike_std_dev
        self.spike_percent = spike_percent

        # Historical prices for volatility (1s resolution)
        self.history = deque(maxlen=vol_window_mins * 60)
        # Recent window for spike detection
        self.recent_prices = deque(maxlen=window_secs)
        self.recent_volumes = deque(maxlen=window_secs)  # (qty, side)

        self.p_ref = None  # Pre-spike reference price

    def update(self, price: float, volume: float, side: str):
        """
        Update state with new trade data.
        side: 'BUY' (aggressive buy) or 'SELL' (aggressive sell)
        """
        self.history.append(price)
        self.recent_prices.append(price)
        self.recent_volumes.append((volume, side))

        if len(self.history) < 60:  # Need at least 1 min for baseline
            return None

        # Check for spike
        return self.check_spike()

    def get_volatility(self):
        if len(self.history) < 2:
            return 0
        return np.std(self.history)

    def check_spike(self) -> Optional[Dict]:
        if len(self.recent_prices) < self.window_secs:
            return None

        p_start = self.recent_prices[0]
        p_end = self.recent_prices[-1]
        p_low = min(self.recent_prices)
        p_high = max(self.recent_prices)

        move_pct = abs(p_end - p_start) / p_start * 100
        vol = self.get_volatility()
        std_move = abs(p_end - p_start) / vol if vol > 0 else 0

        # 1. SPIKE DETECTION
        is_spike = (move_pct >= self.spike_percent) or (std_move >= self.spike_std_dev)
        if not is_spike:
            return None

        # 2. ONE-SIDED VOLUME CHECK
        buy_vol = sum(v[0] for v in self.recent_volumes if v[1] == "BUY")
        sell_vol = sum(v[0] for v in self.recent_volumes if v[1] == "SELL")
        total_vol = buy_vol + sell_vol

        if total_vol == 0:
            return None

        bias = 0
        direction = None
        if p_end > p_start:
            bias = buy_vol / total_vol
            direction = "UP"
        else:
            bias = sell_vol / total_vol
            direction = "DOWN"

        if bias < 0.8:  # Must be 80% one-sided
            return None

        # 3. EXHAUSTION / SNAP-BACK HINTS
        # (Simplified: if price has started to move back from the extreme)
        exhausted = False
        if direction == "UP" and p_end < p_high:
            exhausted = True
        elif direction == "DOWN" and p_end > p_low:
            exhausted = True

        if not exhausted:
            return None

        # Success! Return spike data
        return {
            "symbol": self.symbol,
            "direction": direction,
            "p_ref": p_start,
            "extreme": p_high if direction == "UP" else p_low,
            "current": p_end,
            "move_pct": move_pct,
            "std_move": std_move,
            "timestamp": time.time(),
        }


def monitor_memory_spike(spike_data: Dict):
    """Writes spike data to shared memory key."""
    path = os.path.join(os.getcwd(), "market_spike.json")
    with open(path, "w") as f:
        json.dump(spike_data, f)
    print(
        f"Spike detected and written to market_spike.json: {spike_data['symbol']} {spike_data['direction']}"
    )


if __name__ == "__main__":
    # Example usage / mock test
    detector = SpikeDetector("BTCUSDT")

    # Simulate some normal prices
    base = 65000
    for _ in range(100):
        detector.update(
            base + np.random.normal(0, 10),
            1.0,
            "BUY" if np.random.random() > 0.5 else "SELL",
        )

    # Simulate a sudden DOWN spike (liquidations)
    spike_base = detector.recent_prices[-1]
    for i in range(10):
        price = spike_base * (1 - (i + 1) * 0.001)  # -1% over 10 steps
        res = detector.update(price, 10.0, "SELL")
        if res:
            monitor_memory_spike(res)
            break

    # Simulate a snap-back
    if not res:
        price = price * 1.001  # Move back up slightly
        res = detector.update(price, 2.0, "BUY")
        if res:
            monitor_memory_spike(res)
