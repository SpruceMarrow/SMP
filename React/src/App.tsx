import React, { useState, useEffect, useRef } from 'react';
import { AreaSeries, BarSeries, BaselineSeries, CandlestickSeries, createChart } from 'lightweight-charts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Menu, 
  X, 
  Twitter, 
  Disc, 
  FileText, 
  Code2,
  Sun,
  Moon,
  Vote,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Bluetooth
} from 'lucide-react';

{/*importing images*/}

import logo from "./images/1.png";
import sol from "./images/sol.png";
import eth from "./images/eth.png";
import bitcoin from "./images/bitcoin.png";

{/* Governance View */ }

{/* Governance View */ }

interface Proposal {
  id: number;
  title: string;
  description: string;
}

const GovernanceView = ({ onBack }: { onBack: () => void }) => {
  const tiers: VotingTier[] = [
    {
      name: "Entity",
      votes: "10 Votes",
      members: ["Main DAO Entity"],
      color: "bg-primary dark:bg-orange-600 text-white"
    },
    {
      name: "SMP Founding Members",
      votes: "5 Votes",
      members: ["Tej", "Nithin", "Star", "Aditiya"],
      color: "bg-primary-container text-on-primary-container"
    },
    {
      name: "SMP Core",
      votes: "2 Votes",
      members: ["Akhil", "Manoj", "Raghu"],
      color: "bg-secondary-container text-on-secondary-container"
    },
    {
      name: "SMP Members",
      votes: "1 Vote",
      members: ["Sreejith", "Kapoor", "Ankit", "Nikhil", "DK"],
      color: "bg-surface-container dark:bg-slate-800 text-on-surface dark:text-white"
    }
  ];

  {/*Governance UI*/}

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12">

        <button
            onClick={onBack}
            className="flex items-center gap-2 text-[color:var(--surface-container)] dark:text-[color:var(--surface-container-text)] hover:text-tmain font-bold transition-colors duration-200 mb-12 text-sm tracking-widest uppercase"
            style={{ transition: "color 0.3s ease" }}
          >
            <ArrowLeft size={14} />
            Back to home
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
         <p className="text-[color:var(--surface-container)] dark:text-[color:var(--surface-container-text)] text-xs font-black uppercase tracking-[0.3em] mb-2">Samosa Money Printers</p>
          <h1 className="text-6xl font-black text-tmain tracking-tighter leading-none">GOVERNANCE</h1>
          <p className="font-bold text-sm mt-3 max-w-sm text-[color:var(--surface-container)] dark:text-[color:var(--surface-container-text)]">
            Voting power distributed across tiers — balanced decision-making from the kitchen.
          </p>
        </div>
      </div>

     <div className="grid gap-6">
  {tiers.map((tier, index) => (
    <motion.div
      key={tier.name}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[color:var(--surface-container)] border-4 border-tmain/40 hover:border-tmain p-8 rounded-xl transition-all duration-200"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-tmain/40 text-xs font-black uppercase tracking-widest mb-1">Tier {String(index + 1).padStart(2, '0')}</p>
          <h3 className="text-2xl font-black text-white">{tier.name}</h3>
        </div>
        <div className="px-6 py-2 rounded-full font-black text-lg border-2 border-tmain text-tmain">
          {tier.votes}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {tier.members.map((member) => (
          <div
            key={member}
            className="px-4 py-2 rounded-lg border-2 border-tmain/30 text-tmain/60 font-black text-sm"
          >
            {member}
          </div>
        ))}
      </div>
    </motion.div>
  ))}
</div>

<div className="mt-8 bg-[color:var(--surface-container)] border-4 border-tmain/40 p-10 rounded-xl text-center">
  <Vote className="mx-auto mb-4 text-white w-12 h-12" />
  <h2 className="text-2xl font-black text-white mb-3">DAO GOVERNANCE STRUCTURE</h2>
  <p className="text-tmain/40 font-medium max-w-2xl mx-auto text-sm leading-relaxed">
    Voting power in Samosa Money Printers is distributed across tiers to ensure balanced decision-making and reward long-term commitment to the kitchen.
  </p>
</div>
    </motion.div>
  );
};


{/* The P2P View */ }  

