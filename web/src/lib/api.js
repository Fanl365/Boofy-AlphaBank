async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`Request failed: ${res.status}`);
    return res.json();
}
async function postJson(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok)
        throw new Error(`Request failed: ${res.status}`);
    return res.json();
}
const api = {
    health: () => getJson('/api/health'),
    system: () => getJson('/api/system'),
    vaults: () => getJson('/api/vaults'),
    strategies: () => getJson('/api/strategies'),
    transactions: () => getJson('/api/transactions'),
    insight: () => getJson('/api/ai/insight'),
    analyze: (riskPreference = 'balanced') => postJson('/api/ai/analyze', { riskPreference }),
    performance: () => getJson('/api/performance'),
    portfolio: (wallet) => getJson(`/api/portfolio/${encodeURIComponent(wallet)}`),
    live: () => getJson('/api/live'),
};

module.exports = { api };
