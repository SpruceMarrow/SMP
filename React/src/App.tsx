import React, { useState, useEffect } from 'react';
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

import logo from "./images/1.png";
import sol from "./images/sol.png";
import eth from "./images/eth.png";
import bitcoin from "./images/bitcoin.png";
import bnb from "./images/bnb.png";
import polygon from "./images/polygon.png";



// --- Types ---

interface Proposal {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'Active' | 'Passed' | 'Rejected';
  timeLeft?: string;
}

// --- Components ---

{/* Governance View */ }

const GovernanceView = ({ onBack }: { onBack: () => void }) => {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: "SMP-001: Increase Chili Allocation",
      description: "Proposal to increase the chili spice levels in the treasury by 15% to boost yield crunchiness.",
      votesFor: 12500,
      votesAgainst: 450,
      status: 'Active',
      timeLeft: '2d 14h'
    },
    {
      id: 2,
      title: "SMP-002: Deploy Crispy-Layer-3",
      description: "Upgrade the core folding engine to support triple-layered samosa minting.",
      votesFor: 8900,
      votesAgainst: 120,
      status: 'Active',
      timeLeft: '5d 8h'
    },
    {
      id: 3,
      title: "SMP-003: Partnership with Mint Chutney Protocol",
      description: "Establish a liquidity bridge with the Mint Chutney cross-chain aggregator.",
      votesFor: 15600,
      votesAgainst: 2100,
      status: 'Passed'
    }
  ]);

  const handleVote = (id: number, type: 'for' | 'against') => {
    setProposals(prev => prev.map(p => {
      if (p.id === id && p.status === 'Active') {
        return {
          ...p,
          votesFor: type === 'for' ? p.votesFor + 1 : p.votesFor,
          votesAgainst: type === 'against' ? p.votesAgainst + 1 : p.votesAgainst
        };
      }
      return p;
    }));
  };

  {/*Governance View page ui*/}

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-tmain dark:text-slate-400 hover:text-tmain dark:hover:text-text-tmain font-bold transition-colors"
        >
          <ArrowLeft size={20}/>
          Back to Kitchen
        </button>
        <h1 className="text-text-tmain font-bold font-text-tmain text-text-tmain dark:text-text-tmain">Governance</h1>
      </div>

      <div className="grid gap-8">
        {proposals.map((proposal) => (
          <motion.div 
            key={proposal.id}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-900 border-4 border-surface dark:border-slate-800 p-8 rounded-xl sticker-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  proposal.status === 'Active' ? 'bg-primary-container text-on-primary-container' :
                  proposal.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {proposal.status}
                </span>
                {proposal.timeLeft && (
                  <span className="flex items-center gap-1 text-xs font-bold text-text-tmain dark:text-slate-400">
                    <Clock size={14} />
                    {proposal.timeLeft}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-text-tmain dark:text-slate-500">#{proposal.id}</span>
            </div>

            <h3 className="text-2xl font-black mb-4 dark:text-white">{proposal.title}</h3>
            <p className="text-text-tmain dark:text-slate-300 mb-8 leading-relaxed font-medium">
              {proposal.description}
            </p>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 w-full">
                <div className="flex justify-between text-sm font-bold mb-2 dark:text-white">
                  <span>For: {proposal.votesFor.toLocaleString()}</span>
                  <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-surface-container dark:bg-slate-800 rounded-full overflow-hidden flex border-2 border-surface dark:border-slate-700">
                  <div 
                    className="h-full bg-primary dark:bg-orange-500 transition-all duration-500" 
                    style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-text-tmain dark:bg-slate-600 transition-all duration-500" 
                    style={{ width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                  />
                </div>
              </div>

              {proposal.status === 'Active' && (
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleVote(proposal.id, 'for')}
                    className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-black shadow-[0_4px_0_0_#8c4a00] hover:translate-y-[2px] active:translate-y-[4px] transition-all border-2 border-surface"
                  >
                    <ThumbsUp size={18} />
                    Vote For
                  </button>
                  <button 
                    onClick={() => handleVote(proposal.id, 'against')}
                    className="flex items-center gap-2 bg-white dark:bg-slate-800 text-text-tmain dark:text-white px-6 py-3 rounded-lg font-black shadow-[0_4px_0_0_#e2e7ff] dark:shadow-[0_4px_0_0_#000] hover:translate-y-[2px] active:translate-y-[4px] transition-all border-2 border-surface dark:border-slate-700"
                  >
                    <ThumbsDown size={18} />
                    Against
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-primary dark:bg-orange-600 text-white p-12 rounded-xl border-[8px] border-white dark:border-slate-800 sticker-shadow text-center">
        <ShieldCheck className="mx-auto mb-6 w-16 h-16" />
        <h2 className="text-3xl font-black mb-4">Governance Security</h2>
        <p className="text-lg opacity-90 font-medium max-w-2xl mx-auto">
          All votes are verified via Proof-of-Filling. Your voting power is directly proportional to the amount of $SAMOSA tokens you've deep-fried in the text-tmain treasury.
        </p>
      </div>
    </motion.div>
  );
};

{/* The Bakery View */ }  

const BakeryView = ({ onBack }: { onBack: () => void }) => {

   const [items, setItems] = useState<string[]>([]);  // Change to array of strings (adjust type if it's objects, e.g., useState<any[]>([]))

useEffect(() => {
  fetch("https://smp-hex7.onrender.com/bot")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log("API data:", data);  // Log to verify the response
      if (Array.isArray(data.items)) {
        setItems(data.items);  // Assuming data.items is an array
      } else {
        console.error("Expected items to be an array, but got:", data.items);
        setItems([]);  // Fallback to empty array
      }
    })
}, []);

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
      <h1 className="text-4xl text-tmain [text-shadow:2px_2px_0_black,-1px_-1px_0_black] font-black mb-8 dark:text-white">{items}</h1>
      <p className="text-lg text-white dark:text-slate-300 mb-8">
        Welcome to The Bakery! Here, you can find all the latest samosa recipes and baking tips.
      </p>

      {/*Table View*/}

      
<div className="mt-12">
  <div className="max-w-5xl mx-auto space-y-4">

    {/* HEADER */}
    <div className="max-w-5xl mx-auto mb-6 px-6 py-4 rounded-xl bg-[color:var(--surface-container)]/85  backdrop-blur-md border border-tmain/10 flex justify-between items-center">

  <div>
    <h2 className="text-2xl font-black text-tmain">
      🧁 Bakery Leaderboard
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
              key={i}
              className="group grid grid-cols-4 items-center px-6 py-4 rounded-xl 
              bg-surface-container 
              shadow-[0_1px_0_0_var(--tmain)]
              hover:shadow-[0_10px_0_0_var(--tmain)]
              hover:-translate-y-1 transition-all duration-200"
            >
              <span className="font-black text-tmain text-lg">
                {i + 1}
              </span>

              <span className="font-bold text-tmain text-lg">
                coin #{i + 1}
              </span>

              <span className="text-tmain">
                vkldsvnsdnvo
              </span>

              <span className="text-tmain">
                ggbksebglksnglks
              </span>
            </div>
          ))}

        </div>
  </div>
</motion.div>
  );
};
  

{/* Extra View */}

const EXTRA = ({ onBack }: { onBack: () => void }) => {
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
      <h1 className="text-4xl font-black mb-8 dark:text-white">Extra</h1>
      <p className="text-lg text-tmain dark:text-slate-300 mb-8">
        EXTRA tht u asked for my frend
      </p>
    </motion.div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'EXTRA' | 'THE BAKERY' | 'GOVERNANCE'>('home');
  const [isPrinting, setIsPrinting] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const leftNav = ["EXTRA", "Treasury"];
  const rightNav = [ "THE BAKERY", "GOVERNANCE"];
  const navItems = [...leftNav, ...rightNav];
  
{/* Mains App UI */ }
return (
    <div
    className="min-h-screen bg-[var(--color-surface)]"
    style={{
  
      backgroundImage: `
       linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    }}
    >
      
    <nav className="fixed top-0 w-full z-50 bg-surface-container/90 dark:bg-slate-900/80 backdrop-blur-md border-b border-surface-container shadow-[0_10px_30px_-15px_var(--color-primary-dim)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

        {/* Left nav links */}
        <div className="hidden md:flex items-center gap-8 font-bold tracking-tight text-lg flex-1 justify-end">
          {leftNav.map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.05, rotate: -1 }}
               onClick={() => 
              {
                  if (item === 'THE BAKERY') setCurrentView('THE BAKERY');
                  else if (item === 'GOVERNANCE') setCurrentView('GOVERNANCE');
                  else if (item === 'EXTRA') setCurrentView('EXTRA');
                  else setCurrentView('home');
              }}
              
              className={`${currentView === item ? 'text-tmain' : 'text-tmain dark:text-tmain/70'} hover:text-tmain transition-colors`}
            >
              {item}
            </motion.button>
          ))}
        </div>

        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => setCurrentView('home')} style={{ width: 56, height: 56 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: '3px solid var(--tmain, #fd8b00)',
            overflow: 'hidden',
            background: 'var(--color-surface-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>
            <img src={logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Right nav links */}
        <div className="hidden md:flex items-center gap-8 font-bold tracking-tight text-lg flex-1 justify-start">
          {rightNav.map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.05, rotate: 1 }}
              onClick={() => 
              {
                  if (item === 'THE BAKERY') setCurrentView('THE BAKERY');
                  else if (item === 'GOVERNANCE') setCurrentView('GOVERNANCE');
                  else if (item === 'EXTRA') setCurrentView('EXTRA');
                  else setCurrentView('home');
              }}
              
              className={`${currentView === item ? 'text-tmain' : 'text-tmain dark:text-tmain/70'} hover:text-tmain transition-colors`}
            >
              {item}
            </motion.button>
          ))}
        </div>

        {/* Theme toggle + mobile menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-full bg-surface-container-low dark:bg-slate-800 text-tmain dark:text-white border-2 border-surface dark:border-slate-700 shadow-[0_4px_0_0_var(--color-primary-dim)] dark:shadow-[0_4px_0_0_#000] hover:translate-y-[2px] active:translate-y-[4px] transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="md:hidden p-2 text-tmain dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-surface-container/90 dark:bg-slate-900/80 border-t border-surface-container dark:border-slate-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <button key={item} className="text-xl font-black text-left text-tmain dark:text-white" 
                 onClick={() => 
              {
                  if (item === 'BAKERY') setCurrentView('THE BAKERY');
                  else if (item === 'GOVERNANCE') setCurrentView('GOVERNANCE');
                  else if (item === 'EXTRA') setCurrentView('EXTRA');
                  else setCurrentView('home');
              }}
              >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    <main className="pt-24 pb-11 min-h-[calc(100vh-200px)]">
      {currentView === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-text-tmain/20 dark:bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-8">
              <h1 className="text-tmain md:text-8xl [text-shadow:2px_2px_0_black,-1px_-1px_0_black] font-black font-headline text-tmain dark:text-tmain leading-[0.9] tracking-tighter max-w-4xl mx-auto">
                Samosa Money Printers DAO: <span className="text-white drop-shadow-[0_4px_0_var(--color-primary)] dark:drop-shadow-[0_4px_0_#000]">Where Every Byte is a Bite.</span>
              </h1>
              <div className="pt-8">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1.5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="bg-surface-container text-text-tmain text-2xl px-12 py-6 rounded-lg font-black shadow-lg"
                >
                  {isPrinting ? `Printing... ${Math.round(printProgress)}%` : 'Join the Kitchen'}
                </motion.button>
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
          {currentView === 'THE BAKERY' && <BakeryView onBack={() => setCurrentView('home')} />}
          {currentView === 'GOVERNANCE' && <GovernanceView onBack={() => setCurrentView('home')} />}
          {currentView === 'EXTRA' && <EXTRA onBack={() => setCurrentView('home')} />}
        </>
      )}
    </main>

    {/* Bottom bar */}
<div className="fixed bottom-0 w-full z-50 bg-surface-container/90 dark:bg-slate-900/80 backdrop-blur-md border-t border-surface-container shadow-[0_10px_30px_-15px_var(--tmain)]">

 <div className="w-full flex justify-between items-center px-4">
  {items.map((item, i) => (
    <div
      key={i}
      className="inline-flex items-center gap-2"
      style={{
        fontSize: 15,
        fontWeight: 900,
        color: 'var(--tmain)',
        letterSpacing: '0.04em',
        textShadow: '1px 1px 0 rgba(255, 255, 255, 0.25)',
        flexShrink: 0,
      }}
    >
      <img src={item.img} className="w-6 h-6 object-contain" />
      <p className="m-0">{item.label}</p>
    </div>
  ))}
</div>

</div>

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
  );
};

type Box = {
  img: string;
  label: string;
};
const [items, setItems] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    useEffect(() => {
        fetch("https://smp-hex7.onrender.com/api")
            .then((res) => res.json())
            .then((json) => {
                setItems(json);
                setDataIsLoaded(true);
            });
    }, []); 

const box: Box[] = [
  { img: sol, label: `Solana:${result.sol}$` },
  { img: eth, label: `Ethereum:${result.eth}$` },
  { img: bitcoin, label: `Bitcoin:${result.btc}$` },
  { img: bnb, label: `Binance:0$` },
];