const P2PView = ({ onBack }: { onBack: () => void }) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-tmain dark:text-orange-400 hover:text-tmain dark:hover:text-orange-300 transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to Home
      </button>
      <h1 className="text-4xl text-tmain [text-shadow:2px_2px_0_black,-1px_-1px_0_black] font-black mb-8 dark:text-white">hello</h1>
      <p className="text-lg text-white dark:text-slate-300 mb-8">
        Welcome to The P2P! Here, you can find all the latest samosa recipes and baking tips.
      </p>

      
      <div className="mt-12">
        <div className="max-w-5xl mx-auto space-y-4">

          {/* HEADER */}
          <div className="max-w-5xl mx-auto mb-6 px-6 py-4 rounded-xl bg-[color:var(--surface-container)]/95  backdrop-blur-md border border-tmain/10 flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-black text-tmain">
            🧁 P2P Leaderboard
          </h2>
          <p className="text-sm text-tmain">
            __Top performing samosas today
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg bg-tmain text-white hover:scale-105 transition">
          Refresh
        </button>

      </div>

          {/* ROWS */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    className="group grid grid-cols-4 items-center px-6 py-4 rounded-xl 
                    bg-[var(--surface-container)]/90
                    backdrop-blur-md  
                    border-tmain/10
                    shadow-[0_1px_0_0_var(--tmain)]
                    hover:shadow-[0_10px_0_0_var(--tmain)]
                    hover:-translate-y-1 transition-all duration-200"
                  >
                    <span className="font-black truncate text-tmain text-lg">
                      {i + 1}
                    </span>

                    <span className="font-bold truncate text-tmain text-lg">
                      coin #{i + 1}
                    </span>

                    <span className="text-tmain truncate">
                      vkldsvnsdnvo
                    </span>

                    <span className="text-tmain truncate">
                      ggbksebglksnglks
                    </span>
                  </div>
                ))}

              </div>
        </div>
    </motion.div>
  );
};
  

{/* Bakery View */}

const BAKERY = ({ onBack }: { onBack: () => void }) => {
  const [data,setData] = useState<any[]>([]);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

    useEffect(() => {
        fetch("https://smp-hex7.onrender.com/bot")
            .then((res) => res.json())
            .then((json) => {
                setData(json.items);
                setDataIsLoaded(true);
            });
    }, []); 
return (!dataIsLoaded ? (
  <div className="flex items-center justify-center h-screen">
    <p className="text-tmain font-black text-xl animate-pulse">LOADING BAKERY DATA...</p>
  </div>
) : (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-5xl mx-auto px-6 py-10"
  >
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-[color:var(--surface-container)] dark:text-[color:var(--surface-container-text)] hover:text-tmain font-bold transition-colors duration-200 mb-12 text-sm tracking-widest uppercase"
    >
      <ArrowLeft size={14} />
      Back to Home
    </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <p className="text-[color:var(--surface-container)] dark:text-[color:var(--surface-container-text)] text-xs font-black uppercase tracking-[0.3em] mb-2">Samosa Money Printers</p>
        <h1 className="text-6xl font-black text-tmain tracking-tighter leading-none">THE BAKERY</h1>
        <p className="font-bold text-sm mt-3 max-w-sm text-[color:var(--surface-container)] dark:text-[color:var(--surface-container-text)]">
          P2P token leaderboard — live performance data from the kitchen.
        </p>
      </div>

      {/* BALANCE */}
      <div className="flex flex-col items-start md:items-end gap-1 px-6 py-4 rounded-xl border border-tmain/20 bg-[color:var(--surface-container)] min-w-[180px]">
        <span className="text-tmain/40 text-[10px] font-black uppercase tracking-[0.2em]">Your Balance</span>
        <span className="text-4xl font-black text-tmain tabular-nums">{data[1]}</span>
      </div>
    </div>

   {/* table*/}
<div className="rounded-2xl border border-tmain bg-surface-container overflow-hidden">

  {/* Panel Header */}
  <div className="flex items-center justify-between px-6 py-4 border-b border-tmain/10">
    <div className="flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-tmain animate-pulse" />
      <span className="text-tmain font-black text-sm tracking-widest uppercase">P2P Leaderboard</span>
      <span className="text-tmain/30 text-xs font-mono">LIVE</span>
    </div>
    <button className="px-4 py-1.5 rounded-lg border border-tmain/30 text-tmain text-xs font-black uppercase tracking-widest hover:bg-tmain hover:text-black transition-all duration-200">
      Refresh
    </button>
  </div>

  {/* Column Labels */}
  <div className="grid grid-cols-[3rem_8rem_1fr_8rem] px-6 py-3 border-b border-tmain/10">
    <span className="text-[10px] font-black text-tmain/30 uppercase tracking-widest">#</span>
    <span className="text-[10px] font-black text-tmain/30 uppercase tracking-widest">Ticker</span>
    <span className="text-[10px] font-black text-tmain/30 uppercase tracking-widest">Contract Address</span>
    <span className="text-[10px] font-black text-tmain/30 uppercase tracking-widest text-right">Price</span>
  </div>

  {/* Rows */}
  <div className="divide-y divide-tmain/5">
    {data[0].map((coin, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.04 }}
        className="grid grid-cols-[3rem_8rem_1fr_8rem] items-center px-6 py-4
          border-l-2 border-l-transparent
          hover:border-l-tmain hover:bg-tmain/5
          transition-all duration-150"
      >
        <span className="font-black text-sm tabular-nums text-tmain/30">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="font-black text-tmain text-sm tracking-wider">{coin.tick}</span>
        <span className="text-tmain/30 text-xs font-mono truncate pr-4">{coin.ca}</span>
        <span className={`font-black text-sm tabular-nums text-right ${
          parseFloat(data[7][i]) < 0 ? "text-red-400" : "text-green-400"
        }`}>
          {parseFloat(data[7][i]) >= 0 ? `+${data[7][i]}` : data[7][i]}
        </span>
      </motion.div>
    ))}
  </div>

</div>
  </motion.div>
));
};

