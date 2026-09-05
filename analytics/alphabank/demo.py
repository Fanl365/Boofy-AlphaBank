from .risk_policy import PositionState, evaluate_policy
s = PositionState(entry_price=10.0, current_price=7.5, realized_usdt=420.0, entry_value_usdt=10_000.0)
print(evaluate_policy(s))
