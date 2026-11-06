# AlphaBank Analytics

The drawdown and harvest-allocation policy now lives in the Node.js module `src/analytics/riskPolicy.js`.

Run it with:

```bash
npm run test:risk
```

This is a decision-support sandbox, not a live trading bot. The Express API applies the same policy to the live demo portfolio at `GET /api/risk/policy`.
