from dataclasses import dataclass

@dataclass(frozen=True)
class PositionState:
    entry_price: float
    current_price: float
    realized_usdt: float
    entry_value_usdt: float

@dataclass(frozen=True)
class PolicyConfig:
    normal_realize_pct: float = 0.50
    drawdown_realize_pct: float = 0.80
    severe_drawdown_realize_pct: float = 1.00
    drawdown_threshold: float = 0.15
    severe_drawdown_threshold: float = 0.30

@dataclass(frozen=True)
class PolicyDecision:
    drawdown_pct: float
    realize_to_usdt_pct: float
    reinvest_pct: float
    realized_yield_pct: float
    reason: str

def evaluate_policy(state: PositionState, cfg: PolicyConfig = PolicyConfig()) -> PolicyDecision:
    if state.entry_price <= 0 or state.entry_value_usdt <= 0:
        raise ValueError("entry price/value must be positive")
    drawdown = max(0.0, (state.entry_price - state.current_price) / state.entry_price)
    if drawdown >= cfg.severe_drawdown_threshold:
        realize, reason = cfg.severe_drawdown_realize_pct, "severe drawdown: maximize stablecoin realization"
    elif drawdown >= cfg.drawdown_threshold:
        realize, reason = cfg.drawdown_realize_pct, "drawdown: increase stablecoin realization"
    else:
        realize, reason = cfg.normal_realize_pct, "normal regime"
    realized_yield = state.realized_usdt / state.entry_value_usdt
    return PolicyDecision(drawdown, realize, 1.0 - realize, realized_yield, reason)
