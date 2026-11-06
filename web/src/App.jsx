const { useEffect, useMemo, useRef, useState } = require('react');
const { Activity, BrainCircuit, CircleDollarSign, LayoutDashboard, Layers3, Network, Settings, TrendingUp, WalletCards } = require('lucide-react');
const { api } = require('./lib/api');
const { HomePage } = require('./components/HomePage');
const { BankPage, DashboardPage, IntelligencePage, PortfolioPage, SettingsPage, StakingPage, StrategiesPage, TransactionsPage } = require('./components/PageViews');
require('./home-v2.css');
require('./styles.css');
const nav = [['dashboard', 'Dashboard', LayoutDashboard], ['staking', 'Staking', Layers3], ['bank', 'USDT Bank', CircleDollarSign], ['strategies', 'Strategies', TrendingUp], ['intelligence', 'AI Intelligence', BrainCircuit], ['portfolio', 'Portfolio', WalletCards], ['transactions', 'Transactions', Activity], ['settings', 'Settings', Settings]];
function App() {
    const [vaults, setVaults] = useState([]), [strategies, setStrategies] = useState([]), [transactions, setTransactions] = useState([]), [system, setSystem] = useState(null), [insight, setInsight] = useState(null), [performance, setPerformance] = useState([]), [portfolio, setPortfolio] = useState(null);
    const [wallet, setWallet] = useState('0x3a2f...9c1d'), [section, setSection] = useState('dashboard'), [aiLoading, setAiLoading] = useState(false), [connected, setConnected] = useState(false), [live, setLive] = useState(null), [walletMenu, setWalletMenu] = useState(false);
    const walletMenuRef = useRef(null);
    useEffect(() => { const es = new EventSource('/api/live/stream'); es.onmessage = (e) => { try {
        const s = JSON.parse(e.data);
        setLive(s);
        setPortfolio({ ...s.portfolio, wallet });
        setPerformance(s.performance);
        if (s.events.length)
            setTransactions(prev => [...s.events, ...prev.filter(x => !x.id.startsWith('live-'))].slice(0, 12));
        setVaults(prev => prev.map((v, i) => i ? v : { ...v, tvlUsd: s.tvlUsd, realizedUsdt: s.realizedUsdt, realizedYield: s.realizedYield }));
        setInsight(prev => prev ? { ...prev, riskScore: s.riskScore, headline: `${s.riskBand} Risk — live demo policy response` } : prev);
    }
    catch { } }; return () => es.close(); }, [wallet]);
    useEffect(() => { Promise.all([api.vaults(), api.strategies(), api.transactions(), api.system(), api.insight(), api.performance(), api.portfolio('0x3a2fAlphaBankDemo9c1d')]).then(([v, s, t, sys, i, perf, pf]) => { setVaults(v); setStrategies(s); setTransactions(t); setSystem(sys); setInsight(i); setPerformance(perf); setPortfolio(pf); }).catch(console.error); }, []);
    useEffect(() => { const close = (e) => { if (walletMenuRef.current && !walletMenuRef.current.contains(e.target))
        setWalletMenu(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
    const logout = () => { setWalletMenu(false); setConnected(false); setSection('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const totals = useMemo(() => ({ tvl: vaults.reduce((a, v) => a + v.tvlUsd, 0), realized: vaults.reduce((a, v) => a + v.realizedUsdt, 0), yield: vaults[0]?.realizedYield ?? 18.6 }), [vaults]);
    const lookup = async () => { if (wallet.trim())
        setPortfolio(await api.portfolio(wallet.trim())); };
    const runAi = async () => { setAiLoading(true); try {
        setInsight(await api.analyze('balanced'));
    }
    finally {
        setAiLoading(false);
    } };
    if (!connected)
        return <HomePage onConnect={() => setConnected(true)} tvl={totals.tvl || 12_400_000} realizedProfit={totals.realized || 230_421} realizedYield={totals.yield} riskScore={insight?.riskScore ?? 72}/>;
    const props = { vaults, strategies, transactions, insight, portfolio, performance, system, wallet, setWallet, lookup, runAi, aiLoading };
    const pages = { dashboard: <DashboardPage {...props}/>, staking: <StakingPage {...props}/>, bank: <BankPage {...props}/>, strategies: <StrategiesPage {...props}/>, intelligence: <IntelligencePage {...props}/>, portfolio: <PortfolioPage {...props}/>, transactions: <TransactionsPage {...props}/>, settings: <SettingsPage {...props}/> };
    return <div className="product-shell"><aside className="sidebar"><button className="brand-lockup" onClick={() => setSection('dashboard')}><span className="brand-mark"><span className="brand-crop"/></span><span className="brand-copy"><strong>Boofy</strong><small>BUILD · CONNECT · GROW</small></span></button><nav className="side-nav">{nav.map(([id, label, Icon]) => <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}><Icon size={19}/><span>{label}</span></button>)}</nav><div className="sidebar-footer"><strong>Boofy AlphaBank</strong><span>Real Yield. Real Profit. A Smarter DeFi.</span><small>v0.8.2 · Live Simulation</small></div></aside><div className="main-column"><header className="topbar"><div className="page-name"><small>BOOFY /</small><strong>{nav.find(n => n[0] === section)?.[1]}</strong></div><div className="live-pill"><i /><span>LIVE DEMO</span><b>{live ? `#${live.tick}` : 'connecting'}</b></div><button className="network-chip"><Network size={16}/><span>Demo Network</span><i /></button><div className="wallet-menu-wrap" ref={walletMenuRef}><button className="wallet-chip" onClick={() => setWalletMenu(v => !v)} aria-expanded={walletMenu}><span className="wallet-dot"/><span>{wallet}</span><i /></button>{walletMenu && <div className="wallet-dropdown"><small>DEMO WALLET</small><strong>{wallet}</strong><button onClick={logout}>Log Out</button></div>}</div></header><main className="app-main">{pages[section]}</main><footer className="app-footer"><span>Boofy AlphaBank · Live demo simulation — values are simulated</span><span>BUILD · CONNECT · GROW</span></footer></div></div>;
}
module.exports = App;
