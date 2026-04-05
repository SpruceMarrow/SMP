import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ShieldCheck
} from 'lucide-react';

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

  const [items,setItems] = useState("");

  useEffect(() => {
    fetch("https://smp-hex7.onrender.com/bot")
    .then(res => res.json())
    .then(data => {setItems(data.items)})
  }, []);


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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-orange-400 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Kitchen
        </button>
        <h1 className="text-4xl font-black font-headline text-on-surface dark:text-white">{items}</h1>
      </div>

      <div className="grid gap-8">
        {proposals.map((proposal) => (
          <motion.div 
            key={proposal.id}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-900 border-4 border-surface-container-lowest dark:border-slate-800 p-8 rounded-xl sticker-shadow"
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
                  <span className="flex items-center gap-1 text-xs font-bold text-on-surface-variant dark:text-slate-400">
                    <Clock size={14} />
                    {proposal.timeLeft}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-on-surface-variant dark:text-slate-500">#{proposal.id}</span>
            </div>

            <h3 className="text-2xl font-black mb-4 dark:text-white">{proposal.title}</h3>
            <p className="text-on-surface-variant dark:text-slate-300 mb-8 leading-relaxed font-medium">
              {proposal.description}
            </p>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 w-full">
                <div className="flex justify-between text-sm font-bold mb-2 dark:text-white">
                  <span>For: {proposal.votesFor.toLocaleString()}</span>
                  <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-surface-container dark:bg-slate-800 rounded-full overflow-hidden flex border-2 border-surface-container-lowest dark:border-slate-700">
                  <div 
                    className="h-full bg-primary dark:bg-orange-500 transition-all duration-500" 
                    style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-secondary dark:bg-slate-600 transition-all duration-500" 
                    style={{ width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                  />
                </div>
              </div>

              {proposal.status === 'Active' && (
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleVote(proposal.id, 'for')}
                    className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-black shadow-[0_4px_0_0_#8c4a00] hover:translate-y-[2px] active:translate-y-[4px] transition-all border-2 border-surface-container-lowest"
                  >
                    <ThumbsUp size={18} />
                    Vote For
                  </button>
                  <button 
                    onClick={() => handleVote(proposal.id, 'against')}
                    className="flex items-center gap-2 bg-white dark:bg-slate-800 text-on-surface dark:text-white px-6 py-3 rounded-lg font-black shadow-[0_4px_0_0_#e2e7ff] dark:shadow-[0_4px_0_0_#000] hover:translate-y-[2px] active:translate-y-[4px] transition-all border-2 border-surface-container-lowest dark:border-slate-700"
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
          All votes are verified via Proof-of-Filling. Your voting power is directly proportional to the amount of $SAMOSA tokens you've deep-fried in the main treasury.
        </p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'governance'>('home');
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

  return (
    <div className="min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(140,74,0,0.1)] dark:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <span className="text-2xl font-black text-primary dark:text-orange-400 drop-shadow-[0_2px_0_rgba(255,255,255,1)] font-headline tracking-tight">
              Samosa Money Printers
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-bold tracking-tight text-lg">
            {['Treasury', 'The Bakery', 'Governance'].map((item) => (
              <motion.button 
                key={item}
                whileHover={{ scale: 1.05, rotate: -1 }}
                onClick={() => {
                  if (item === 'Governance') setCurrentView('governance');
                  else setCurrentView('home');
                }}
                className={`${
                  (item === 'Governance' && currentView === 'governance') || (item !== 'Governance' && currentView === 'home')
                    ? 'text-primary dark:text-orange-400'
                    : 'text-on-surface-variant dark:text-slate-300'
                } hover:text-primary dark:hover:text-orange-400 transition-colors`}
              >
                {item}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-surface-container dark:bg-slate-800 text-on-surface dark:text-white border-2 border-surface-container-lowest dark:border-slate-700 shadow-[0_4px_0_0_#8c4a00] dark:shadow-[0_4px_0_0_#000] hover:translate-y-[2px] active:translate-y-[4px] transition-all"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-t border-surface-container dark:border-slate-800 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {['Treasury', 'The Bakery', 'Governance'].map((item) => (
                  <button 
                    key={item} 
                    className="text-xl font-black text-left text-on-surface dark:text-white" 
                    onClick={() => {
                      if (item === 'Governance') setCurrentView('governance');
                      else setCurrentView('home');
                      setIsMenuOpen(false);
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

      <main className="pt-24 min-h-[calc(100vh-200px)]">
        {currentView === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary-container/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-primary-container/10 dark:bg-orange-600/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 space-y-8">
                <h1 className="text-5xl md:text-8xl font-black font-headline text-on-surface dark:text-white leading-[0.9] tracking-tighter max-w-4xl mx-auto">
                  Samosa Money Printers DAO: <span className="text-primary-container dark:text-orange-500 drop-shadow-[0_4px_0_rgba(140,74,0,1)] dark:drop-shadow-[0_4px_0_rgba(0,0,0,1)]">Where Every Byte is a Bite.</span>
                </h1>
                
                <div className="pt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05, rotate: 1.5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="bg-primary-container text-on-primary-container text-2xl px-12 py-6 rounded-lg font-black shadow-[0_8px_0_0_#8c4a00] hover:shadow-[0_4px_0_0_#8c4a00] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all border-4 border-surface-container-lowest sticker-shadow"
                  >
                    {isPrinting ? `Printing... ${Math.round(printProgress)}%` : 'Join the Kitchen'}
                  </motion.button>
                </div>
              </div>
            </section>

            {/* Section 2: Printing the Flavor */}
            <section className="py-32 px-6 overflow-hidden dark:bg-slate-950">
              <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="space-y-8 max-w-3xl">
                  <h2 className="text-4xl md:text-6xl font-black font-headline text-on-surface dark:text-white leading-none">Printing the Flavor</h2>
                  <ul className="space-y-4 font-bold text-lg flex flex-col items-center">
                    {[
                      'Proof-of-Filling (PoF) Consensus',
                      'Hand-Folded Smart Contracts',
                      'Triple-Filtered Liquidity Oil'
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 dark:text-white">
                        <CheckCircle2 className="text-primary dark:text-orange-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-secondary text-white px-8 py-4 rounded-full font-black shadow-[0_4px_0_0_#443100] hover:translate-y-[2px] active:translate-y-[4px] transition-all border-4 border-surface-container-lowest">
                    Read the Cookbook (Docs)
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <GovernanceView onBack={() => setCurrentView('home')} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full rounded-t-[3rem] mt-20 bg-orange-100 dark:bg-slate-900 font-bold text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full max-w-7xl mx-auto">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-orange-900 dark:text-orange-100">Samosa Money Printers</span>
            </div>
            <p className="text-orange-900/60 dark:text-slate-400">© 2026 Samosa Money Printers DAO. Printed with Spice.</p>
          </div>
          <div className="flex gap-12 text-orange-900/60 dark:text-slate-400">
            <a className="hover:text-primary hover:underline decoration-2 underline-offset-4" href="#"><Twitter size={20} /></a>
            <a className="hover:text-primary hover:underline decoration-2 underline-offset-4" href="#"><Disc size={20} /></a>
            <a className="hover:text-primary hover:underline decoration-2 underline-offset-4" href="#"><FileText size={20} /></a>
            <a className="hover:text-primary hover:underline decoration-2 underline-offset-4" href="#"><Code2 size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
