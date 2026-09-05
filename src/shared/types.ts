export type RiskBand = 'Low' | 'Moderate' | 'Elevated';

export interface VaultSummary {
  id: string;
  name: string;
  symbol: string;
  network: string;
  tvlUsd: number;
  stakingApy: number;
  realizedYield: number;
  realizedUsdt: number;
  risk: RiskBand;
  status: 'Research' | 'Testnet' | 'Live';
}

export interface PortfolioSummary {
  wallet: string;
  depositedUsd: number;
  principalUsd: number;
  realizedUsdt: number;
  claimableUsdt: number;
  netPnlUsd: number;
  netPnlPct: number;
}

export interface AiInsight {
  headline: string;
  summary: string;
  confidence: number;
  riskScore: number;
  stance: 'Conservative' | 'Balanced' | 'Opportunistic';
  factors: string[];
}

export interface HealthStatus {
  ok: boolean;
  service: string;
  version: string;
  mode: string;
}

export interface StrategySummary {
  id: string;
  name: string;
  asset: string;
  settlement: string;
  status: 'Research' | 'Ready for integration';
  risk: RiskBand;
  harvestPolicy: string;
}

export interface TransactionSummary {
  id: string;
  type: 'Deposit' | 'Harvest' | 'Realize' | 'Claim';
  asset: string;
  amount: string;
  status: 'Simulated' | 'Indexed';
  timestamp: string;
}

export interface SystemStatus {
  api: string[];
  contracts: string[];
  integrations: {
    rpc: 'configured' | 'not-configured';
    vaultAddress: 'configured' | 'not-configured';
    aiProvider: 'demo-policy' | 'configured';
  };
}


export interface LiveSnapshot {
  tick: number;
  generatedAt: string;
  marketPrice: number;
  tvlUsd: number;
  users: number;
  realizedUsdt: number;
  realizedYield: number;
  portfolio: PortfolioSummary;
  riskScore: number;
  riskBand: RiskBand;
  events: TransactionSummary[];
  performance: Array<{ day: string; principal: number; realized: number }>;
}
