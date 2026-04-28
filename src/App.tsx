import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('snake-high-score', newScore.toString());
    }
  };

  return (
    <div className="min-h-screen bg-void text-glitch-cyan flex flex-col p-4 md:p-8 relative selection:bg-glitch-magenta selection:text-white">
      <div className="scanline" />
      
      {/* Background Noise Layer */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-50 mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Cryptic Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 mb-8 border-b-2 border-glitch-cyan/30 pb-4">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-glitch-magenta/20 border-2 border-glitch-magenta flex items-center justify-center"
          >
            <Cpu className="text-glitch-magenta w-6 h-6" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold glitch-text italic">
              NEURAL_SNAKE.EXE
            </h1>
            <p className="text-[10px] text-glitch-magenta/60 font-mono tracking-[0.5em]">SYSTEM_VERSION_INVALID</p>
          </div>
        </div>

        <div className="flex gap-6 items-center font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] opacity-50">RECORDED_MAX</span>
            <span className="text-glitch-magenta text-2xl tracking-tighter">{highScore.toString().padStart(8, '0')}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 z-10">
        
        {/* Module 01: Diagnostics */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <section className="glitch-border bg-black/80 p-6 relative">
            <div className="absolute -top-3 -left-1 bg-glitch-cyan text-black px-2 text-[10px] font-bold">MOD_01</div>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity size={18} className="text-glitch-magenta" /> DIAGNOSTICS
            </h2>
            <div className="space-y-6 font-mono text-sm">
              <div className="flex justify-between border-b border-glitch-cyan/20 pb-2">
                <span className="opacity-40 uppercase">Buffer_Level</span>
                <span className="text-glitch-magenta">{score.toString().padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between border-b border-glitch-cyan/20 pb-2">
                <span className="opacity-40 uppercase">Packet_Loss</span>
                <span className="text-glitch-magenta">0.02%</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="opacity-40 uppercase text-[10px]">Processor_Load</span>
                <div className="w-full h-1.5 bg-glitch-cyan/10">
                  <motion.div 
                    animate={{ width: [ "20%", "90%", "45%", "70%"] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="h-full bg-glitch-cyan shadow-[0_0_10px_#00ffff]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="glitch-border bg-black/80 p-6 relative">
            <div className="absolute -top-3 -left-1 bg-glitch-magenta text-white px-2 text-[10px] font-bold">MOD_02</div>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Terminal size={18} className="text-glitch-cyan" /> PROTOCOLS
            </h2>
            <div className="text-[14px] leading-relaxed opacity-80 font-mono space-y-2">
              <p>_INIT: HEAD_POS_X +1</p>
              <p>_ERROR: SELF_INTERSECT</p>
              <p>_CMD: ARROW_KEYS_REQUIRED</p>
              <p className="text-glitch-magenta animate-pulse mt-4">_DO_NOT_DISCONNECT</p>
            </div>
          </section>
        </div>

        {/* Module 03: Visual Core */}
        <div className="lg:col-span-6 flex flex-col gap-8 order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-glitch-magenta/20 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <SnakeGame 
              onScoreChange={handleScoreChange} 
              isPaused={!isPlaying} 
            />
          </div>
        </div>

        {/* Module 04: Harmonic Frequency */}
        <div className="lg:col-span-3 space-y-8 order-3">
          <MusicPlayer 
            isPlaying={isPlaying} 
            onPlayToggle={() => setIsPlaying(!isPlaying)} 
          />
          
          <div className="border border-glitch-magenta/30 p-6 bg-black/40 flex flex-col items-center gap-4">
            <ShieldAlert className="text-glitch-magenta animate-bounce" size={32} />
            <div className="text-center font-mono uppercase">
              <p className="text-xs text-glitch-magenta font-bold">UNAUTHORIZED ACCESS DETECTED</p>
              <p className="text-[9px] opacity-40 mt-1">Tracing packet origin...</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 mt-12 py-6 border-t-2 border-glitch-magenta/20 text-[12px] font-mono">
        <div className="flex gap-4">
          <span className="text-glitch-magenta">_ROOT/SYSTEM/BIN/SNAKE</span>
          <span className="opacity-20 translate-y-[-1px]">|</span>
          <span className="opacity-40">CPU_TEMP: 42.1°C</span>
        </div>
        <p className="opacity-30 tracking-[0.3em]">REDACTED_BY_ORDER_771</p>
      </footer>
    </div>
  );
}