type Item = {
  img: string;
  label: string;
};

function Dropdown({ selected, setSelected }: { selected: string; setSelected: (val: string) => void }) {
  return (
    <div className="relative inline-block group">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="appearance-none bg-surface-container text-tmain text-xl px-10 py-4 rounded-lg font-black border-4 border-tmain shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all cursor-pointer outline-none"
      >
        <option value="btc">BTC / BITCOIN</option>
        <option value="eth">ETH / ETHEREUM</option>
        <option value="sol">SOL / SOLANA</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-tmain">
        ▼
      </div>
    </div>
  );
}

function Chart({ choice, isDarkMode }: { choice: string; isDarkMode: boolean }) {
  const chartref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://smp-hex7.onrender.com/api/historical${choice}`)
      .then(res => res.json())
      .then(raw => {
        const formatted = raw.Data.map(entry => ({
          time: entry.TIMESTAMP,
          close: entry.CLOSE,
          high: entry.HIGH,
          low: entry.LOW,
          open: entry.OPEN
        }));
        setData(formatted);
      });
  }, [choice]);

  useEffect(() => {
    if (!chartref.current || data.length === 0) return;

    const styles = getComputedStyle(document.documentElement);
    const tmain = styles.getPropertyValue('--tmain').trim();

    const chart = createChart(chartref.current, {
      width: chartref.current.clientWidth,
      height: 400,

      layout: {
        background: { color: 'transparent' },
        textColor: tmain,
      },

      grid: {
        vertLines: { color: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)' },
        horzLines: { color: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)' },
      },

      timeScale: {
        borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
      },

      rightPriceScale: {
        borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candlestickSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartref.current) {
        chart.applyOptions({ width: chartref.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, isDarkMode]); 

  return <div ref={chartref} className="w-full h-[350px]" />;
}

{/*Start of App8*/}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'TREASURY' | 'BAKERY' | 'P2P' | 'GOVERNANCE'>('home');
  const [isPrinting, setIsPrinting] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data,setData] = useState<any>({});
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [selected,setSelected] = useState("btc");

    useEffect(() => {
        fetch("https://smp-hex7.onrender.com/api")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setDataIsLoaded(true);
            });
    }, []); 


  {/*Light/Dark Toggle Logic*/}

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
    
  const items: Item[] = [
  { img: sol, label: `Solana:${data.sol}$` },
  { img: eth, label: `Ethereum:${data.eth}$` },
  { img: bitcoin, label: `Bitcoin:${data.btc}$` },
  ];

  const leftNav = ["BAKERY", "TREASURY"];
  const rightNav = [ "P2P", "GOVERNANCE"];
  const navItems = [...leftNav, ...rightNav];

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    setPrintProgress(0);
    
    const duration = 2000;
    const step = 100;
    const increment = 100 / (duration / step);
    
    const timer = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsPrinting(false);
          return 100;
        }
        return prev + increment;
      });
    }, step);
  };

{/* Mains App UI */ }

