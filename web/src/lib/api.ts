import type { AiInsight, HealthStatus, LiveSnapshot, PortfolioSummary, StrategySummary, SystemStatus, TransactionSummary, VaultSummary } from '../../../src/shared/types';

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  health: () => getJson<HealthStatus>('/api/health'),
  system: () => getJson<SystemStatus>('/api/system'),
  vaults: () => getJson<VaultSummary[]>('/api/vaults'),
  strategies: () => getJson<StrategySummary[]>('/api/strategies'),
  transactions: () => getJson<TransactionSummary[]>('/api/transactions'),
  insight: () => getJson<AiInsight>('/api/ai/insight'),
  analyze: (riskPreference: 'conservative' | 'balanced' | 'opportunistic' = 'balanced') => postJson<AiInsight>('/api/ai/analyze', { riskPreference }),
  performance: () => getJson<Array<{ day: string; principal: number; realized: number }>>('/api/performance'),
  portfolio: (wallet: string) => getJson<PortfolioSummary>(`/api/portfolio/${encodeURIComponent(wallet)}`),
  live: () => getJson<LiveSnapshot>('/api/live'),
};
