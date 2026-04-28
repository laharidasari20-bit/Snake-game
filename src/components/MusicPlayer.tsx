import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'FREQ_SYNC_01',
    artist: 'UNKNOWN_RECIPIENT',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#00ffff'
  },
  {
    id: '2',
    title: 'VOID_DRIFT',
    artist: 'NULL_POINTER',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#ff00ff'
  },
  {
    id: '3',
    title: 'SIGNAL_LOST',
    artist: 'ECHO_404',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#ffff00'
  }
];

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export default function MusicPlayer({ isPlaying, onPlayToggle }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const val = (audio.currentTime / audio.duration) * 100;
      setProgress(val || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return (
    <div className="w-full bg-black/80 border-2 border-glitch-cyan p-4 relative glitch-border">
      <div className="absolute -top-3 right-4 bg-glitch-magenta text-white px-2 text-[10px] font-bold">FRQ_MOD</div>
      <audio ref={audioRef} src={currentTrack.src} />
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/5 border border-white/20 flex items-center justify-center relative overflow-hidden group">
             <motion.div 
              animate={{
                opacity: isPlaying ? [1, 0, 1] : 0.2,
                scale: isPlaying ? [1, 1.2, 0.9, 1.1, 1] : 1
              }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 bg-glitch-magenta/30"
             />
             <Radio size={32} className="relative z-10 text-glitch-cyan" />
          </div>

          <div className="flex-1 overflow-hidden">
            <h3 className="text-xl font-bold truncate glitch-text" style={{ color: currentTrack.color }}>
              {currentTrack.title}
            </h3>
            <p className="text-[10px] opacity-40 font-mono tracking-widest">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Jagged Progress Bar */}
          <div className="relative h-4 bg-white/5 border border-white/10 overflow-hidden">
             <motion.div 
                className="h-full bg-glitch-magenta relative"
                animate={{ width: `${progress}%` }}
                transition={{ type: 'tween' }}
             >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse" />
             </motion.div>
             {/* Masking noise on progress bar */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex gap-4">
              <button 
                onClick={handlePrev}
                className="hover:text-glitch-magenta transition-colors"
              >
                <SkipBack size={20} />
              </button>
              
              <button 
                onClick={onPlayToggle}
                className="text-glitch-cyan hover:scale-110 active:scale-90 transition-transform"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
              </button>

              <button 
                onClick={handleNext}
                className="hover:text-glitch-magenta transition-colors"
              >
                <SkipForward size={20} />
              </button>
            </div>

            <div className="flex gap-1 h-4 items-end">
               {[...Array(8)].map((_, i) => (
                 <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? [2, 16, 4, 12, 6] : 2 }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    className="w-1 bg-glitch-cyan"
                 />
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-white/10 text-[9px] font-mono opacity-30 flex justify-between">
        <span>ENCRYPTED_STREAM</span>
        <span>BIT_RATE: 12.4kbps</span>
      </div>
    </div>
  );
}

