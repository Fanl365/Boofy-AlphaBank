import type { AiInsight, PortfolioSummary, StrategySummary, TransactionSummary, VaultSummary } from '../shared/types.js';

export const vaults: VaultSummary[] = [
  {
    id: 'alpha-usdt-01',
    name: 'Alpha Staking Vault',
    symbol: 'ALPHA / USDT',
    network: 'Demo Network',
    tvlUsd: 1_248_320,
    stakingApy: 18.42,
    realizedYield: 18.6,
    realizedUsdt: 230_421,
    risk: 'Moderate',
    status: 'Research',
  },
];

export const strategies: StrategySummary[] = [
  {
    id: 'staking-alpha-01',
    name: 'Alpha Staking Strategy',
    asset: 'TOKEN',
    settlement: 'USDT',
    status: 'Ready for integration',
    risk: 'Moderate',
    harvestPolicy: 'Harvest rewards, realize a risk-adjusted share to USDT, retain optional reinvestment allocation.',
  },
  {
    id: 'reserve-usdt-01',
    name: 'USDT Profit Reserve',
    asset: 'USDT',
    settlement: 'USDT',
    status: 'Research',
    risk: 'Low',
    harvestPolicy: 'Account for realized stablecoin profit separately from volatile principal.',
  },
];

export function portfolioFor(wallet: string): PortfolioSummary {
  const seed = [...wallet].reduce((n, c) => n + c.charCodeAt(0), 0) || 42;
  const deposited = 5000;
  const principal = deposited * (0.952 + (seed % 5) / 1000);
  const realized = 348.21 + (seed % 12);
  const claimable = 48.12 + (seed % 7);
  const pnl = principal + realized + claimable - deposited;
  return {
    wallet,
    depositedUsd: Number(deposited.toFixed(2)),
    principalUsd: Number(principal.toFixed(2)),
    realizedUsdt: Number(realized.toFixed(2)),
    claimableUsdt: Number(claimable.toFixed(2)),
    netPnlUsd: Number(pnl.toFixed(2)),
    netPnlPct: Number(((pnl / deposited) * 100).toFixed(2)),
  };
}

export const aiInsight: AiInsight = {
  headline: 'Moderate Risk — favor disciplined reward realization',
  summary:
    'Market conditions are relatively stable. Alpha Intelligence recommends harvesting a meaningful share of rewards into USDT while keeping principal exposure and reinvestment decisions behind deterministic guardrails.',
  confidence: 84,
  riskScore: 72,
  stance: 'Balanced',
  factors: [
    'Consider harvesting rewards within the next 2–3 days under current demo conditions.',
    'USDT realization is tracking above the simulated baseline.',
    'No critical risk trigger is active in the current policy model.',
  ],
};

export const performance = [
  { day: 'Aug 30', principal: 96.3, realized: 1.9 },
  { day: 'Aug 31', principal: 96.9, realized: 2.6 },
  { day: 'Sep 01', principal: 97.2, realized: 3.5 },
  { day: 'Sep 02', principal: 97.8, realized: 4.4 },
  { day: 'Sep 03', principal: 98.4, realized: 5.2 },
  { day: 'Sep 04', principal: 98.8, realized: 6.1 },
  { day: 'Sep 05', principal: 99.4, realized: 7.0 },
];

export const transactions: TransactionSummary[] = [
  { id: 'tx-001', type: 'Deposit', asset: 'TOKEN', amount: '5,000.00 USD eq.', status: 'Simulated', timestamp: '2026-09-03T11:15:00Z' },
  { id: 'tx-002', type: 'Harvest', asset: 'RWD', amount: '412.70', status: 'Simulated', timestamp: '2026-09-04T08:35:00Z' },
  { id: 'tx-003', type: 'Realize', asset: 'USDT', amount: '348.21', status: 'Simulated', timestamp: '2026-09-04T08:37:00Z' },
  { id: 'tx-004', type: 'Claim', asset: 'USDT', amount: '40.00', status: 'Simulated', timestamp: '2026-09-05T02:10:00Z' },
];
