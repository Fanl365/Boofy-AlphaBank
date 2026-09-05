import unittest
from alphabank.risk_policy import PositionState, evaluate_policy

class RiskPolicyTest(unittest.TestCase):
    def test_increases_realization_during_drawdown(self):
        normal = evaluate_policy(PositionState(10, 9, 100, 10000))
        stressed = evaluate_policy(PositionState(10, 7, 100, 10000))
        self.assertGreater(stressed.realize_to_usdt_pct, normal.realize_to_usdt_pct)
        self.assertAlmostEqual(stressed.drawdown_pct, 0.30)

if __name__ == "__main__": unittest.main()