return (
  !dataIsLoaded ?<div className="flex items-center justify-center h-screen">
    <p className="text-tmain font-black text-xl animate-pulse">LOADING THE RECIPES TO COOK...</p>
  </div>: (

    <div className="min-h-screen overflow-x-hidden"
    style={{
  
      backgroundImage: `
       linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    }}
    >
      
  <nav className="fixed top-0 w-full z-50 
  bg-surface-container/90 dark:bg-slate-900/80 
  backdrop-blur-md 
  border-b border-surface-container 
  shadow-[0_10px_30px_-15px_var(--tmain)]">

  {/* ================= MOBILE NAV ================= */}
  <div className="md:hidden flex items-center justify-between px-4 py-3">

    {/* Logo */}
    <div
      onClick={() => setCurrentView('home')}
      className="w-10 h-10 rounded-full border-3 border-tmain overflow-hidden bg-surface-container flex items-center justify-center cursor-pointer"
    >
      <img src={logo} alt="logo" className="w-full h-full object-cover" />
    </div>

    {/* Right Controls */}
    <div className="flex items-center gap-2">

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="p-2 rounded-full bg-surface-container-low text-tmain 
        border hover:translate-y-[2px] active:translate-y-[4px] transition-all"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Hamburger */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-tmain"
      >
        <motion.div
          animate={isMenuOpen ? "open" : "closed"}
          className="flex flex-col gap-1"
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 6 }
            }}
            className="w-5 h-[2px] bg-tmain block"
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            className="w-5 h-[2px] bg-tmain block"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -6 }
            }}
            className="w-5 h-[2px] bg-tmain block"
          />
        </motion.div>
      </button>

    </div>
  </div>

  {/* ================= DESKTOP NAV ================= */}
  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto] items-center max-w-7xl mx-auto px-6 py-4">

    {/* Left nav */}
    <div className="flex items-center gap-8 font-bold text-lg justify-end">
      {leftNav.map((item) => (
        <motion.button
          key={item}
          whileHover={{ scale: 1.05, rotate: -1 }}
          onClick={() => {
            if (item === 'BAKERY') setCurrentView('BAKERY');
            else if (item === 'GOVERNANCE') setCurrentView('GOVERNANCE');
            else if (item === 'P2P') setCurrentView('P2P');
            else setCurrentView('home');
          }}
          className={`${currentView === item ? 'text-tmain' : 'text-tmain/70'} hover:text-tmain transition`}
        >
          {item}
        </motion.button>
      ))}
    </div>

    {/* Logo */}
    <div className="flex justify-center px-8">
      <div
        onClick={() => setCurrentView('home')}
        className="w-14 h-14 rounded-full border-2 border-tmain overflow-hidden bg-surface-container flex items-center justify-center cursor-pointer"
      >
        <img src={logo} className="w-full h-full object-cover" />
      </div>
    </div>

    {/* Right nav */}
    <div className="flex items-center gap-8 font-bold text-lg justify-start">
      {rightNav.map((item) => (
        <motion.button
          key={item}
          whileHover={{ scale: 1.05, rotate: 1 }}
          onClick={() => {
            if (item === 'BAKERY') setCurrentView('BAKERY');
            else if (item === 'TREASURY') setCurrentView('TREASURY');
            else if (item === 'GOVERNANCE') setCurrentView('GOVERNANCE');
            else if (item === 'P2P') setCurrentView('P2P');
            else setCurrentView('home');
          }}
          className={`${currentView === item ? 'text-tmain' : 'text-tmain/70'} hover:text-tmain transition`}
        >
          {item}
        </motion.button>
      ))}
    </div>

    {/* Toggle */}
    <div className="flex items-center gap-3 justify-end">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="p-2.5 rounded-full bg-surface-container-low text-tmain border 
        hover:translate-y-[2px] active:translate-y-[4px] transition-all"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>

  </div>

  {/* ================= MOBILE MENU ================= */}
  <AnimatePresence>
    {isMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="md:hidden 
        bg-surface-container/95 dark:bg-slate-900/95 
        backdrop-blur-xl 
        border-t border-tmain/10"
      >
        <div className="flex flex-col p-6 gap-4">

          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === 'BAKERY') setCurrentView('BAKERY');
                else if (item === 'GOVERNANCE') setCurrentView('GOVERNANCE');
                else if (item === 'TREASURY') setCurrentView('TREASURY');
                else if (item === 'P2P') setCurrentView('P2P');
                else setCurrentView('home');
                setIsMenuOpen(false);
              }}
              className="text-xl font-black text-left text-tmain 
              hover:translate-x-2 transition-all"
            >
              {item}
            </button>
          ))}

        </div>
      </motion.div>
    )}
  </AnimatePresence>

</nav>

    <main className="pt-24 pb-14 min-h-[calc(100vh-200px)]">
      {currentView === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-text-tmain/20 dark:bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl lg:text-8xl font-black text-tmain [text-shadow:2px_2px_0_black,-1px_-1px_0_black] leading-[0.9] tracking-tighter max-w-4xl mx-auto">
                <span className="block">Samosa Money Printers DAO:</span>
                  <span className="block text-white drop-shadow-[0_4px_0_var(--color-primary)]">Where Every Byte is a Bite.</span>
              </h1>
              <div className="pt-8">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1.5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="bg-surface-container text-tmain text-2xl px-12 py-6 rounded-lg font-black shadow-lg"
                >
                  {isPrinting ? `Printing... ${Math.round(printProgress)}%` : 'Join the Kitchen'}
                </motion.button>
              </div>
            </div>
          </section>
          
      {/* Dropdown*/}
      <section className="max-w-5xl mx-auto px-6 mt-12 space-y-6 text-center">

  <div className="flex justify-center">
    <Dropdown selected={selected} setSelected={setSelected} />
  </div>

  <div className="
    bg-[var(--surface-container)]/90 
    dark:bg-[var(--surface-container)]/90 
    backdrop-blur-md
    text-[var(--tmain)] 
    p-8 md:p-12 
    rounded-2xl 
    border border-tmain/20
    shadow-[0_10px_30px_-10px_var(--tmain)]
    hover:shadow-[0_20px_40px_-10px_var(--tmain)]
    transition-all duration-300
  ">

    <h2 className="text-3xl md:text-4xl text-tmain font-black mb-6">
      {data[selected]}
    </h2>

    <div className="w-full max-w-4xl mx-auto">
      <Chart choice={selected} />
    </div>

  </div>
</section>

          {/* Printing the Flavor section */}
          <section className="py-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              <div className="space-y-8 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-black font-headline text-tmain dark:text-white leading-none">Printing the Flavor</h2>
                <ul className="space-y-4 font-bold text-lg flex flex-col items-center">
                  {['Proof-of-Filling (PoF) Consensus', 'Hand-Folded Smart Contracts', 'Triple-Filtered Liquidity Oil'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-text-tmain dark:text-white">
                      <CheckCircle2 className="text-text-tmain" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="bg-surface-container text-tmain border-surface-container px-8 py-4 rounded-full font-black shadow-[0_4px_0_0_var(--surface-container)] hover:translate-y-[2px] active:translate-y-[4px] transition-all border-4">
                  Read the Cookbook (Docs)
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {currentView === 'P2P' && <P2PView onBack={() => setCurrentView('home')} />}
          {currentView === 'GOVERNANCE' && <GovernanceView onBack={() => setCurrentView('home')} />}
          {currentView === 'BAKERY' && <BAKERY onBack={() => setCurrentView('home')} />}
        </>
      )}
    </main>

{/*bottom bar*/}

<div  className="fixed bottom-0 w-full z-50 backdrop-blur-md border-t-2 border-surface-container shadow-[0_-10px_30px_-10px_var(--tmain)]"
  style={{ 
    height: 36,
    backgroundColor: 'color-mix(in srgb, var(--surface-container) 90%, transparent)',
  }}
>
  <div className="w-full h-full flex justify-end items-center px-3 overflow-hidden">
    {items.map((item, i) => (
      <React.Fragment key={i}>
        <span style={{ color: 'var(--tmain)', opacity: 0.4, fontSize: 10, padding: '0 8px', flexShrink: 0 }}>
          ◆
        </span>
        <div
          className="inline-flex items-center gap-1"
          style={{ flexShrink: 0 }}
        >
          <img src={item.img} style={{ width: 14, height: 14, objectFit: 'contain' }} alt="" />
          <p className="m-0 text-[10px] md:text-[12px] font-black" style={{ color: 'var(--tmain)', letterSpacing: '0.03em' }}>
            {item.label}
          </p>
        </div>
      </React.Fragment>
    ))}
  </div>
</div>
  
{/* Footer */ }
    <footer className="w-full rounded-t-[3rem] mt-20 bg-surface-container dark:bg-slate-900 font-bold text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full max-w-7xl mx-auto">
        <div className="mb-8 md:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-text-tmain dark:text-tmain">Samosa Money Printers</span>
          </div>
          <p className="text-tmain dark:text-slate-400">© 2026 Samosa Money Printers DAO. Printed with Spice.</p>
        </div>
        <div className="flex gap-12 text-tmain dark:text-slate-400">
          <a className="hover:text-tmain transition-colors" href="#"><Twitter size={20} /></a>
          <a className="hover:text-tmain transition-colors" href="#"><Disc size={20} /></a>
          <a className="hover:text-tmain transition-colors" href="#"><FileText size={20} /></a>
          <a className="hover:text-tmain transition-colors" href="#"><Code2 size={20} /></a>
        </div>
      </div>
    </footer>
  </div>
  ));
};

