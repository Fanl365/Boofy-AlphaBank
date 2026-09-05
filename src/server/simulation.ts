import type { LiveSnapshot, PortfolioSummary, RiskBand, TransactionSummary } from '../shared/types.js';

type Point={day:string;principal:number;realized:number};
const now=()=>new Date();
let tick=0, marketPrice=1.0000, tvl=1_248_320, users=1582, realized=230_421, yieldPct=18.6;
let portfolio:PortfolioSummary={wallet:'0x3a2fAlphaBankDemo9c1d',depositedUsd:5000,principalUsd:4872.30,realizedUsdt:348.21,claimableUsdt:48.12,netPnlUsd:268.63,netPnlPct:5.37};
let perf:Point[]=[{day:'-6m',principal:96.3,realized:1.9},{day:'-5m',principal:96.9,realized:2.6},{day:'-4m',principal:97.2,realized:3.5},{day:'-3m',principal:97.8,realized:4.4},{day:'-2m',principal:98.4,realized:5.2},{day:'-1m',principal:98.8,realized:6.1},{day:'Now',principal:99.4,realized:7.0}];
let events:TransactionSummary[]=[];
const rand=(min:number,max:number)=>min+Math.random()*(max-min);
const band=(s:number):RiskBand=>s<45?'Low':s<75?'Moderate':'Elevated';
function addEvent(type:TransactionSummary['type'],asset:string,amount:string){events.unshift({id:`live-${Date.now()}-${tick}`,type,asset,amount,status:'Simulated',timestamp:now().toISOString()});events=events.slice(0,8)}
export function stepSimulation():LiveSnapshot{
 tick++;
 const drift=rand(-0.0018,0.0022); marketPrice=Math.max(.92,Math.min(1.08,marketPrice*(1+drift)));
 tvl=Math.max(1_100_000,tvl*(1+drift*.45)+rand(-220,360)); users=Math.max(1500,Math.round(users+(Math.random()<.22?1:0)));
 portfolio.principalUsd=Math.max(4300,Math.min(5400,portfolio.principalUsd*(1+drift*.9)));
 portfolio.claimableUsdt+=rand(.03,.22); realized+=rand(.15,.85); yieldPct=Math.max(16.8,Math.min(20.4,yieldPct+rand(-.025,.035)));
 if(tick%11===0){const amt=Math.min(portfolio.claimableUsdt*.72,25+rand(0,18));portfolio.claimableUsdt-=amt;portfolio.realizedUsdt+=amt;realized+=amt;addEvent('Realize','USDT',`${amt.toFixed(2)} USDT`)}
 if(tick%7===0)addEvent('Harvest','RWD',`${rand(7,18).toFixed(2)} RWD`);
 portfolio.netPnlUsd=portfolio.principalUsd+portfolio.realizedUsdt+portfolio.claimableUsdt-portfolio.depositedUsd; portfolio.netPnlPct=portfolio.netPnlUsd/portfolio.depositedUsd*100;
 const drawdown=Math.max(0,(portfolio.depositedUsd-portfolio.principalUsd)/portfolio.depositedUsd); const riskScore=Math.round(Math.max(34,Math.min(88,52+drawdown*220+Math.abs(drift)*3500+rand(-3,3))));
 perf=[...perf.slice(-6),{day:now().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}),principal:Number((portfolio.principalUsd/50).toFixed(2)),realized:Number(((portfolio.realizedUsdt+portfolio.claimableUsdt)/55).toFixed(2))}];
 return {tick,generatedAt:now().toISOString(),marketPrice:Number(marketPrice.toFixed(5)),tvlUsd:Number(tvl.toFixed(2)),users,realizedUsdt:Number(realized.toFixed(2)),realizedYield:Number(yieldPct.toFixed(2)),portfolio:{...portfolio,principalUsd:Number(portfolio.principalUsd.toFixed(2)),realizedUsdt:Number(portfolio.realizedUsdt.toFixed(2)),claimableUsdt:Number(portfolio.claimableUsdt.toFixed(2)),netPnlUsd:Number(portfolio.netPnlUsd.toFixed(2)),netPnlPct:Number(portfolio.netPnlPct.toFixed(2))},riskScore,riskBand:band(riskScore),events:[...events],performance:[...perf]};
}
let snapshot=stepSimulation();
export const getLiveSnapshot=()=>snapshot;
setInterval(()=>{snapshot=stepSimulation()},2000).unref();
