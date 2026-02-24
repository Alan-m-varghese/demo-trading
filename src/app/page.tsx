"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   EXTEJ — Full Multi-Page Black Glassmorphism Crypto Dashboard
   Pages: Markets · Trading · Wallet · Loans · Vaults ·
          Portfolio · Liquidity Pools · Swap · Profile
============================================================ */

// ─── FONTS & GLOBAL STYLES ────────────────────────────────
const bootstrap = () => {
  if (typeof document === "undefined") return;
  if (!document.getElementById("extej-fonts")) {
    const l = document.createElement("link");
    l.id = "extej-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById("extej-css")) {
    const s = document.createElement("style");
    s.id = "extej-css";
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:transparent;}
      ::-webkit-scrollbar-thumb{background:rgba(255,149,0,.22);border-radius:99px;}
      ::-webkit-scrollbar-thumb:hover{background:rgba(255,149,0,.45);}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes orb1{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(70px,-55px)scale(1.12)}66%{transform:translate(-35px,70px)scale(.92)}}
      @keyframes orb2{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(-90px,45px)scale(.88)}66%{transform:translate(55px,-80px)scale(1.18)}}
      @keyframes orb3{0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(55px,55px)scale(1.08)}}
      @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,149,0,.5)}70%{box-shadow:0 0 0 9px rgba(255,149,0,0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
      .nb:hover{background:rgba(255,255,255,.055)!important;color:#fff!important;}
      .nb.act{background:linear-gradient(135deg,rgba(255,140,0,.2),rgba(255,80,0,.1))!important;color:#FF9500!important;border:1px solid rgba(255,140,0,.28)!important;}
      .nb.act .nbadge{background:rgba(255,149,0,.18);color:#FF9500;}
      .wc{transition:all .18s ease;}
      .wc:hover{background:rgba(255,255,255,.045)!important;}
      .wc.sel{background:linear-gradient(135deg,rgba(255,140,0,.16),rgba(255,80,0,.07))!important;border:1px solid rgba(255,140,0,.28)!important;}
      .ab{transition:all .2s ease;}
      .ab:hover{filter:brightness(1.14);transform:translateY(-1px);}
      .ti{transition:background .14s;}
      .ti:hover{background:rgba(255,255,255,.035)!important;}
      .rbtn:hover{background:rgba(255,255,255,.06)!important;}
      .ttab:hover{background:rgba(255,255,255,.055);color:#aaa!important;}
      .glass{background:rgba(255,255,255,.038);backdrop-filter:blur(22px) saturate(180%);-webkit-backdrop-filter:blur(22px) saturate(180%);border:1px solid rgba(255,255,255,.075);}
      .card{background:rgba(255,255,255,.038);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);border:1px solid rgba(255,255,255,.075);border-radius:14px;}
      input::placeholder{color:#444;}
      button{cursor:pointer;}
    `;
    document.head.appendChild(s);
  }
};

// ─── SHARED DATA ─────────────────────────────────────────
const WALLETS = [
  {name:"Bitcoin",         sym:"BTC",  icon:"₿",  bal:"1.95232", usd:"$47,748.42", color:"#F7931A",color2:"#E5550A"},
  {name:"Ethereum",        sym:"ETH",  icon:"Ξ",  bal:"3.000",   usd:"$5,820.00",  color:"#627EEA",color2:"#3C5BD9"},
  {name:"Tether",          sym:"USDT", icon:"₮",  bal:"657.67",  usd:"$657.67",    color:"#26A17B",color2:"#1A7A5E",alert:true},
  {name:"Binance Coin",    sym:"BNB",  icon:"B",  bal:"5.000",   usd:"$1,500.00",  color:"#F3BA2F",color2:"#D4920A"},
  {name:"Polygon",         sym:"MATIC",icon:"⬡",  bal:"1,023",   usd:"$918.00",    color:"#8247E5",color2:"#5E28C4"},
  {name:"Ethereum Classic",sym:"ETC",  icon:"Ξ",  bal:"657.67",  usd:"$14,032.00", color:"#33CC83",color2:"#1EA060"},
  {name:"Dai",             sym:"DAI",  icon:"◈",  bal:"265.19",  usd:"$265.19",    color:"#F5AC37",color2:"#C07810"},
  {name:"Uniswap",         sym:"UNI",  icon:"U",  bal:"7.000",   usd:"$35.00",     color:"#FF007A",color2:"#CC0060"},
  {name:"Fantom",          sym:"FTM",  icon:"F",  bal:"291.89",  usd:"$93.40",     color:"#1969FF",color2:"#0040CC"},
  {name:"Avalanche",       sym:"AVAX", icon:"▲",  bal:"5.000",   usd:"$175.00",    color:"#E84142",color2:"#B01A1B"},
];

const TICKER_DATA = [
  {sym:"BTC",val:"$47,748",chg:"+2.4%",up:true},
  {sym:"ETH",val:"$1,940",chg:"+1.8%",up:true},
  {sym:"BNB",val:"$301",chg:"−0.9%",up:false},
  {sym:"SOL",val:"$138",chg:"+3.2%",up:true},
  {sym:"ADA",val:"$0.43",chg:"−1.1%",up:false},
  {sym:"DOT",val:"$6.80",chg:"+0.5%",up:true},
  {sym:"AVAX",val:"$35",chg:"+4.1%",up:true},
  {sym:"MATIC",val:"$0.89",chg:"+2.0%",up:true},
  {sym:"LINK",val:"$14.20",chg:"+1.3%",up:true},
  {sym:"XRP",val:"$0.61",chg:"−0.7%",up:false},
];

const NAV = [
  {icon:"◎",label:"Markets"},
  {icon:"⚡",label:"Trading"},
  {icon:"◈",label:"Wallet"},
  {icon:"⊕",label:"Loans"},
  {icon:"⊞",label:"Vaults"},
  {icon:"◐",label:"Portfolio"},
  {icon:"≋",label:"Liquidity Pools"},
  {icon:"⇄",label:"Swap"},
];
const NAV_UI = [
  {icon:"≡",label:"Menu Styles"},
  {icon:"⊟",label:"Tables"},
  {icon:"↗",label:"Charts"},
  {icon:"✏",label:"Forms"},
  {icon:"$",label:"Pricing"},
  {icon:"⚙",label:"Settings"},
  {icon:"⬚",label:"Modals/Pop-Ups"},
];

// ─── SPARKLINE ────────────────────────────────────────────
function Spark({color,h=110,seed=0}:{color:string;h?:number;seed?:number}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = useCallback(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.offsetWidth||400, H = h;
    c.width=W; c.height=H;
    const data:number[]=[];
    let v=55+seed*7;
    for(let i=0;i<80;i++){v+=(Math.random()-.46)*7;v=Math.max(15,Math.min(155,v));data.push(v);}
    const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1,p=12;
    const px=(i:number)=>(i/(data.length-1))*(W-p*2)+p;
    const py=(val:number)=>H-p-((val-mn)/rng)*(H-p*2);
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,color+"40");g.addColorStop(.65,color+"10");g.addColorStop(1,color+"00");
    ctx.beginPath();ctx.moveTo(px(0),H);
    data.forEach((_,i)=>ctx.lineTo(px(i),py(data[i])));
    ctx.lineTo(px(data.length-1),H);ctx.closePath();ctx.fillStyle=g;ctx.fill();
    const line=()=>{
      ctx.beginPath();ctx.moveTo(px(0),py(data[0]));
      for(let i=1;i<data.length;i++){const cpx=(px(i-1)+px(i))/2;ctx.bezierCurveTo(cpx,py(data[i-1]),cpx,py(data[i]),px(i),py(data[i]));}
    };
    line();ctx.strokeStyle=color+"55";ctx.lineWidth=7;ctx.lineJoin="round";ctx.stroke();
    line();ctx.strokeStyle=color;ctx.lineWidth=2.2;ctx.stroke();
    ctx.setLineDash([2,7]);ctx.strokeStyle="rgba(255,255,255,.035)";ctx.lineWidth=1;
    for(let g2=1;g2<4;g2++){const y=(H/4)*g2;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(W-p,y);ctx.stroke();}
    ctx.setLineDash([]);
    const lx=px(data.length-1),ly=py(data[data.length-1]);
    ctx.beginPath();ctx.arc(lx,ly,9,0,Math.PI*2);ctx.fillStyle=color+"30";ctx.fill();
    ctx.beginPath();ctx.arc(lx,ly,4,0,Math.PI*2);ctx.fillStyle=color+"bb";ctx.fill();
    ctx.beginPath();ctx.arc(lx,ly,2.5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
  },[color,seed,h]);
  useEffect(()=>{draw();},[draw]);
  return <canvas ref={ref} style={{width:"100%",height:h,display:"block"}}/>;
}

function MiniSpark({color}:{color:string}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
    c.width=56;c.height=22;
    const d=Array.from({length:12},(_,i)=>8+Math.sin(i*.9)*4+Math.random()*3);
    const mn=Math.min(...d),mx=Math.max(...d);
    const px=(i:number)=>(i/11)*54+1;const py=(v:number)=>20-((v-mn)/(mx-mn||1))*16;
    ctx.beginPath();d.forEach((v,i)=>i===0?ctx.moveTo(px(i),py(v)):ctx.lineTo(px(i),py(v)));
    ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();
  },[color]);
  return <canvas ref={ref} style={{width:56,height:22,flexShrink:0}}/>;
}

// ─── SECTION HELPERS ──────────────────────────────────────
const SectionTitle = ({t,sub}:{t:string;sub?:string}) => (
  <div style={{marginBottom:18}}>
    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#F0F0F0",letterSpacing:"-.3px"}}>{t}</div>
    {sub && <div style={{fontSize:11,color:"#444",marginTop:3,fontFamily:"'DM Mono',monospace"}}>{sub}</div>}
  </div>
);

const Badge = ({c,label}:{c:string;label:string}) => (
  <span style={{background:c+"18",border:`1px solid ${c}33`,color:c,borderRadius:20,padding:"2px 10px",fontSize:10,fontFamily:"'DM Mono',monospace"}}>{label}</span>
);

const GlassCard = ({children,style={},anim=0}:{children:React.ReactNode;style?:React.CSSProperties;anim?:number}) => (
  <div className="card" style={{padding:"20px",animation:`fadeUp .35s ease ${anim*0.06}s both`,...style}}>{children}</div>
);

// ══════════════════════════════════════════════════════════
//  PAGE: MARKETS
// ══════════════════════════════════════════════════════════
const MARKET_COINS = [
  {rank:1,name:"Bitcoin",sym:"BTC",icon:"₿",price:"$47,748.42",chg24:"+2.4%",chg7:"+8.2%",mktcap:"$934.2B",vol:"$28.4B",color:"#F7931A",up:true},
  {rank:2,name:"Ethereum",sym:"ETH",icon:"Ξ",price:"$1,940.18",chg24:"+1.8%",chg7:"+5.1%",mktcap:"$233.7B",vol:"$14.2B",color:"#627EEA",up:true},
  {rank:3,name:"Tether",sym:"USDT",icon:"₮",price:"$1.00",chg24:"0.0%",chg7:"0.0%",mktcap:"$91.4B",vol:"$44.7B",color:"#26A17B",up:true},
  {rank:4,name:"BNB",sym:"BNB",icon:"B",price:"$301.54",chg24:"−0.9%",chg7:"−2.3%",mktcap:"$46.2B",vol:"$1.1B",color:"#F3BA2F",up:false},
  {rank:5,name:"Solana",sym:"SOL",icon:"◎",price:"$138.20",chg24:"+3.2%",chg7:"+12.4%",mktcap:"$59.8B",vol:"$2.9B",color:"#9945FF",up:true},
  {rank:6,name:"XRP",sym:"XRP",icon:"✕",price:"$0.612",chg24:"−0.7%",chg7:"−1.8%",mktcap:"$33.1B",vol:"$1.4B",color:"#0085C3",up:false},
  {rank:7,name:"USDC",sym:"USDC",icon:"$",price:"$1.00",chg24:"0.0%",chg7:"0.0%",mktcap:"$28.3B",vol:"$5.8B",color:"#2775CA",up:true},
  {rank:8,name:"Cardano",sym:"ADA",icon:"A",price:"$0.431",chg24:"−1.1%",chg7:"−3.5%",mktcap:"$15.2B",vol:"$0.4B",color:"#0033AD",up:false},
  {rank:9,name:"Avalanche",sym:"AVAX",icon:"▲",price:"$35.10",chg24:"+4.1%",chg7:"+15.3%",mktcap:"$12.8B",vol:"$0.7B",color:"#E84142",up:true},
  {rank:10,name:"Polygon",sym:"MATIC",icon:"⬡",price:"$0.892",chg24:"+2.0%",chg7:"+6.7%",mktcap:"$8.4B",vol:"$0.5B",color:"#8247E5",up:true},
];

function MarketsPage() {
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("rank");
  const filtered=MARKET_COINS.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase())||c.sym.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle t="Markets" sub="Live prices across all tracked assets"/>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {label:"Total Market Cap",val:"$1.82T",chg:"+3.2%",up:true},
          {label:"24h Volume",val:"$98.4B",chg:"+12.1%",up:true},
          {label:"BTC Dominance",val:"51.3%",chg:"+0.4%",up:true},
          {label:"Active Coins",val:"12,847",chg:"",up:null},
        ].map((s,i)=>(
          <GlassCard key={s.label} anim={i}>
            <div style={{fontSize:9,color:"#333",letterSpacing:".12em",marginBottom:7,fontFamily:"'DM Mono',monospace"}}>{s.label}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,color:s.up===null?"#E0E0E0":s.up?"#22C55E":"#EF4444"}}>{s.val}</div>
            {s.chg&&<div style={{fontSize:10,color:s.up?"#22C55E55":"#EF444455",fontFamily:"'DM Mono',monospace",marginTop:4}}>{s.chg}</div>}
          </GlassCard>
        ))}
      </div>
      {/* Table */}
      <GlassCard>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0"}}>All Assets</div>
          <div style={{display:"flex",gap:8}}>
            <div className="glass" style={{display:"flex",alignItems:"center",gap:7,borderRadius:9,padding:"7px 12px"}}>
              <span style={{color:"#444",fontSize:13}}>⌕</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:"none",border:"none",outline:"none",color:"#999",fontSize:12,fontFamily:"'DM Mono',monospace",width:130}}/>
            </div>
          </div>
        </div>
        {/* Table head */}
        <div style={{display:"grid",gridTemplateColumns:"40px 2fr 1fr 1fr 1fr 1.5fr 1.5fr 80px",gap:8,padding:"7px 12px",fontSize:9,color:"#333",letterSpacing:".12em",fontFamily:"'DM Mono',monospace",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          {["#","Asset","Price","24H","7D","Mkt Cap","Volume","Sparkline"].map(h=><span key={h}>{h}</span>)}
        </div>
        {filtered.map((c,i)=>(
          <div key={c.sym} className="ti" style={{display:"grid",gridTemplateColumns:"40px 2fr 1fr 1fr 1fr 1.5fr 1.5fr 80px",gap:8,padding:"11px 12px",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.03)",animation:`fadeUp .3s ease ${i*.04}s both`}}>
            <div style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>{c.rank}</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:30,height:30,borderRadius:8,background:c.color+"18",border:`1px solid ${c.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:c.color,fontWeight:700}}>{c.icon}</div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#D0D0D0",fontFamily:"'Syne',sans-serif"}}>{c.name}</div>
                <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace"}}>{c.sym}</div>
              </div>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:"#E0E0E0",fontFamily:"'DM Mono',monospace"}}>{c.price}</div>
            <div style={{fontSize:12,color:c.up?"#22C55E":"#EF4444",fontFamily:"'DM Mono',monospace"}}>{c.chg24}</div>
            <div style={{fontSize:12,color:c.up?"#22C55E":"#EF4444",fontFamily:"'DM Mono',monospace"}}>{c.chg7}</div>
            <div style={{fontSize:12,color:"#888",fontFamily:"'DM Mono',monospace"}}>{c.mktcap}</div>
            <div style={{fontSize:12,color:"#888",fontFamily:"'DM Mono',monospace"}}>{c.vol}</div>
            <MiniSpark color={c.color}/>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  TRADING — REAL-WORLD PAIR DATA
// ══════════════════════════════════════════════════════════

// Seeded deterministic random (no randomness between renders)
function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// Generate realistic price series for a given coin + timeframe
// Each combo produces a unique deterministic shape
function genPriceSeries(basePrice: number, volatility: number, seed: number, points: number): number[] {
  const rng = seededRng(seed);
  const series: number[] = [];
  let v = basePrice * (0.88 + rng() * 0.12);           // start 88-100% of base
  const drift = (rng() - 0.48) * volatility * 0.04;   // slight trend bias
  for (let i = 0; i < points; i++) {
    const shock = (rng() - 0.5) * volatility * basePrice * 0.025;
    v = Math.max(basePrice * 0.6, v + drift + shock);
    series.push(v);
  }
  // Converge last few points toward basePrice for realism
  for (let i = Math.floor(points * 0.85); i < points; i++) {
    series[i] = series[i] * 0.6 + basePrice * 0.4;
  }
  series[points - 1] = basePrice;
  return series;
}

interface PairInfo {
  label: string;
  baseSym: string;
  icon: string;
  color: string;
  price: number;
  chg24pct: number;
  chgAmt: number;
  vol: string;
  high24: number;
  low24: number;
  vol24: string;
  mktcap: string;
  spreadPct: number;
  amtDecimals: number;
  priceDecimals: number;
  volatility: number;
  // Timeframe seeds — different seed = different chart shape
  seeds: Record<string, number>;
  // Points per timeframe
  points: Record<string, number>;
  // Open orders snippet
  orders: { date: string; side: string; price: string; amt: string; filled: string }[];
}

const PAIR_DATA: Record<string, PairInfo> = {
  "BTC/USDT": {
    label:"BTC/USDT", baseSym:"BTC", icon:"₿", color:"#F7931A",
    price: 47748.42, chg24pct: 2.40, chgAmt: 1127.30,
    vol:"$28.4B", high24: 48920.10, low24: 46120.50,
    vol24:"28,412 BTC", mktcap:"$934.2B", spreadPct: 0.012,
    amtDecimals:3, priceDecimals:2, volatility: 1.0,
    seeds:{ "1H":1001, "4H":1002, "1D":1003, "1W":1004 },
    points:{"1H":60,"4H":96,"1D":120,"1W":168},
    orders:[
      {date:"23 Jul 12:59",side:"Buy", price:"$46,200",amt:"0.1 BTC",filled:"45%"},
      {date:"22 Jul 09:10",side:"Sell",price:"$49,100",amt:"0.05 BTC",filled:"0%"},
      {date:"21 Jul 14:30",side:"Buy", price:"$45,800",amt:"0.2 BTC",filled:"100%"},
    ],
  },
  "ETH/USDT": {
    label:"ETH/USDT", baseSym:"ETH", icon:"Ξ", color:"#627EEA",
    price: 1940.18, chg24pct: 1.80, chgAmt: 34.40,
    vol:"$14.2B", high24: 1998.40, low24: 1882.70,
    vol24:"241,800 ETH", mktcap:"$233.7B", spreadPct: 0.015,
    amtDecimals:3, priceDecimals:2, volatility: 1.2,
    seeds:{ "1H":2001, "4H":2002, "1D":2003, "1W":2004 },
    points:{"1H":60,"4H":96,"1D":120,"1W":168},
    orders:[
      {date:"23 Jul 11:20",side:"Buy", price:"$1,890",amt:"2 ETH",filled:"80%"},
      {date:"22 Jul 15:45",side:"Sell",price:"$2,050",amt:"1.5 ETH",filled:"0%"},
      {date:"21 Jul 08:00",side:"Buy", price:"$1,810",amt:"3 ETH",filled:"100%"},
    ],
  },
  "BNB/USDT": {
    label:"BNB/USDT", baseSym:"BNB", icon:"B", color:"#F3BA2F",
    price: 301.54, chg24pct: -0.90, chgAmt: -2.73,
    vol:"$1.1B", high24: 318.20, low24: 295.80,
    vol24:"3,620 BNB", mktcap:"$46.2B", spreadPct: 0.02,
    amtDecimals:2, priceDecimals:2, volatility: 1.4,
    seeds:{ "1H":3001, "4H":3002, "1D":3003, "1W":3004 },
    points:{"1H":60,"4H":96,"1D":120,"1W":168},
    orders:[
      {date:"23 Jul 10:11",side:"Sell",price:"$315",amt:"5 BNB",filled:"60%"},
      {date:"22 Jul 17:30",side:"Buy", price:"$288",amt:"10 BNB",filled:"100%"},
      {date:"21 Jul 12:00",side:"Buy", price:"$270",amt:"8 BNB",filled:"100%"},
    ],
  },
  "SOL/USDT": {
    label:"SOL/USDT", baseSym:"SOL", icon:"◎", color:"#9945FF",
    price: 138.20, chg24pct: 3.20, chgAmt: 4.28,
    vol:"$2.9B", high24: 145.60, low24: 130.40,
    vol24:"21,000,000 SOL", mktcap:"$59.8B", spreadPct: 0.025,
    amtDecimals:2, priceDecimals:3, volatility: 1.8,
    seeds:{ "1H":4001, "4H":4002, "1D":4003, "1W":4004 },
    points:{"1H":60,"4H":96,"1D":120,"1W":168},
    orders:[
      {date:"23 Jul 09:40",side:"Buy", price:"$130",amt:"20 SOL",filled:"100%"},
      {date:"22 Jul 14:00",side:"Sell",price:"$148",amt:"15 SOL",filled:"0%"},
      {date:"21 Jul 11:15",side:"Buy", price:"$122",amt:"50 SOL",filled:"100%"},
    ],
  },
  "AVAX/USDT": {
    label:"AVAX/USDT", baseSym:"AVAX", icon:"▲", color:"#E84142",
    price: 35.10, chg24pct: 4.10, chgAmt: 1.38,
    vol:"$0.7B", high24: 37.80, low24: 32.90,
    vol24:"19,800,000 AVAX", mktcap:"$12.8B", spreadPct: 0.03,
    amtDecimals:2, priceDecimals:3, volatility: 2.2,
    seeds:{ "1H":5001, "4H":5002, "1D":5003, "1W":5004 },
    points:{"1H":60,"4H":96,"1D":120,"1W":168},
    orders:[
      {date:"23 Jul 13:20",side:"Buy", price:"$33.2",amt:"100 AVAX",filled:"30%"},
      {date:"22 Jul 10:50",side:"Sell",price:"$38.0",amt:"50 AVAX",filled:"0%"},
      {date:"20 Jul 08:30",side:"Buy", price:"$29.5",amt:"200 AVAX",filled:"100%"},
    ],
  },
};

// ── Trading Chart — takes real price series data ───────────
function TradingChart({ data, color, h = 200 }: { data: number[]; color: string; h?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = useCallback(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.offsetWidth || 600; const H = h;
    c.width = W; c.height = H;
    const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1, pd = 14;
    const px = (i: number) => (i / (data.length - 1)) * (W - pd * 2) + pd;
    const py = (v: number) => H - pd - ((v - mn) / rng) * (H - pd * 2);

    // Determine up or down overall
    const up = data[data.length - 1] >= data[0];
    const lineColor = up ? color : "#EF4444";

    // Grid
    ctx.setLineDash([2, 8]); ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
    for (let g = 1; g < 5; g++) { const y = (H / 5) * g; ctx.beginPath(); ctx.moveTo(pd, y); ctx.lineTo(W - pd, y); ctx.stroke(); }
    ctx.setLineDash([]);

    // Fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lineColor + "38"); grad.addColorStop(0.7, lineColor + "0d"); grad.addColorStop(1, lineColor + "00");
    ctx.beginPath(); ctx.moveTo(px(0), H);
    data.forEach((_, i) => ctx.lineTo(px(i), py(data[i])));
    ctx.lineTo(px(data.length - 1), H); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

    // Glow line
    ctx.beginPath(); ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i < data.length; i++) { const cpx = (px(i-1)+px(i))/2; ctx.bezierCurveTo(cpx,py(data[i-1]),cpx,py(data[i]),px(i),py(data[i])); }
    ctx.strokeStyle = lineColor + "55"; ctx.lineWidth = 8; ctx.lineJoin = "round"; ctx.stroke();

    // Sharp line
    ctx.beginPath(); ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i < data.length; i++) { const cpx = (px(i-1)+px(i))/2; ctx.bezierCurveTo(cpx,py(data[i-1]),cpx,py(data[i]),px(i),py(data[i])); }
    ctx.strokeStyle = lineColor; ctx.lineWidth = 2.2; ctx.stroke();

    // Current price horizontal dashed line
    const lastY = py(data[data.length - 1]);
    ctx.setLineDash([4, 6]); ctx.strokeStyle = lineColor + "55"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pd, lastY); ctx.lineTo(W - pd, lastY); ctx.stroke();
    ctx.setLineDash([]);

    // End dot
    const lx = px(data.length - 1), ly = lastY;
    ctx.beginPath(); ctx.arc(lx, ly, 10, 0, Math.PI*2); ctx.fillStyle = lineColor+"2a"; ctx.fill();
    ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI*2); ctx.fillStyle = lineColor+"cc"; ctx.fill();
    ctx.beginPath(); ctx.arc(lx, ly, 2.5, 0, Math.PI*2); ctx.fillStyle = lineColor; ctx.fill();

    // Y-axis price labels
    ctx.font = "10px 'DM Mono',monospace"; ctx.fillStyle = "#444"; ctx.textAlign = "right";
    for (let g = 0; g <= 4; g++) {
      const v = mn + (rng * g) / 4;
      const y = py(v);
      const label = v >= 1000 ? `$${(v/1000).toFixed(1)}k` : `$${v.toFixed(v < 10 ? 3 : v < 100 ? 2 : 1)}`;
      ctx.fillText(label, pd + 36, y + 3);
    }
  }, [data, color, h]);

  useEffect(() => { draw(); }, [draw]);
  return <canvas ref={ref} style={{ width: "100%", height: h, display: "block" }} />;
}

