import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, BarChart3, BrainCircuit, CheckCircle2, CircleDollarSign,
  Coins, Cpu, Database, Eye, Globe2, KeyRound, Layers3, LockKeyhole, Network,
  RefreshCw, ShieldCheck, Sparkles, TrendingUp, Wallet, Zap
} from 'lucide-react';

interface HomePageProps {
  onConnect: () => void;
  tvl?: number;
  realizedProfit?: number;
  realizedYield?: number;
  riskScore?: number;
}

type PublicPage = 'home' | 'products' | 'strategies' | 'ai' | 'security' | 'about';

const money = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(value);

const publicNav: Array<[PublicPage, string]> = [
  ['home', 'Home'], ['products', 'Products'], ['strategies', 'Strategies'],
  ['ai', 'AI Intelligence'], ['security', 'Security'], ['about', 'About'],
];

export function HomePage({
  onConnect,
  tvl = 12_400_000,
  realizedProfit = 230_421,
  realizedYield = 18.6,
  riskScore = 72,
}: HomePageProps) {
  const [page, setPage] = useState<PublicPage>('home');
  const wallets = [['🦊', 'MetaMask'], ['〰', 'WalletConnect'], ['◉', 'Coinbase Wallet'], ['⬡', 'Trust Wallet']];

  const go = (next: PublicPage) => { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="home2-shell">
      <header className="home2-nav">
        <button className="home2-brand" onClick={() => go('home')} aria-label="Boofy AlphaBank home">
          <span className="home2-logo-mark"><span className="brand-crop" /></span>
          <span className="home2-brand-copy"><strong>Boofy</strong><small>BUILD · CONNECT · GROW</small></span>
        </button>
        <nav>
          {publicNav.map(([id, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => go(id)}>{label}</button>)}
        </nav>
        <button className="home2-launch" onClick={onConnect}>Launch App <ArrowRight size={16}/></button>
      </header>

      {page === 'home' ? <>
        <main>
          <section className="home2-hero">
            <div className="home2-stars"/><div className="home2-earth"/>
            <div className="home2-copy">
              <span className="home2-kicker">A MORE OPEN FINANCIAL FUTURE</span>
              <h1>Boofy <em>AlphaBank</em></h1>
              <h2>Staking Yields. Real Profits. Smarter Strategies.</h2>
              <p>Combine DeFi, realized yield, and AI-powered intelligence to turn staking rewards into visible USDT profits while keeping principal risk transparent.</p>
              <div className="home2-actions">
                <button className="home2-metamask" onClick={onConnect}><span>🦊</span> Login with MetaMask <ArrowRight size={18}/></button>
                <button className="home2-demo" onClick={onConnect}>View Demo <ArrowRight size={17}/></button>
              </div>
              <div className="home2-learn">New to AlphaBank? <button onClick={() => go('products')}>Learn how it works <ArrowRight size={13}/></button></div>
            </div>
            <div className="home2-emblem" aria-hidden="true"><div className="home2-b">B</div><div className="home2-motto"><strong>BUILD</strong><strong>CONNECT</strong><strong>GROW</strong><i/><span>DeFi Today<br/>A Better Tomorrow</span></div></div>
            <aside className="home2-wallet-panel"><span className="panel-glow"/><h3>Connect Your Wallet</h3><p>Access AlphaBank and start your journey</p><div className="home2-wallet-list">{wallets.map(([icon,name])=><button key={name} onClick={onConnect}><span className="wallet-icon">{icon}</span><strong>{name}</strong><ArrowRight size={16}/></button>)}</div><small><LockKeyhole size={12}/> Demo mode only. No private keys are requested or stored.</small></aside>
          </section>
          <section className="home2-stats"><article><span><Wallet/></span><div><strong>1,500+</strong><small>Early Community</small></div></article><article><span><Coins/></span><div><strong>{money(tvl)}+</strong><small>Total Value Locked (Demo)</small></div></article><article><span><BarChart3/></span><div><strong>{realizedYield.toFixed(1)}%</strong><small>Average Realized Yield</small></div></article><article><span><ShieldCheck/></span><div><strong>100%</strong><small>Transparency Focused</small></div></article></section>
          <section className="home2-products">
            <div className="home2-products-copy"><span className="home2-kicker">WHY BOOFY ALPHABANK</span><h2>More Than Staking.<br/><em>Real Financial Results.</em></h2><p>AlphaBank separates principal from realized stablecoin profit, makes drawdown visible, and adds an AI-assisted decision layer without giving AI unrestricted custody.</p><button onClick={() => go('ai')}>Explore AI Features <ArrowRight size={15}/></button></div>
            <div className="home2-product-grid"><article><span className="feature-icon green"><Layers3/></span><h3>Stake</h3><p>Deposit tokens into defined DeFi strategy modules.</p></article><article><span className="feature-icon purple"><RefreshCw/></span><h3>Harvest</h3><p>Collect staking rewards automatically or manually.</p></article><article><span className="feature-icon orange"><CircleDollarSign/></span><h3>Realize</h3><p>Convert rewards to USDT and separate realized profit from principal.</p></article><article><span className="feature-icon blue"><BrainCircuit/></span><h3>Intelligence</h3><p>AI explains risk posture, market conditions and strategy choices.</p></article></div>
          </section>
          <section className="home2-product-vision"><div className="home2-mountain-copy"><span className="home2-kicker">YOUR ASSETS. A SMARTER TOMORROW.</span><h2>Real Yield.<br/>Visible Risk.<br/>Better Decisions.</h2><p>Powered by DeFi. Enhanced by AI. Built around transparent accounting rather than headline APY alone.</p><button className="text-link" onClick={()=>go('security')}>Explore security architecture <ArrowRight size={14}/></button></div><DashboardPreview tvl={tvl} realizedProfit={realizedProfit} realizedYield={realizedYield} riskScore={riskScore}/></section>
          <section className="home2-final-cta"><div><Sparkles/><span><small>BOOFY ALPHABANK</small><h2>See the product, then help us build the next layer.</h2></span></div><button onClick={onConnect}><Zap size={17}/> Enter AlphaBank Demo</button></section>
        </main>
      </> : <PublicContent page={page} go={go} onConnect={onConnect} tvl={tvl} realizedProfit={realizedProfit} realizedYield={realizedYield} riskScore={riskScore}/>} 
      <footer className="home2-footer"><span>Boofy AlphaBank</span><small>BUILD · CONNECT · GROW · Research MVP</small><span><Globe2 size={14}/> DeFi + AI</span></footer>
    </div>
  );
}

function PublicContent({ page, go, onConnect, tvl, realizedProfit, realizedYield, riskScore }: { page: Exclude<PublicPage,'home'>; go:(p:PublicPage)=>void; onConnect:()=>void; tvl:number; realizedProfit:number; realizedYield:number; riskScore:number }) {
  const content = {
    products: {
      kicker:'ALPHABANK PRODUCTS', title:'One system. Four coordinated financial layers.', subtitle:'A product architecture built around principal, realized profit, strategy execution and transparent analytics.', icon:<Layers3/>,
      cards:[
        ['Alpha Staking Vault','Principal enters a vault, receives shares and is deployed through a narrow strategy interface.','Deposit · Shares · Withdraw'],
        ['USDT Profit Bank','Harvested reward value is realized separately into USDT so users can distinguish token exposure from banked profit.','Harvest · Realize · Claim'],
        ['Portfolio & P&L','Principal value, realized USDT, claimable balance, drawdown and net P&L are presented as separate metrics.','Principal · P&L · Yield'],
        ['Alpha Intelligence','AI and rules interpret market, strategy and portfolio signals before a deterministic execution layer acts.','Analyze · Explain · Recommend'],
      ]
    },
    strategies: {
      kicker:'STRATEGY ARCHITECTURE', title:'Modular DeFi strategies, isolated from the vault.', subtitle:'The current MVP uses strategy interfaces and mocks so a production developer can replace them with verified protocol adapters without rewriting the product.', icon:<TrendingUp/>,
      cards:[
        ['Staking Strategy','Deploy principal into a selected staking protocol and expose managed assets through a consistent interface.','IAlphaStrategy'],
        ['Reward Harvesting','Collect protocol rewards into the vault while keeping principal accounting independent.','Harvest pipeline'],
        ['Approved Swap Adapter','Convert reward tokens into USDT through allowlisted adapters and enforce minimum output checks.','IAlphaSwapAdapter'],
        ['Future Multi-Strategy','Allocator, caps, emergency unwind and strategy migration are planned behind the same product layer.','Roadmap module'],
      ]
    },
    ai: {
      kicker:'ALPHA INTELLIGENCE', title:'AI assists decisions. Rules and contracts control execution.', subtitle:'AlphaBank is designed so an AI model can explain and recommend without holding keys or receiving unrestricted transaction authority.', icon:<BrainCircuit/>,
      cards:[
        ['Risk Classification','Combine drawdown, volatility, liquidity and strategy signals into understandable risk bands.','Risk score'],
        ['Harvest Intelligence','Estimate whether rewards should be realized, retained or considered for reinvestment based on policy.','Decision support'],
        ['Portfolio Explanation','Turn on-chain and market state into concise explanations a user can understand.','Natural language'],
        ['Structured AI API','The Node.js layer already exposes AI endpoints that can later connect to an LLM provider with schema validation.','/api/ai/*'],
      ]
    },
    security: {
      kicker:'SECURITY MODEL', title:'Designed for visible assumptions and constrained authority.', subtitle:'This is still an unaudited research MVP, but the architecture intentionally limits arbitrary calls and separates advisory AI from asset execution.', icon:<ShieldCheck/>,
      cards:[
        ['Narrow Contract Interfaces','Vault, strategy and swap responsibilities are separated to reduce coupling and review surface.','Solidity'],
        ['Allowlisted Swaps','The profit engine accepts approved adapters instead of arbitrary executor calldata.','Access control'],
        ['No Invented Mainnet State','Production addresses and deployment claims remain unset until independently verified.','Verification'],
        ['Production Gate','Fuzz, invariant, fork tests, testnet, multisig/timelock and independent audit are required before meaningful TVL.','Pre-mainnet'],
      ]
    },
    about: {
      kicker:'ABOUT BOOFY', title:'Build · Connect · Grow.', subtitle:'Boofy AlphaBank is a new DeFi research product focused on realized stablecoin profit, transparent portfolio accounting and AI-assisted risk intelligence.', icon:<Globe2/>,
      cards:[
        ['Product Mission','Go beyond nominal staking APY by showing principal movement and realized stablecoin profit side by side.','Real yield focus'],
        ['Technology','Node.js/TypeScript, React, Solidity and a Python risk sandbox form the current developer-facing MVP.','Full stack'],
        ['Open Development','The project is structured for GitHub collaboration, testnet iteration and clear developer handoff.','Boofy-AlphaBank'],
        ['Current Stage','V8 remains a research/demo product. Wallet login and market metrics are simulated until real integrations are selected.','Research MVP'],
      ]
    }
  }[page];
  return <main className="public-page"><section className="public-hero"><div className="public-hero-glow"/><button className="public-back" onClick={()=>go('home')}><ArrowLeft size={15}/> Home</button><div className="public-title-icon">{content.icon}</div><span className="home2-kicker">{content.kicker}</span><h1>{content.title}</h1><p>{content.subtitle}</p><div className="public-actions"><button className="home2-metamask" onClick={onConnect}>Launch AlphaBank Demo <ArrowRight size={17}/></button>{page!=='about'&&<button className="home2-demo" onClick={()=>go(page==='products'?'strategies':page==='strategies'?'ai':page==='ai'?'security':'about')}>Continue Tour <ArrowRight size={16}/></button>}</div></section><section className="public-card-grid">{content.cards.map(([title,body,tag],i)=><article key={title}><span className="public-number">0{i+1}</span><h3>{title}</h3><p>{body}</p><small>{tag}</small></article>)}</section>{page==='products'&&<section className="public-data-band"><div><small>Demo TVL</small><strong>{money(tvl)}</strong></div><div><small>Realized USDT</small><strong>{money(realizedProfit)}</strong></div><div><small>Realized Yield</small><strong>{realizedYield.toFixed(1)}%</strong></div><div><small>AI Risk</small><strong>{riskScore}/100</strong></div></section>}{page==='ai'&&<section className="public-architecture"><div><Database/><strong>Blockchain + Market Data</strong></div><ArrowRight/><div><Cpu/><strong>Analytics + Policy</strong></div><ArrowRight/><div><BrainCircuit/><strong>AI Recommendation</strong></div><ArrowRight/><div><CheckCircle2/><strong>Rules Validate</strong></div><ArrowRight/><div><Network/><strong>Contract Execution</strong></div></section>}{page==='security'&&<section className="public-security-note"><KeyRound/><div><strong>Important MVP boundary</strong><p>AI is advisory in the current architecture. No model is given custody, private keys, or unrestricted permission to execute transactions.</p></div><Eye/><div><strong>Transparency first</strong><p>Demo values are labeled as simulated, and production addresses remain empty until verified.</p></div></section>}</main>;
}

function DashboardPreview({tvl,realizedProfit,realizedYield,riskScore}:{tvl:number;realizedProfit:number;realizedYield:number;riskScore:number}){
 return <div className="home2-dashboard-preview"><div className="preview-top"><span className="preview-brand">B <b>Boofy</b></span><span className="preview-wallet">0x3a2f...9c1d</span></div><div className="preview-metrics"><div><small>Total Value Locked</small><strong>{money(tvl)}</strong><em>LIVE DEMO</em></div><div><small>Realized USDT Profit</small><strong>{money(realizedProfit)}</strong><em>SIMULATED</em></div><div><small>Average Realized Yield</small><strong>{realizedYield.toFixed(1)}%</strong><em>SIMULATED</em></div></div><div className="preview-bottom"><div className="preview-chart"><div className="preview-chart-title"><TrendingUp size={15}/> Performance Overview</div><svg viewBox="0 0 430 145"><path d="M8 118 C70 112,85 97,140 91 S210 75,260 63 S333 51,420 30" className="preview-line blue-line"/><path d="M8 132 C70 126,105 121,145 112 S222 98,272 87 S350 81,420 68" className="preview-line green-line"/></svg></div><div className="preview-risk"><div className="preview-chart-title"><BrainCircuit size={15}/> AI Risk Score</div><div className="home2-risk-ring"><strong>{riskScore}</strong><small>/100</small></div><b>Moderate Risk</b><p>Strategy remains within expected demo range.</p></div></div></div>
}
