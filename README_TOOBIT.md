# Toobit Sweeper Agent

The Toobit Sweeper Agent is designed to exploit short-lived price dislocations (liquidations, news spikes) on Toobit USDT-M Perpetual Futures. It operates by detecting violent, one-sided moves and capturing the "snap-back" as the price reverts.

## System Components

1.  **Agent Definition**: `Forage_Graph/agents/toobit-sweeper.agent` (Specialized persona)
2.  **Runner**: `toobit_sweeper_runner.py` (Orchestrates the detection and execution loop)
3.  **Spike Detector**: `tools/toobit_spike_detector.py` (Microstructure analysis logic)
4.  **Risk Manager**: `tools/toobit_risk_manager.py` (Enforces drawdown and exposure limits)
5.  **API Client**: `tools/toobit_perp_api.py` (Low-latency HMAC-signed execution)

## Setup

### 1. Environment Variables
Ensure the following are set in your environment or added to `trading.env`:
```bash
TOOBIT_API_KEY=your_api_key
TOOBIT_API_SECRET=your_api_secret
```

### 2. Startup
You can run the sweeper for a specific symbol:
```bash
python toobit_sweeper_runner.py --symbol BTCUSDT
```

## Strategy Logic (The Andres Formula for Trading)

- **Trigger (Intent)**: Detects a price move > 0.7% in < 10s with >80% one-sided volume.
- **Entry (Logical Certainty)**: Waits for "exhaustion" (price starts reverting from the extreme) then places POST_ONLY limit orders.
- **Exit (Emotional Certainty)**: Captures 45% of the spike's recovery move.
- **Stop (Pitch)**: Hard exit at 120s or if price moves 0.3% beyond the spike extreme.

## Logging & Intelligence
All trades and performance metrics are logged to `toobit_sweeper.log` and are ready to be integrated with the Forage Knowledge Graph for collective learning across your agent stack.