// ── Generate order book for a pair ───────────────────────
function makeOrderBook(price: number, spreadPct: number, priceDec: number, amtDec: number, seed: number) {
  const rng = seededRng(seed + 9999);
  const spread = price * spreadPct;
  const asks: [number, number][] = [];
  const bids: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const askP = parseFloat((price + spread * (i + 1) * (0.7 + rng() * 0.6)).toFixed(priceDec));
    const bidP = parseFloat((price - spread * (i + 1) * (0.7 + rng() * 0.6)).toFixed(priceDec));
    const askA = parseFloat((rng() * 3 + 0.1).toFixed(amtDec));
    const bidA = parseFloat((rng() * 3 + 0.1).toFixed(amtDec));
    asks.push([askP, askA]);
    bids.push([bidP, bidA]);
  }
  return { asks, bids };
}

// ══════════════════════════════════════════════════════════
//  PAGE: TRADING
// ══════════════════════════════════════════════════════════
function TradingPage() {
  const PAIR_KEYS = Object.keys(PAIR_DATA);
  const [pairKey, setPairKey] = useState("BTC/USDT");
  const [tf, setTf] = useState("1D");
  const [side, setSide] = useState<"buy"|"sell">("buy");
  const [orderType, setOrderType] = useState(0);
  const [priceInput, setPriceInput] = useState("");
  const [amtInput, setAmtInput] = useState("");

  const pd = PAIR_DATA[pairKey];
  const isUp = pd.chg24pct >= 0;

  // Generate unique chart data for this pair + timeframe combo
  const chartData = genPriceSeries(
    pd.price,
    pd.volatility,
    pd.seeds[tf],
    pd.points[tf]
  );

  // Generate order book deterministically from pair + timeframe
  const { asks, bids } = makeOrderBook(
    pd.price,
    pd.spreadPct,
    pd.priceDecimals,
    pd.amtDecimals,
    pd.seeds[tf]
  );

  const fmtPrice = (p: number) =>
    p >= 1000
      ? `$${p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${p.toFixed(pd.priceDecimals)}`;

  const totalInput = priceInput && amtInput
    ? `$${(parseFloat(priceInput.replace(/,/g,"")) * parseFloat(amtInput)).toFixed(2)}`
    : "$0.00";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionTitle t="Trading" sub="Advanced order execution — live market data" />

      {/* Pair selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PAIR_KEYS.map(k => {
          const p = PAIR_DATA[k];
          const up = p.chg24pct >= 0;
          return (
            <button key={k} onClick={() => { setPairKey(k); setTf("1D"); setPriceInput(""); setAmtInput(""); }}
              style={{ padding: "8px 16px", background: pairKey === k ? `${p.color}18` : "rgba(255,255,255,.04)",
                border: pairKey === k ? `1px solid ${p.color}44` : "1px solid rgba(255,255,255,.07)",
                borderRadius: 9, color: pairKey === k ? p.color : "#666", fontSize: 12,
                fontFamily: "'DM Mono',monospace", transition: "all .15s", cursor: "pointer" }}>
              <span style={{ marginRight: 6 }}>{p.icon}</span>{k}
              <span style={{ marginLeft: 8, fontSize: 10, color: up ? "#22C55E" : "#EF4444" }}>
                {up ? "▲" : "▼"} {Math.abs(p.chg24pct).toFixed(1)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* 24h Stats bar */}
      <div className="glass" style={{ borderRadius: 12, padding: "12px 18px", display: "flex", gap: 28, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: pd.color, letterSpacing: "-.5px" }}>
            {fmtPrice(pd.price)}
          </div>
          <div style={{ fontSize: 11, color: isUp ? "#22C55E" : "#EF4444", fontFamily: "'DM Mono',monospace", marginTop: 2 }}>
            {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{pd.chg24pct.toFixed(2)}% &nbsp; ({isUp ? "+" : ""}{fmtPrice(pd.chgAmt)})
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,.07)" }} />
        {[
          { l: "24H High", v: fmtPrice(pd.high24), c: "#22C55E" },
          { l: "24H Low",  v: fmtPrice(pd.low24),  c: "#EF4444" },
          { l: "24H Vol",  v: pd.vol24,             c: "#888"    },
          { l: "Market Cap", v: pd.mktcap,          c: "#888"    },
          { l: "24H Volume", v: pd.vol,             c: "#888"    },
        ].map(s => (
          <div key={s.l}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: ".1em", marginBottom: 3, fontFamily: "'DM Mono',monospace" }}>{s.l}</div>
            <div style={{ fontSize: 12, color: s.c, fontFamily: "'DM Mono',monospace", fontWeight: 500 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px 280px", gap: 14, alignItems: "start" }}>

        {/* ── CHART ── */}
        <GlassCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: pd.color + "18", border: `1px solid ${pd.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: pd.color, fontWeight: 700 }}>
                {pd.icon}
              </div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#F0F0F0" }}>{pd.label}</div>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "'DM Mono',monospace", marginTop: 1 }}>
                  {tf === "1H" ? "Last 60 minutes" : tf === "4H" ? "Last 4 hours" : tf === "1D" ? "Last 24 hours" : "Last 7 days"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["1H", "4H", "1D", "1W"].map(r => (
                <button key={r} className="rbtn" onClick={() => setTf(r)}
                  style={{ padding: "6px 12px", background: tf === r ? `${pd.color}18` : "rgba(255,255,255,.04)",
                    border: tf === r ? `1px solid ${pd.color}44` : "1px solid rgba(255,255,255,.07)",
                    borderRadius: 7, color: tf === r ? pd.color : "#555", fontSize: 11, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          {/* Render a fresh chart whenever pair or tf changes */}
          <div key={`${pairKey}-${tf}`}>
            <TradingChart data={chartData} color={pd.color} h={200} />
          </div>

          {/* Mini stats below chart */}
          <div style={{ display: "flex", gap: 16, marginTop: 14, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.05)" }}>
            {[
              { l: "Open",  v: fmtPrice(chartData[0]) },
              { l: "Close", v: fmtPrice(chartData[chartData.length - 1]) },
              { l: "High",  v: fmtPrice(Math.max(...chartData)) },
              { l: "Low",   v: fmtPrice(Math.min(...chartData)) },
              { l: "Change",v: `${chartData[chartData.length-1] >= chartData[0] ? "+" : ""}${(((chartData[chartData.length-1]-chartData[0])/chartData[0])*100).toFixed(2)}%` },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 9, color: "#333", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em", marginBottom: 3 }}>{s.l}</div>
                <div style={{ fontSize: 11, color: s.l === "Change" ? (s.v.startsWith("+") ? "#22C55E" : "#EF4444") : "#C0C0C0", fontFamily: "'DM Mono',monospace" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── ORDER BOOK ── */}
        <GlassCard style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#E0E0E0" }}>Order Book</div>
            <Badge c={pd.color} label={pd.label} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: 9, color: "#333", letterSpacing: ".1em", marginBottom: 6, fontFamily: "'DM Mono',monospace" }}>
            <span>Price</span><span style={{ textAlign: "center" }}>Qty</span><span style={{ textAlign: "right" }}>Total</span>
          </div>
          {/* ASKS (sell side — red) */}
          {asks.map(([p, a], i) => {
            const maxA = Math.max(...asks.map(x => x[1]));
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "4px 0", position: "relative" }}>
                <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${(a / maxA) * 100}%`, background: "rgba(239,68,68,.08)", borderRadius: 2 }} />
                <div style={{ fontSize: 11, color: "#EF4444", fontFamily: "'DM Mono',monospace", position: "relative" }}>
                  {p >= 1000 ? p.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : p.toFixed(pd.priceDecimals)}
                </div>
                <div style={{ fontSize: 11, color: "#777", fontFamily: "'DM Mono',monospace", textAlign: "center", position: "relative" }}>{a.toFixed(pd.amtDecimals)}</div>
                <div style={{ fontSize: 11, color: "#444", fontFamily: "'DM Mono',monospace", textAlign: "right", position: "relative" }}>
                  {(p * a >= 1000 ? `$${(p*a/1000).toFixed(1)}k` : `$${(p*a).toFixed(0)}`)}
                </div>
              </div>
            );
          })}
          {/* Spread row */}
          <div style={{ margin: "8px 0", padding: "7px 0", borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: pd.color }}>
              {pd.price >= 1000 ? pd.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : pd.price.toFixed(pd.priceDecimals)}
            </div>
            <div style={{ fontSize: 10, color: isUp ? "#22C55E" : "#EF4444", fontFamily: "'DM Mono',monospace" }}>
              {isUp ? "▲" : "▼"} {Math.abs(pd.chg24pct).toFixed(2)}%
            </div>
          </div>
          {/* BIDS (buy side — green) */}
          {bids.map(([p, a], i) => {
            const maxA = Math.max(...bids.map(x => x[1]));
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "4px 0", position: "relative" }}>
                <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${(a / maxA) * 100}%`, background: "rgba(34,197,94,.07)", borderRadius: 2 }} />
                <div style={{ fontSize: 11, color: "#22C55E", fontFamily: "'DM Mono',monospace", position: "relative" }}>
                  {p >= 1000 ? p.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : p.toFixed(pd.priceDecimals)}
                </div>
                <div style={{ fontSize: 11, color: "#777", fontFamily: "'DM Mono',monospace", textAlign: "center", position: "relative" }}>{a.toFixed(pd.amtDecimals)}</div>
                <div style={{ fontSize: 11, color: "#444", fontFamily: "'DM Mono',monospace", textAlign: "right", position: "relative" }}>
                  {(p * a >= 1000 ? `$${(p*a/1000).toFixed(1)}k` : `$${(p*a).toFixed(0)}`)}
                </div>
              </div>
            );
          })}
          {/* Spread indicator */}
          <div style={{ marginTop: 10, padding: "6px 8px", background: "rgba(255,255,255,.03)", borderRadius: 7, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: "#333", fontFamily: "'DM Mono',monospace" }}>SPREAD</span>
            <span style={{ fontSize: 10, color: "#666", fontFamily: "'DM Mono',monospace" }}>
              {(pd.price * pd.spreadPct * 2).toFixed(pd.priceDecimals)} ({(pd.spreadPct * 200).toFixed(3)}%)
            </span>
          </div>
        </GlassCard>

        {/* ── PLACE ORDER ── */}
        <GlassCard style={{ padding: "18px" }}>
          <div style={{ display: "flex", marginBottom: 14, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.07)" }}>
            {(["buy", "sell"] as const).map(s => (
              <button key={s} onClick={() => setSide(s)}
                style={{ flex: 1, padding: "10px", border: "none",
                  background: side === s ? (s === "buy" ? "rgba(34,197,94,.18)" : "rgba(239,68,68,.18)") : "transparent",
                  color: side === s ? (s === "buy" ? "#22C55E" : "#EF4444") : "#444",
                  fontSize: 13, fontWeight: 700, fontFamily: "'Syne',sans-serif",
                  textTransform: "uppercase", letterSpacing: ".06em", transition: "all .15s", cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>

          {/* Order type */}
          <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
            {["Limit", "Market", "Stop-Limit"].map((t, i) => (
              <button key={t} onClick={() => setOrderType(i)}
                style={{ flex: 1, padding: "6px 4px", background: orderType === i ? `${pd.color}14` : "rgba(255,255,255,.04)",
                  border: orderType === i ? `1px solid ${pd.color}33` : "1px solid rgba(255,255,255,.06)",
                  borderRadius: 7, color: orderType === i ? pd.color : "#555", fontSize: 10, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Price input */}
          {orderType !== 1 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: ".1em", marginBottom: 5, fontFamily: "'DM Mono',monospace" }}>
                PRICE (USDT)
              </div>
              <div className="glass" style={{ borderRadius: 9, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input value={priceInput} onChange={e => setPriceInput(e.target.value)}
                  placeholder={pd.price >= 1000 ? pd.price.toLocaleString() : pd.price.toFixed(pd.priceDecimals)}
                  style={{ background: "none", border: "none", outline: "none", color: "#E0E0E0", fontSize: 13, fontFamily: "'DM Mono',monospace", flex: 1 }} />
                <span style={{ fontSize: 10, color: "#444", fontFamily: "'DM Mono',monospace" }}>USDT</span>
              </div>
            </div>
          )}

          {/* Amount input */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: ".1em", marginBottom: 5, fontFamily: "'DM Mono',monospace" }}>
              AMOUNT ({pd.baseSym})
            </div>
            <div className="glass" style={{ borderRadius: 9, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <input value={amtInput} onChange={e => setAmtInput(e.target.value)}
                placeholder="0.00"
                style={{ background: "none", border: "none", outline: "none", color: "#E0E0E0", fontSize: 13, fontFamily: "'DM Mono',monospace", flex: 1 }} />
              <span style={{ fontSize: 10, color: pd.color, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>MAX</span>
            </div>
          </div>

          {/* Total */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: ".1em", marginBottom: 5, fontFamily: "'DM Mono',monospace" }}>TOTAL (USDT)</div>
            <div style={{ borderRadius: 9, padding: "9px 12px", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)" }}>
              <span style={{ fontSize: 13, color: "#888", fontFamily: "'DM Mono',monospace" }}>{totalInput}</span>
            </div>
          </div>

          {/* % sliders */}
          <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
            {["25%", "50%", "75%", "100%"].map(p => (
              <button key={p} style={{ flex: 1, padding: "5px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 7, color: "#555", fontSize: 10, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>{p}</button>
            ))}
          </div>

          <button className="ab" style={{ width: "100%", padding: "13px", border: "none", borderRadius: 11,
            background: side === "buy" ? "linear-gradient(135deg,#22C55E,#16A34A)" : "linear-gradient(135deg,#EF4444,#B91C1C)",
            color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Syne',sans-serif",
            boxShadow: side === "buy" ? "0 6px 24px rgba(34,197,94,.28)" : "0 6px 24px rgba(239,68,68,.28)",
            cursor: "pointer" }}>
            {side === "buy" ? `Buy ${pd.baseSym}` : `Sell ${pd.baseSym}`}
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 14 }}>
            {[
              { l: "Available", v: side === "buy" ? "$10,420.00" : `2.44 ${pd.baseSym}` },
              { l: "Order Value", v: totalInput },
              { l: `Fee (0.1%)`, v: priceInput && amtInput ? `$${(parseFloat(priceInput.replace(/,/g,""))*parseFloat(amtInput)*0.001).toFixed(4)}` : "$0.00" },
              { l: "Est. Total", v: totalInput },
            ].map(r => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#444", fontFamily: "'DM Mono',monospace" }}>
                <span>{r.l}</span><span style={{ color: "#777" }}>{r.v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── OPEN ORDERS ── */}
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#E0E0E0" }}>Open Orders — {pd.label}</div>
          <Badge c={pd.color} label={`${pd.orders.length} Active`} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr 1fr 1fr 80px", gap: 8, padding: "7px 12px",
          fontSize: 9, color: "#333", letterSpacing: ".12em", fontFamily: "'DM Mono',monospace", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          {["Date", "Pair", "Side", "Price", "Amount", "Filled", "Action"].map(h => <span key={h}>{h}</span>)}
        </div>
        {pd.orders.map((o, i) => (
          <div key={i} className="ti" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr 1fr 1fr 80px", gap: 8,
            padding: "10px 12px", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.03)",
            animation: `fadeUp .3s ease ${i * .07}s both` }}>
            <div style={{ fontSize: 11, color: "#555", fontFamily: "'DM Mono',monospace" }}>{o.date}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#D0D0D0", fontFamily: "'Syne',sans-serif" }}>{pd.label}</div>
            <Badge c={o.side === "Buy" ? "#22C55E" : "#EF4444"} label={o.side} />
            <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono',monospace" }}>{o.price}</div>
            <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono',monospace" }}>{o.amt}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 99, background: "rgba(255,255,255,.06)" }}>
                <div style={{ height: "100%", width: o.filled, borderRadius: 99, background: o.filled === "0%" ? "#333" : o.filled === "100%" ? "#22C55E" : "#F7931A" }} />
              </div>
              <span style={{ fontSize: 10, color: "#555", fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>{o.filled}</span>
            </div>
            <button style={{ padding: "4px 10px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.22)",
              borderRadius: 7, color: "#EF4444", fontSize: 10, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAGE: WALLET
// ══════════════════════════════════════════════════════════
const WALLET_TXS = [
  {type:"Buy USDT",date:"23 Jul · 12:59 AM",amount:"7,104.23 USDT",usd:"−7,050.47",status:"completed",dir:"down"},
  {type:"Buy USDT",date:"Canceled",amount:"601.77 USDT",usd:"−598.63",status:"canceled",dir:"down"},
  {type:"Transfer USDT",date:"20 Jul · 12:00 AM",amount:"863.12 USDT",usd:"+855.12",status:"received",dir:"up"},
  {type:"Invoice",date:"19 Jul · 12:00 AM",amount:"123.74 USDT",usd:"−120.00",status:"completed",dir:"down"},
  {type:"Buy USDT",date:"Canceled",amount:"490.41 USDT",usd:"−490.00",status:"canceled",dir:"down"},
];
const TIMELINE=[
  {label:"NGN sent. Waiting for seller confirm",done:true},
  {label:"Seller has confirmed receipt",done:true},
  {label:"Seller has sent USDT",done:true},
  {label:"Transaction complete",done:false},
];

function WalletPage() {
  const [sel,setSel]=useState(0);
  const [ar,setAr]=useState(2);
  const w=WALLETS[sel];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionTitle t="Wallet" sub="Manage your digital assets"/>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:14}}>
        {/* Asset list */}
        <div className="card" style={{padding:"14px",display:"flex",flexDirection:"column",gap:4}}>
          <div style={{fontSize:9,color:"#333",letterSpacing:".14em",marginBottom:8,fontFamily:"'DM Mono',monospace"}}>MY ASSETS</div>
          {WALLETS.map((wl,i)=>(
            <button key={wl.sym} className={`wc${i===sel?" sel":""}`} onClick={()=>setSel(i)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 8px",background:"none",border:"1px solid transparent",borderRadius:9,textAlign:"left",width:"100%"}}>
              <div style={{width:32,height:32,borderRadius:8,background:wl.color+"18",border:`1px solid ${wl.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:wl.color,fontWeight:700,flexShrink:0}}>{wl.icon}</div>
              <div style={{flex:1,overflow:"hidden"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#C0C0C0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{wl.name}</div>
                <div style={{fontSize:10,color:wl.alert?"#EF4444":"#444",fontFamily:"'DM Mono',monospace",marginTop:1}}>{wl.bal} {wl.sym}</div>
              </div>
              <MiniSpark color={wl.color}/>
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Chart card */}
          <GlassCard>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${w.color},${w.color2})`,boxShadow:`0 0 22px ${w.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:700}}>{w.icon}</div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#F0F0F0"}}>{w.name}</div>
                  <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:2}}>{w.sym}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:w.color}}>{w.bal} {w.sym}</div>
                <div style={{fontSize:11,color:"#555",fontFamily:"'DM Mono',monospace",marginTop:2}}>{w.usd}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[{l:"↑  Send",bg:`linear-gradient(135deg,${w.color},${w.color2})`,sh:`0 6px 20px ${w.color}44`,c:"#fff"},{l:"↓  Receive",bg:"rgba(34,197,94,.12)",bd:"1px solid rgba(34,197,94,.3)",c:"#22C55E"},{l:"⇄  Swap",bg:"rgba(255,255,255,.05)",bd:"1px solid rgba(255,255,255,.09)",c:"#666"}].map(a=>(
                <button key={a.l} className="ab" style={{display:"flex",alignItems:"center",gap:7,padding:"8px 18px",border:(a as any).bd||"none",borderRadius:10,background:a.bg,boxShadow:(a as any).sh,color:a.c,fontSize:13,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{a.l}</button>
              ))}
            </div>
            <div style={{height:120}} key={sel}><Spark color={w.color} h={120} seed={sel}/></div>
            <div style={{display:"flex",gap:4,marginTop:10}}>
              {["1H","24H","7D","1M","3M","1Y"].map((r,i)=>(
                <button key={r} className="rbtn" onClick={()=>setAr(i)} style={{flex:1,padding:"5px",background:i===ar?w.color+"14":"rgba(255,255,255,.03)",border:i===ar?`1px solid ${w.color}55`:"1px solid rgba(255,255,255,.06)",borderRadius:7,color:i===ar?w.color:"#444",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{r}</button>
              ))}
            </div>
          </GlassCard>

          {/* TX Table */}
          <GlassCard>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0"}}>Transaction History</div>
            </div>
            {/* Pending */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderRadius:12,marginBottom:14,background:`linear-gradient(135deg,${w.color}1c,${w.color2}0d)`,border:`1px solid ${w.color}33`}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:32,height:32,borderRadius:8,background:w.color+"22",color:w.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>↓</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#F0F0F0",fontFamily:"'Syne',sans-serif"}}>Buy USDT · Pending</div>
                  <div style={{fontSize:11,color:w.color,marginTop:3}}>● In process</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:15,fontWeight:700,color:"#F0F0F0",fontFamily:"'DM Mono',monospace"}}>1,024.53 USDT</div>
                <div style={{fontSize:11,color:w.color+"99",marginTop:3,fontFamily:"'DM Mono',monospace"}}>−1,005.96 USD</div>
              </div>
            </div>
            {WALLET_TXS.map((tx,i)=>(
              <div key={i} className="ti" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 4px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{width:32,height:32,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,
                  background:tx.dir==="up"?"rgba(34,197,94,.12)":"rgba(255,255,255,.04)",
                  color:tx.dir==="up"?"#22C55E":"#555",
                  border:tx.dir==="up"?"1px solid rgba(34,197,94,.2)":"1px solid rgba(255,255,255,.06)"}}>
                  {tx.dir==="up"?"↗":"↙"}
                </div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#D0D0D0",fontFamily:"'Syne',sans-serif"}}>{tx.type}</div></div>
                <div style={{flex:1}}><div style={{fontSize:11,color:tx.status==="canceled"?"#EF4444":"#555",fontFamily:"'DM Mono',monospace"}}>{tx.date}</div></div>
                <div style={{flex:1,textAlign:"right"}}><div style={{fontSize:12,fontWeight:600,color:"#E0E0E0",fontFamily:"'DM Mono',monospace"}}>{tx.amount}</div></div>
                <div style={{flex:1,textAlign:"right"}}><div style={{fontSize:12,color:tx.usd.startsWith("+")?"#22C55E":"#555",fontFamily:"'DM Mono',monospace"}}>{tx.usd}</div></div>
                <div style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontFamily:"'DM Mono',monospace",
                  background:tx.status==="received"?"rgba(34,197,94,.1)":tx.status==="canceled"?"rgba(239,68,68,.08)":"rgba(255,255,255,.05)",
                  color:tx.status==="received"?"#22C55E":tx.status==="canceled"?"#EF4444":"#777",
                  border:tx.status==="received"?"1px solid rgba(34,197,94,.22)":tx.status==="canceled"?"1px solid rgba(239,68,68,.18)":"1px solid rgba(255,255,255,.07)"}}>{tx.status}</div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAGE: LOANS
// ══════════════════════════════════════════════════════════
function LoansPage() {
  const loans=[
    {asset:"Bitcoin",sym:"BTC",icon:"₿",color:"#F7931A",borrowed:"$12,000",collateral:"0.5 BTC",ltv:"65%",apr:"4.2%",due:"Oct 15, 2024",health:78},
    {asset:"Ethereum",sym:"ETH",icon:"Ξ",color:"#627EEA",borrowed:"$3,500",collateral:"3 ETH",ltv:"52%",apr:"3.8%",due:"Nov 20, 2024",health:91},
  ];
  const markets=[
    {asset:"USDT",icon:"₮",color:"#26A17B",maxBorrow:"$50,000",apr:"3.5%",avail:"$2.1M"},
    {asset:"USDC",icon:"$",color:"#2775CA",maxBorrow:"$50,000",apr:"3.2%",avail:"$1.8M"},
    {asset:"DAI",icon:"◈",color:"#F5AC37",maxBorrow:"$25,000",apr:"4.0%",avail:"$0.9M"},
    {asset:"ETH",icon:"Ξ",color:"#627EEA",maxBorrow:"10 ETH",apr:"1.8%",avail:"240 ETH"},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle t="Loans" sub="Borrow against your crypto collateral"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[{l:"Total Borrowed",v:"$15,500",c:"#EF4444"},{l:"Total Collateral",v:"$24,800",c:"#F7931A"},{l:"Net Position",v:"$9,300",c:"#22C55E"}].map((s,i)=>(
          <GlassCard key={s.l} anim={i}>
            <div style={{fontSize:9,color:"#333",letterSpacing:".12em",marginBottom:7,fontFamily:"'DM Mono',monospace"}}>{s.l}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:24,color:s.c}}>{s.v}</div>
          </GlassCard>
        ))}
      </div>
      <GlassCard>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Active Loans</div>
        {loans.map((loan,i)=>(
          <div key={i} className="ti" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr 1fr",gap:12,padding:"14px 12px",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.04)",animation:`fadeUp .3s ease ${i*.06}s both`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:loan.color+"18",border:`1px solid ${loan.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:loan.color,fontWeight:700}}>{loan.icon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#D0D0D0",fontFamily:"'Syne',sans-serif"}}>{loan.asset}</div>
                <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace"}}>{loan.sym}</div>
              </div>
            </div>
            <div><div style={{fontSize:9,color:"#333",fontFamily:"'DM Mono',monospace"}}>BORROWED</div><div style={{fontSize:13,fontWeight:600,color:"#EF4444",fontFamily:"'DM Mono',monospace",marginTop:2}}>{loan.borrowed}</div></div>
            <div><div style={{fontSize:9,color:"#333",fontFamily:"'DM Mono',monospace"}}>COLLATERAL</div><div style={{fontSize:13,color:"#E0E0E0",fontFamily:"'DM Mono',monospace",marginTop:2}}>{loan.collateral}</div></div>
            <div><div style={{fontSize:9,color:"#333",fontFamily:"'DM Mono',monospace"}}>LTV</div><div style={{fontSize:13,color:parseInt(loan.ltv)>70?"#EF4444":"#F7931A",fontFamily:"'DM Mono',monospace",marginTop:2}}>{loan.ltv}</div></div>
            <div><div style={{fontSize:9,color:"#333",fontFamily:"'DM Mono',monospace"}}>APR</div><div style={{fontSize:13,color:"#888",fontFamily:"'DM Mono',monospace",marginTop:2}}>{loan.apr}</div></div>
            <div>
              <div style={{fontSize:9,color:"#333",fontFamily:"'DM Mono',monospace",marginBottom:4}}>HEALTH {loan.health}%</div>
              <div style={{height:4,borderRadius:99,background:"rgba(255,255,255,.08)"}}>
                <div style={{height:"100%",width:`${loan.health}%`,borderRadius:99,background:loan.health>80?"#22C55E":loan.health>60?"#F7931A":"#EF4444"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button style={{padding:"6px 12px",background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.25)",borderRadius:7,color:"#22C55E",fontSize:10,fontFamily:"'DM Mono',monospace"}}>Repay</button>
              <button style={{padding:"6px 12px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:7,color:"#666",fontSize:10,fontFamily:"'DM Mono',monospace"}}>Add</button>
            </div>
          </div>
        ))}
      </GlassCard>
      <GlassCard>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Borrow Markets</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {markets.map((m,i)=>(
            <div key={i} className="card" style={{padding:"16px",cursor:"pointer"}}>
              <div style={{width:36,height:36,borderRadius:9,background:m.color+"18",border:`1px solid ${m.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:m.color,fontWeight:700,marginBottom:10}}>{m.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#E0E0E0",marginBottom:4}}>{m.asset}</div>
              <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace"}}>APR <span style={{color:"#22C55E"}}>{m.apr}</span></div>
              <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:2}}>Max {m.maxBorrow}</div>
              <button className="ab" style={{marginTop:12,width:"100%",padding:"8px",background:m.color+"18",border:`1px solid ${m.color}33`,borderRadius:8,color:m.color,fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:600}}>Borrow</button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAGE: VAULTS
// ══════════════════════════════════════════════════════════
function VaultsPage() {
  const vaults=[
    {name:"BTC Yield Vault",sym:"BTC",icon:"₿",color:"#F7931A",apy:"8.4%",tvl:"$142.3M",deposited:"0.5 BTC",earned:"0.0042 BTC",risk:"Low"},
    {name:"ETH Staking Vault",sym:"ETH",icon:"Ξ",color:"#627EEA",apy:"5.2%",tvl:"$89.7M",deposited:"2 ETH",earned:"0.104 ETH",risk:"Low"},
    {name:"USDT Lending",sym:"USDT",icon:"₮",color:"#26A17B",apy:"12.1%",tvl:"$220.4M",deposited:"1000 USDT",earned:"121 USDT",risk:"Medium"},
    {name:"BNB-ETH LP",sym:"LP",icon:"◈",color:"#F3BA2F",apy:"24.8%",tvl:"$34.1M",deposited:"—",earned:"—",risk:"High"},
    {name:"SOL Liquidity",sym:"SOL",icon:"◎",color:"#9945FF",apy:"18.3%",tvl:"$67.2M",deposited:"—",earned:"—",risk:"Medium"},
    {name:"Stable Vault",sym:"USDC",icon:"$",color:"#2775CA",apy:"9.7%",tvl:"$310.0M",deposited:"500 USDC",earned:"48.5 USDC",risk:"Low"},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle t="Vaults" sub="Earn yield on your idle assets"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[{l:"Total Deposited",v:"$28,400"},{l:"Total Earned",v:"$2,140"},{l:"Avg APY",v:"11.9%"},{l:"Active Vaults",v:"3"}].map((s,i)=>(
          <GlassCard key={s.l} anim={i}>
            <div style={{fontSize:9,color:"#333",letterSpacing:".12em",marginBottom:7,fontFamily:"'DM Mono',monospace"}}>{s.l}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,color:"#22C55E"}}>{s.v}</div>
          </GlassCard>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {vaults.map((v,i)=>(
          <div key={i} className="card" style={{padding:"20px",animation:`fadeUp .35s ease ${i*.05}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:10,background:v.color+"18",border:`1px solid ${v.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:v.color,fontWeight:700}}>{v.icon}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#E0E0E0",fontFamily:"'Syne',sans-serif"}}>{v.name}</div>
                  <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:1}}>{v.sym}</div>
                </div>
              </div>
              <Badge c={v.risk==="Low"?"#22C55E":v.risk==="Medium"?"#F7931A":"#EF4444"} label={v.risk}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[{l:"APY",val:v.apy,c:"#22C55E"},{l:"TVL",val:v.tvl,c:"#E0E0E0"},{l:"Deposited",val:v.deposited,c:"#888"},{l:"Earned",val:v.earned,c:v.earned==="—"?"#333":"#22C55E"}].map(r=>(
                <div key={r.l}>
                  <div style={{fontSize:9,color:"#333",letterSpacing:".1em",fontFamily:"'DM Mono',monospace",marginBottom:3}}>{r.l}</div>
                  <div style={{fontSize:13,fontWeight:r.l==="APY"?700:500,color:r.c,fontFamily:"'DM Mono',monospace"}}>{r.val}</div>
                </div>
              ))}
            </div>
            <Spark color={v.color} h={50} seed={i}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
              <button className="ab" style={{padding:"9px",background:v.color+"18",border:`1px solid ${v.color}33`,borderRadius:9,color:v.color,fontSize:12,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>Deposit</button>
              <button className="ab" style={{padding:"9px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:9,color:"#666",fontSize:12,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>Withdraw</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAGE: PORTFOLIO
// ══════════════════════════════════════════════════════════
function PortfolioPage() {
  const alloc=[
    {name:"Bitcoin",sym:"BTC",color:"#F7931A",pct:47,val:"$22,400"},
    {name:"Ethereum",sym:"ETH",color:"#627EEA",pct:23,val:"$10,920"},
    {name:"Stablecoins",sym:"USDT+DAI",color:"#26A17B",pct:15,val:"$7,130"},
    {name:"DeFi",sym:"UNI+MATIC",color:"#8247E5",pct:8,val:"$3,800"},
    {name:"Other",sym:"Others",color:"#555",pct:7,val:"$3,320"},
  ];
  const perf=[
    {period:"Today",val:"+$1,240",pct:"+2.38%",up:true},
    {period:"This Week",val:"+$4,820",pct:"+9.6%",up:true},
    {period:"This Month",val:"+$8,320",pct:"+18.4%",up:true},
    {period:"All Time",val:"+$24,570",pct:"+81.2%",up:true},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle t="Portfolio" sub="Track your overall performance"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {perf.map((p,i)=>(
          <GlassCard key={p.period} anim={i}>
            <div style={{fontSize:9,color:"#333",letterSpacing:".12em",marginBottom:7,fontFamily:"'DM Mono',monospace"}}>{p.period}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,color:"#22C55E"}}>{p.val}</div>
            <div style={{fontSize:11,color:"#22C55E55",fontFamily:"'DM Mono',monospace",marginTop:3}}>{p.pct}</div>
          </GlassCard>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:14}}>
        <GlassCard>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:6}}>Portfolio Value Over Time</div>
          <div style={{fontSize:11,color:"#333",fontFamily:"'DM Mono',monospace",marginBottom:14}}>Total: <span style={{color:"#22C55E",fontWeight:600}}>$47,570.42</span></div>
          <Spark color="#22C55E" h={200} seed={7}/>
          <div style={{display:"flex",gap:4,marginTop:10}}>
            {["1W","1M","3M","6M","1Y","All"].map((r,i)=>(
              <button key={r} className="rbtn" style={{flex:1,padding:"5px",background:i===1?"rgba(34,197,94,.12)":"rgba(255,255,255,.03)",border:i===1?"1px solid rgba(34,197,94,.3)":"1px solid rgba(255,255,255,.06)",borderRadius:7,color:i===1?"#22C55E":"#444",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{r}</button>
            ))}
          </div>
        </GlassCard>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Allocation</div>
            {alloc.map((a,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:a.color,boxShadow:`0 0 6px ${a.color}88`}}/>
                    <span style={{fontSize:12,color:"#C0C0C0",fontFamily:"'Syne',sans-serif"}}>{a.name}</span>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:11,color:"#666",fontFamily:"'DM Mono',monospace"}}>{a.val}</span>
                    <span style={{fontSize:11,color:a.color,fontFamily:"'DM Mono',monospace"}}>{a.pct}%</span>
                  </div>
                </div>
                <div style={{height:4,borderRadius:99,background:"rgba(255,255,255,.06)"}}>
                  <div style={{height:"100%",width:`${a.pct}%`,borderRadius:99,background:a.color,boxShadow:`0 0 8px ${a.color}44`,transition:"width .6s ease"}}/>
                </div>
              </div>
            ))}
          </GlassCard>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:12}}>Top Performers</div>
            {WALLETS.slice(0,4).map((w,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:28,height:28,borderRadius:7,background:w.color+"18",border:`1px solid ${w.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:w.color,fontWeight:700,flexShrink:0}}>{w.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#C0C0C0",fontFamily:"'Syne',sans-serif"}}>{w.sym}</div>
                </div>
                <MiniSpark color={w.color}/>
                <div style={{fontSize:11,color:"#22C55E",fontFamily:"'DM Mono',monospace",width:45,textAlign:"right"}}>+{(Math.random()*15+2).toFixed(1)}%</div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAGE: LIQUIDITY POOLS
// ══════════════════════════════════════════════════════════
function LiquidityPage() {
  const pools=[
    {pair:"BTC/ETH",icon1:"₿",icon2:"Ξ",c1:"#F7931A",c2:"#627EEA",apy:"18.4%",tvl:"$312.4M",vol24:"$24.1M",fee:"0.3%",myLiq:"$2,400"},
    {pair:"ETH/USDT",icon1:"Ξ",icon2:"₮",c1:"#627EEA",c2:"#26A17B",apy:"22.1%",tvl:"$280.7M",vol24:"$31.4M",fee:"0.3%",myLiq:"$1,200"},
    {pair:"BNB/USDT",icon1:"B",icon2:"₮",c1:"#F3BA2F",c2:"#26A17B",apy:"31.5%",tvl:"$89.2M",vol24:"$11.2M",fee:"0.3%",myLiq:"—"},
    {pair:"MATIC/ETH",icon1:"⬡",icon2:"Ξ",c1:"#8247E5",c2:"#627EEA",apy:"28.7%",tvl:"$45.3M",vol24:"$5.8M",fee:"1.0%",myLiq:"—"},
    {pair:"AVAX/USDC",icon1:"▲",icon2:"$",c1:"#E84142",c2:"#2775CA",apy:"35.2%",tvl:"$28.9M",vol24:"$4.1M",fee:"0.3%",myLiq:"—"},
    {pair:"SOL/USDT",icon1:"◎",icon2:"₮",c1:"#9945FF",c2:"#26A17B",apy:"42.1%",tvl:"$67.4M",vol24:"$9.7M",fee:"1.0%",myLiq:"$800"},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle t="Liquidity Pools" sub="Provide liquidity and earn trading fees"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[{l:"My Liquidity",v:"$4,400",c:"#22C55E"},{l:"Total Earned",v:"$320.40",c:"#22C55E"},{l:"Active Positions",v:"3",c:"#E0E0E0"},{l:"Avg APY",v:"26.8%",c:"#F7931A"}].map((s,i)=>(
          <GlassCard key={s.l} anim={i}>
            <div style={{fontSize:9,color:"#333",letterSpacing:".12em",marginBottom:7,fontFamily:"'DM Mono',monospace"}}>{s.l}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,color:s.c}}>{s.v}</div>
          </GlassCard>
        ))}
      </div>
      <GlassCard>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Available Pools</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {pools.map((p,i)=>(
            <div key={i} className="card ti" style={{padding:"18px",cursor:"pointer",animation:`fadeUp .3s ease ${i*.05}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div style={{display:"flex"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:p.c1+"18",border:`1px solid ${p.c1}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:p.c1,fontWeight:700}}>{p.icon1}</div>
                  <div style={{width:32,height:32,borderRadius:8,background:p.c2+"18",border:`1px solid ${p.c2}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:p.c2,fontWeight:700,marginLeft:-8}}>{p.icon2}</div>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#E0E0E0",fontFamily:"'Syne',sans-serif"}}>{p.pair}</div>
                  <div style={{fontSize:9,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:1}}>Fee {p.fee}</div>
                </div>
                {p.myLiq!=="—"&&<Badge c="#22C55E" label="Active"/>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                {[{l:"APY",v:p.apy,c:"#22C55E"},{l:"TVL",v:p.tvl,c:"#888"},{l:"24h Vol",v:p.vol24,c:"#888"}].map(r=>(
                  <div key={r.l}>
                    <div style={{fontSize:9,color:"#333",fontFamily:"'DM Mono',monospace",marginBottom:2}}>{r.l}</div>
                    <div style={{fontSize:11,color:r.c,fontFamily:"'DM Mono',monospace",fontWeight:r.l==="APY"?700:400}}>{r.v}</div>
                  </div>
                ))}
              </div>
              {p.myLiq!=="—"&&(
                <div style={{background:"rgba(34,197,94,.07)",border:"1px solid rgba(34,197,94,.15)",borderRadius:8,padding:"7px 10px",fontSize:11,color:"#22C55E",fontFamily:"'DM Mono',monospace",marginBottom:10}}>
                  My position: {p.myLiq}
                </div>
              )}
              <button className="ab" style={{width:"100%",padding:"8px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:9,color:"#888",fontSize:12,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>
                {p.myLiq!=="—"?"Manage":"Add Liquidity"}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAGE: SWAP
// ══════════════════════════════════════════════════════════
function SwapPage() {
  const [fromAmt,setFromAmt]=useState("1.0");
  const [fromCoin,setFromCoin]=useState(0);
  const [toCoin,setToCoin]=useState(1);
  const rates=["0.5%","0.3%","1.0%","0.1%"];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle t="Swap" sub="Instant token exchange at the best rates"/>
      <div style={{display:"grid",gridTemplateColumns:"480px 1fr",gap:14,alignItems:"start"}}>
        {/* Swap card */}
        <GlassCard>
          {/* From */}
          <div style={{fontSize:9,color:"#333",letterSpacing:".12em",marginBottom:8,fontFamily:"'DM Mono',monospace"}}>FROM</div>
          <div className="glass" style={{borderRadius:12,padding:"16px",marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.06)",borderRadius:9,padding:"7px 12px",border:"1px solid rgba(255,255,255,.1)"}}>
                <div style={{width:22,height:22,borderRadius:6,background:WALLETS[fromCoin].color+"22",color:WALLETS[fromCoin].color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{WALLETS[fromCoin].icon}</div>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,color:"#E0E0E0"}}>{WALLETS[fromCoin].sym}</span>
                <span style={{color:"#444",fontSize:10}}>▾</span>
              </div>
              <input value={fromAmt} onChange={e=>setFromAmt(e.target.value)} style={{background:"none",border:"none",outline:"none",color:"#F0F0F0",fontSize:24,fontWeight:700,fontFamily:"'DM Mono',monospace",textAlign:"right",width:"50%"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>Balance: {WALLETS[fromCoin].bal} {WALLETS[fromCoin].sym}</span>
              <span style={{fontSize:11,color:"#FF9500",fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>MAX</span>
            </div>
          </div>

          {/* Swap button */}
          <div style={{display:"flex",justifyContent:"center",margin:"10px 0"}}>
            <button onClick={()=>{const t=fromCoin;setFromCoin(toCoin);setToCoin(t);}} className="ab" style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,149,0,.15)",border:"1px solid rgba(255,149,0,.3)",color:"#FF9500",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>⇅</button>
          </div>

          {/* To */}
          <div style={{fontSize:9,color:"#333",letterSpacing:".12em",marginBottom:8,fontFamily:"'DM Mono',monospace"}}>TO</div>
          <div className="glass" style={{borderRadius:12,padding:"16px",marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.06)",borderRadius:9,padding:"7px 12px",border:"1px solid rgba(255,255,255,.1)"}}>
                <div style={{width:22,height:22,borderRadius:6,background:WALLETS[toCoin].color+"22",color:WALLETS[toCoin].color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{WALLETS[toCoin].icon}</div>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,color:"#E0E0E0"}}>{WALLETS[toCoin].sym}</span>
                <span style={{color:"#444",fontSize:10}}>▾</span>
              </div>
              <div style={{fontSize:24,fontWeight:700,fontFamily:"'DM Mono',monospace",color:"#22C55E",textAlign:"right"}}>
                {(parseFloat(fromAmt||"0")*24.57).toFixed(4)}
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>Balance: {WALLETS[toCoin].bal} {WALLETS[toCoin].sym}</span>
              <span style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>≈ ${(parseFloat(fromAmt||"0")*47748).toFixed(2)}</span>
            </div>
          </div>

          {/* Details */}
          {[{l:"Rate",v:`1 ${WALLETS[fromCoin].sym} = 24.57 ${WALLETS[toCoin].sym}`},{l:"Price Impact",v:"0.12%"},{l:"Min Received",v:`${(parseFloat(fromAmt||"0")*24.45).toFixed(4)} ${WALLETS[toCoin].sym}`},{l:"Network Fee",v:"~$2.40"}].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
              <span style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>{r.l}</span>
              <span style={{fontSize:11,color:"#888",fontFamily:"'DM Mono',monospace"}}>{r.v}</span>
            </div>
          ))}
          <button className="ab" style={{width:"100%",padding:"14px",border:"none",borderRadius:12,background:"linear-gradient(135deg,#FF9500,#FF4500)",color:"#fff",fontSize:14,fontWeight:700,fontFamily:"'Syne',sans-serif",boxShadow:"0 6px 28px rgba(255,149,0,.35)",marginTop:10}}>
            Swap Now
          </button>
        </GlassCard>

        {/* Routes + history */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:12}}>Best Routes</div>
            {[{route:[WALLETS[fromCoin].sym,"USDT",WALLETS[toCoin].sym],dex:"Uniswap V3",return:`${(parseFloat(fromAmt||"0")*24.57).toFixed(4)}`,gas:"$2.40",best:true},
              {route:[WALLETS[fromCoin].sym,WALLETS[toCoin].sym],dex:"1inch",return:`${(parseFloat(fromAmt||"0")*24.51).toFixed(4)}`,gas:"$1.80",best:false},
              {route:[WALLETS[fromCoin].sym,"DAI",WALLETS[toCoin].sym],dex:"Curve",return:`${(parseFloat(fromAmt||"0")*24.39).toFixed(4)}`,gas:"$3.10",best:false},
            ].map((r,i)=>(
              <div key={i} style={{padding:"12px",borderRadius:10,marginBottom:8,border:`1px solid ${r.best?"rgba(255,149,0,.25)":"rgba(255,255,255,.06)"}`,background:r.best?"rgba(255,149,0,.07)":"rgba(255,255,255,.02)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    {r.route.map((t,j)=>(
                      <span key={j} style={{display:"flex",alignItems:"center",gap:3}}>
                        <span style={{fontSize:11,color:"#C0C0C0",fontFamily:"'DM Mono',monospace"}}>{t}</span>
                        {j<r.route.length-1&&<span style={{color:"#444",fontSize:10}}>→</span>}
                      </span>
                    ))}
                  </div>
                  {r.best&&<Badge c="#FF9500" label="Best"/>}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>{r.dex} · Gas {r.gas}</span>
                  <span style={{fontSize:12,color:"#E0E0E0",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r.return} {WALLETS[toCoin].sym}</span>
                </div>
              </div>
            ))}
          </GlassCard>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:12}}>Recent Swaps</div>
            {[{f:"0.5 BTC",t:"24.2 ETH",time:"2m ago",status:"completed"},{f:"1000 USDT",t:"0.021 BTC",time:"1h ago",status:"completed"},{f:"5 BNB",t:"482 USDT",time:"3h ago",status:"completed"}].map((s,i)=>(
              <div key={i} className="ti" style={{display:"flex",alignItems:"center",gap:10,padding:"9px 4px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{flex:1,fontSize:12,color:"#D0D0D0",fontFamily:"'Syne',sans-serif"}}>{s.f} → {s.t}</div>
                <div style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>{s.time}</div>
                <Badge c="#22C55E" label={s.status}/>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  PAGE: PROFILE
// ══════════════════════════════════════════════════════════
function ProfilePage() {
  const [activeTab,setActiveTab]=useState("overview");
  const tabs=["overview","security","preferences","activity"];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle t="Profile" sub="Manage your account and preferences"/>
      {/* Header card */}
      <GlassCard>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{position:"relative"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#1a1a2e,#2d1f3d)",border:"3px solid #FF9500",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:700,color:"#FF9500",boxShadow:"0 0 30px rgba(255,149,0,.35)"}}>AR</div>
            <div style={{position:"absolute",bottom:4,right:4,width:14,height:14,borderRadius:"50%",background:"#22C55E",border:"2px solid #020305",boxShadow:"0 0 8px #22C55E"}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#F0F0F0",letterSpacing:"-.5px"}}>Austin Robertson</div>
            <div style={{fontSize:12,color:"#555",fontFamily:"'DM Mono',monospace",marginTop:3}}>Marketing Administrator · Member since Jan 2022</div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <Badge c="#22C55E" label="● Verified"/>
              <Badge c="#FF9500" label="Pro Plan"/>
              <Badge c="#627EEA" label="2FA Active"/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,textAlign:"center"}}>
            {[{l:"Total Trades",v:"1,247"},{l:"Win Rate",v:"68.4%"},{l:"Member Rank",v:"#482"}].map(s=>(
              <div key={s.l}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,color:"#E0E0E0"}}>{s.v}</div>
                <div style={{fontSize:9,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
          <button className="ab" style={{padding:"9px 20px",background:"rgba(255,149,0,.12)",border:"1px solid rgba(255,149,0,.28)",borderRadius:10,color:"#FF9500",fontSize:13,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>Edit Profile</button>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div style={{display:"flex",gap:6}}>
        {tabs.map(t=>(
          <button key={t} className="ttab" onClick={()=>setActiveTab(t)} style={{padding:"8px 20px",background:activeTab===t?"rgba(255,149,0,.12)":"rgba(255,255,255,.04)",border:activeTab===t?"1px solid rgba(255,149,0,.28)":"1px solid rgba(255,255,255,.07)",borderRadius:9,color:activeTab===t?"#FF9500":"#555",fontSize:12,fontWeight:600,fontFamily:"'Syne',sans-serif",textTransform:"capitalize",transition:"all .15s"}}>{t}</button>
        ))}
      </div>

      {activeTab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Personal Information</div>
            {[{l:"Full Name",v:"Austin Robertson"},{l:"Email",v:"austin@example.com"},{l:"Phone",v:"+1 (555) 204-1234"},{l:"Location",v:"New York, USA"},{l:"Timezone",v:"UTC-5 (EST"},{l:"Language",v:"English"}].map(f=>(
              <div key={f.l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>{f.l}</div>
                <div style={{fontSize:12,color:"#C0C0C0",fontFamily:"'DM Mono',monospace"}}>{f.v}</div>
              </div>
            ))}
          </GlassCard>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <GlassCard>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:12}}>Portfolio Summary</div>
              {[{l:"Net Worth",v:"$47,570.42",c:"#22C55E"},{l:"Total Invested",v:"$23,000.00",c:"#E0E0E0"},{l:"Unrealized P&L",v:"+$24,570.42",c:"#22C55E"},{l:"Realized P&L",v:"+$8,320.10",c:"#22C55E"}].map(s=>(
                <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                  <div style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>{s.l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:s.c,fontFamily:"'DM Mono',monospace"}}>{s.v}</div>
                </div>
              ))}
            </GlassCard>
            <GlassCard>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:12}}>Linked Accounts</div>
              {[{name:"MetaMask",icon:"🦊",connected:true,addr:"0x742d...3f4c"},{name:"Coinbase",icon:"🔵",connected:true,addr:"austin@coinbase"},{name:"Ledger",icon:"🔒",connected:false,addr:"Not connected"}].map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                  <div style={{fontSize:18,flexShrink:0}}>{a.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#C0C0C0",fontFamily:"'Syne',sans-serif"}}>{a.name}</div>
                    <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:1}}>{a.addr}</div>
                  </div>
                  <Badge c={a.connected?"#22C55E":"#555"} label={a.connected?"Connected":"Connect"}/>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab==="security"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Security Settings</div>
            {[{l:"Two-Factor Auth",v:"Enabled",c:"#22C55E",icon:"✓"},{l:"Biometric Login",v:"Enabled",c:"#22C55E",icon:"✓"},{l:"Login Alerts",v:"Enabled",c:"#22C55E",icon:"✓"},{l:"Withdrawal Whitelist",v:"Disabled",c:"#EF4444",icon:"✗"},{l:"API Access",v:"Read Only",c:"#F7931A",icon:"◎"}].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontSize:12,color:"#C0C0C0",fontFamily:"'Syne',sans-serif"}}>{s.l}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Badge c={s.c} label={s.v}/>
                  <button style={{fontSize:11,color:"#555",background:"none",border:"none",padding:0,fontFamily:"'DM Mono',monospace",textDecoration:"underline"}}>Change</button>
                </div>
              </div>
            ))}
          </GlassCard>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <GlassCard>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Change Password</div>
              {["Current Password","New Password","Confirm Password"].map(f=>(
                <div key={f} style={{marginBottom:12}}>
                  <div style={{fontSize:9,color:"#333",letterSpacing:".1em",marginBottom:5,fontFamily:"'DM Mono',monospace"}}>{f.toUpperCase()}</div>
                  <div className="glass" style={{borderRadius:9,padding:"9px 12px"}}>
                    <input type="password" placeholder="••••••••" style={{background:"none",border:"none",outline:"none",color:"#E0E0E0",fontSize:13,fontFamily:"'DM Mono',monospace",width:"100%"}}/>
                  </div>
                </div>
              ))}
              <button className="ab" style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#FF9500,#FF4500)",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif",boxShadow:"0 6px 20px rgba(255,149,0,.3)"}}>Update Password</button>
            </GlassCard>
            <GlassCard style={{border:"1px solid rgba(239,68,68,.2)"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#EF4444",marginBottom:10}}>Danger Zone</div>
              <div style={{fontSize:11,color:"#666",fontFamily:"'DM Mono',monospace",marginBottom:12}}>Irreversible actions that affect your account permanently.</div>
              <button className="ab" style={{width:"100%",padding:"10px",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.22)",borderRadius:10,color:"#EF4444",fontSize:12,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>Delete Account</button>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab==="preferences"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Display Preferences</div>
            {[{l:"Currency",opts:["USD","EUR","GBP","JPY"],sel:"USD"},{l:"Theme",opts:["Dark","Light","System"],sel:"Dark"},{l:"Chart Type",opts:["Candlestick","Line","Bar"],sel:"Line"},{l:"Time Format",opts:["12H","24H"],sel:"24H"}].map(p=>(
              <div key={p.l} style={{marginBottom:14}}>
                <div style={{fontSize:9,color:"#333",letterSpacing:".1em",marginBottom:7,fontFamily:"'DM Mono',monospace"}}>{p.l.toUpperCase()}</div>
                <div style={{display:"flex",gap:6}}>
                  {p.opts.map(o=>(
                    <button key={o} style={{padding:"6px 14px",background:o===p.sel?"rgba(255,149,0,.12)":"rgba(255,255,255,.04)",border:o===p.sel?"1px solid rgba(255,149,0,.28)":"1px solid rgba(255,255,255,.07)",borderRadius:8,color:o===p.sel?"#FF9500":"#555",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </GlassCard>
          <GlassCard>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Notification Settings</div>
            {[{l:"Price Alerts",sub:"Get notified when prices move",on:true},{l:"Trade Confirmations",sub:"Confirm before executing",on:true},{l:"Portfolio Updates",sub:"Daily summary email",on:false},{l:"News & Announcements",sub:"Platform updates",on:true},{l:"Security Alerts",sub:"Login and withdrawal alerts",on:true}].map((n,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#C0C0C0",fontFamily:"'Syne',sans-serif"}}>{n.l}</div>
                  <div style={{fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:2}}>{n.sub}</div>
                </div>
                <div style={{width:38,height:20,borderRadius:99,background:n.on?"rgba(34,197,94,.25)":"rgba(255,255,255,.07)",border:n.on?"1px solid rgba(34,197,94,.4)":"1px solid rgba(255,255,255,.1)",position:"relative",cursor:"pointer",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:n.on?19:2,width:14,height:14,borderRadius:"50%",background:n.on?"#22C55E":"#555",transition:"left .2s ease",boxShadow:n.on?"0 0 8px #22C55E55":"none"}}/>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      )}

      {activeTab==="activity"&&(
        <GlassCard>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#E0E0E0",marginBottom:14}}>Recent Activity</div>
          {[
            {action:"Logged in",detail:"Chrome · New York, USA",time:"2 minutes ago",icon:"🔑",c:"#22C55E"},
            {action:"Swapped BTC → ETH",detail:"0.5 BTC for 24.2 ETH",time:"1 hour ago",icon:"⇄",c:"#FF9500"},
            {action:"Deposit",detail:"0.25 BTC received",time:"3 hours ago",icon:"↓",c:"#22C55E"},
            {action:"Order Placed",detail:"Buy 0.1 BTC at $46,200",time:"5 hours ago",icon:"⚡",c:"#627EEA"},
            {action:"Password Changed",detail:"Security update",time:"2 days ago",icon:"🔒",c:"#F7931A"},
            {action:"New API Key",detail:"Read-only key created",time:"4 days ago",icon:"⚙",c:"#8247E5"},
            {action:"2FA Enabled",detail:"Google Authenticator",time:"1 week ago",icon:"✓",c:"#22C55E"},
          ].map((a,i)=>(
            <div key={i} className="ti" style={{display:"flex",alignItems:"center",gap:14,padding:"12px 4px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <div style={{width:36,height:36,borderRadius:10,background:a.c+"14",border:`1px solid ${a.c}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:a.c,flexShrink:0}}>{a.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#D0D0D0",fontFamily:"'Syne',sans-serif"}}>{a.action}</div>
                <div style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace",marginTop:2}}>{a.detail}</div>
              </div>
              <div style={{fontSize:11,color:"#333",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{a.time}</div>
            </div>
          ))}
        </GlassCard>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [page,setPage]=useState("Wallet");
  const [showProfile,setShowProfile]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const [orbColor,setOrbColor]=useState("#F7931A");

  useEffect(()=>{bootstrap();},[]);

  const handleNav=(label:string)=>{setPage(label);setShowProfile(false);};
  const activePage=showProfile?"Profile":page;

  const renderPage=()=>{
    if(showProfile) return <ProfilePage/>;
    switch(page){
      case "Markets":       return <MarketsPage/>;
      case "Trading":       return <TradingPage/>;
      case "Wallet":        return <WalletPage/>;
      case "Loans":         return <LoansPage/>;
      case "Vaults":        return <VaultsPage/>;
      case "Portfolio":     return <PortfolioPage/>;
      case "Liquidity Pools": return <LiquidityPage/>;
      case "Swap":          return <SwapPage/>;
      default:              return <WalletPage/>;
    }
  };

  return (
    <div style={{display:"flex",height:"100vh",background:"#020305",color:"#E0E0E0",fontFamily:"'Syne','DM Mono',sans-serif",overflow:"hidden",position:"relative"}}>

      {/* ORBS */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}} aria-hidden>
        <div style={{position:"absolute",width:600,height:600,top:"-15%",left:"20%",borderRadius:"50%",filter:"blur(90px)",background:`radial-gradient(circle,${orbColor}18 0%,transparent 70%)`,animation:"orb1 20s ease-in-out infinite",transition:"background 1.2s ease",willChange:"transform"}}/>
        <div style={{position:"absolute",width:500,height:500,bottom:"5%",right:"10%",borderRadius:"50%",filter:"blur(90px)",background:"radial-gradient(circle,rgba(99,102,241,.10) 0%,transparent 70%)",animation:"orb2 26s ease-in-out infinite",willChange:"transform"}}/>
        <div style={{position:"absolute",width:350,height:350,top:"45%",left:"48%",borderRadius:"50%",filter:"blur(90px)",background:"radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 70%)",animation:"orb3 22s ease-in-out infinite",willChange:"transform"}}/>
      </div>

      {/* ── SIDEBAR ── */}
      <aside style={{position:"relative",zIndex:10,width:collapsed?64:200,background:"rgba(4,5,8,.92)",backdropFilter:"blur(24px)",borderRight:"1px solid rgba(255,255,255,.055)",display:"flex",flexDirection:"column",overflow:"hidden",transition:"width .28s cubic-bezier(.4,0,.2,1)",flexShrink:0}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"18px 13px 15px",borderBottom:"1px solid rgba(255,255,255,.05)",flexShrink:0}}>
          <div style={{width:33,height:33,background:"linear-gradient(135deg,#FF6B00,#CC2200)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 14px rgba(255,107,0,.4)"}}>
            <svg width="15" height="15" viewBox="0 0 24 24"><polygon points="12,2 22,20 2,20" fill="#FF6B00"/><polygon points="12,8 19,20 5,20" fill="#000" opacity=".35"/></svg>
          </div>
          {!collapsed&&<span style={{flex:1,fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,letterSpacing:"-1px",background:"linear-gradient(135deg,#FF9500,#FF3300)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>extej</span>}
          <button className="nb" onClick={()=>setCollapsed(!collapsed)} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:7,color:"#666",width:23,height:23,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{collapsed?"›":"‹"}</button>
        </div>

        <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"6px"}}>
          {!collapsed&&<div style={{fontSize:9,letterSpacing:".14em",color:"#2a2a2a",padding:"10px 8px 5px",fontWeight:600}}>PAGES</div>}
          <nav style={{display:"flex",flexDirection:"column",gap:2}}>
            {NAV.map(item=>(
              <button key={item.label} className={`nb${activePage===item.label&&!showProfile?" act":""}`}
                onClick={()=>handleNav(item.label)}
                title={collapsed?item.label:undefined}
                style={{display:"flex",alignItems:"center",gap:9,padding:"8px 9px",background:"none",border:"1px solid transparent",borderRadius:9,color:"#4a4a4a",fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:500,textAlign:"left",width:"100%",whiteSpace:"nowrap",overflow:"hidden"}}>
                <span style={{fontSize:14,flexShrink:0,width:18,textAlign:"center"}}>{item.icon}</span>
                {!collapsed&&<><span style={{flex:1}}>{item.label}</span><span className="nbadge" style={{background:"rgba(255,255,255,.06)",borderRadius:5,padding:"1px 6px",fontSize:10,color:"#444",fontFamily:"'DM Mono',monospace"}}>1</span><span style={{color:"#333",fontSize:11}}>›</span></>}
              </button>
            ))}
          </nav>
          {!collapsed&&<div style={{fontSize:9,letterSpacing:".14em",color:"#2a2a2a",padding:"14px 8px 5px",fontWeight:600}}>UI ELEMENTS</div>}
          <nav style={{display:"flex",flexDirection:"column",gap:2,marginTop:collapsed?8:0}}>
            {NAV_UI.map(item=>(
              <button key={item.label} className="nb" style={{display:"flex",alignItems:"center",gap:9,padding:"8px 9px",background:"none",border:"1px solid transparent",borderRadius:9,color:"#4a4a4a",fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:500,textAlign:"left",width:"100%",whiteSpace:"nowrap",overflow:"hidden"}} title={collapsed?item.label:undefined}>
                <span style={{fontSize:13,flexShrink:0,width:18,textAlign:"center"}}>{item.icon}</span>
                {!collapsed&&<span style={{flex:1}}>{item.label}</span>}
              </button>
            ))}
          </nav>
          {!collapsed&&<>
            <div style={{fontSize:9,letterSpacing:".14em",color:"#2a2a2a",padding:"14px 8px 5px",fontWeight:600}}>DOCS</div>
            <button className="nb" style={{display:"flex",alignItems:"center",gap:9,padding:"8px 9px",background:"none",border:"1px solid transparent",borderRadius:9,color:"#4a4a4a",fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:500,textAlign:"left",width:"100%"}}>
              <span style={{fontSize:13,flexShrink:0,width:18,textAlign:"center"}}>◉</span>
              <span style={{flex:1}}>Documentation</span>
              <span style={{color:"#333",fontSize:11}}>›</span>
            </button>
          </>}
        </div>

        {/* Profile bottom */}
        {!collapsed&&(
          <button onClick={()=>setShowProfile(true)} style={{display:"flex",alignItems:"center",gap:9,padding:"12px",borderTop:"1px solid rgba(255,255,255,.05)",background:showProfile?"rgba(255,149,0,.07)":"none",border:"none",width:"100%",cursor:"pointer",flexShrink:0,transition:"background .15s"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#1a1a1a,#2d2d2d)",border:"1.5px solid #FF9500",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#FF9500",flexShrink:0}}>AR</div>
            <div style={{flex:1,overflow:"hidden",textAlign:"left"}}>
              <div style={{fontSize:11,fontWeight:600,color:"#D0D0D0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Austin Robertson</div>
              <div style={{fontSize:10,color:"#444",marginTop:1}}>Marketing Admin</div>
            </div>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#22C55E",flexShrink:0,boxShadow:"0 0 6px #22C55E"}}/>
          </button>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main style={{flex:1,position:"relative",zIndex:5,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Ticker */}
        <div style={{height:30,borderBottom:"1px solid rgba(255,255,255,.04)",overflow:"hidden",background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",whiteSpace:"nowrap",animation:"ticker 32s linear infinite",willChange:"transform"}}>
            {[...TICKER_DATA,...TICKER_DATA,...TICKER_DATA].map((t,i)=>(
              <span key={i} style={{fontSize:11,fontFamily:"'DM Mono',monospace",display:"inline-flex",alignItems:"center"}}>
                <span style={{color:"#444"}}>{t.sym}</span>
                <span style={{color:"#B0B0B0",margin:"0 5px"}}>{t.val}</span>
                <span style={{color:t.up?"#22C55E":"#EF4444"}}>{t.chg}</span>
                <span style={{color:"#1e1e1e",margin:"0 18px"}}>│</span>
              </span>
            ))}
          </div>
        </div>

        {/* Header */}
        <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 22px",borderBottom:"1px solid rgba(255,255,255,.05)",background:"rgba(4,5,8,.75)",backdropFilter:"blur(12px)",flexShrink:0}}>
          <div>
            <div style={{fontSize:11,marginBottom:3,fontFamily:"'DM Mono',monospace"}}>
              <span style={{color:"#444"}}>Dashboard</span>
              <span style={{color:"#2a2a2a"}}> / </span>
              <span style={{color:"#777"}}>{activePage}</span>
            </div>
            <div style={{fontSize:18,fontWeight:800,fontFamily:"'Syne',sans-serif",letterSpacing:"-.5px"}}>{activePage}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="glass" style={{display:"flex",alignItems:"center",gap:8,borderRadius:10,padding:"7px 13px"}}>
              <span style={{color:"#444",fontSize:13}}>⌕</span>
              <input placeholder="Search..." style={{background:"none",border:"none",outline:"none",color:"#888",fontSize:12,fontFamily:"'DM Mono',monospace",width:160}}/>
            </div>
            <button className="glass" style={{position:"relative",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:"7px 10px",fontSize:14,color:"#666"}}>
              🔔<div style={{position:"absolute",top:7,right:7,width:6,height:6,borderRadius:"50%",background:"#FF9500",boxShadow:"0 0 6px #FF9500"}}/>
            </button>
            <button className="glass" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:"7px 10px",fontSize:14,color:"#666"}}>✉</button>
            {/* Avatar – click to show profile */}
            <button onClick={()=>setShowProfile(!showProfile)} style={{position:"relative",background:"none",border:"none",cursor:"pointer",flexShrink:0}}>
              <div style={{position:"absolute",inset:-2,borderRadius:"50%",border:`2px solid ${showProfile?"#FF9500":"#333"}`,transition:"border-color .2s",zIndex:1}}/>
              <div style={{width:36,height:36,borderRadius:"50%",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#FF9500",border:"2px solid #FF9500"}}>AR</div>
            </button>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:"#E0E0E0"}}>Austin Robertson</div>
              <div style={{fontSize:10,color:"#444",marginTop:1}}>Marketing Administrator</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}