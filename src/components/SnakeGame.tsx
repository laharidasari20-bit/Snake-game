import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 3;

export default function SnakeGame({ onScoreChange, isPaused }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const lastMoveTimeRef = useRef<number>(0);
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    setScore(0);
    onScoreChange(0);
    spawnFood();
    setGameStatus('playing');
  };

  const spawnFood = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    foodRef.current = { x, y };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (time: number) => {
      if (gameStatus === 'playing' && !isPaused) {
        const speed = Math.max(40, INITIAL_SPEED - (score * SPEED_INCREMENT));
        if (time - lastMoveTimeRef.current > speed) {
          moveSnake();
          lastMoveTimeRef.current = time;
        }
      }
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const moveSnake = () => {
      directionRef.current = nextDirectionRef.current;
      const head = { ...snakeRef.current[0] };
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameStatus('gameover');
        return;
      }

      if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameStatus('gameover');
        return;
      }

      const newSnake = [head, ...snakeRef.current];

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => {
          const next = s + 10;
          onScoreChange(next);
          return next;
        });
        spawnFood();
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const cellSize = canvas.width / GRID_SIZE;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Noise Grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Draw Food (Magenta Pulse)
      const pulse = Math.sin(Date.now() / 100) * 2;
      ctx.shadowBlur = 10 + pulse;
      ctx.shadowColor = '#ff00ff';
      ctx.fillStyle = '#ff00ff';
      ctx.fillRect(
        foodRef.current.x * cellSize + 4,
        foodRef.current.y * cellSize + 4,
        cellSize - 8,
        cellSize - 8
      );

      // Draw Snake (Cyan Glitch)
      snakeRef.current.forEach((segment, index) => {
        const jitter = Math.random() > 0.98 ? (Math.random() - 0.5) * 4 : 0;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = index === 0 ? 15 : 5;
        ctx.fillStyle = index === 0 ? '#00ffff' : 'rgba(0, 255, 255, 0.5)';
        
        ctx.fillRect(
          segment.x * cellSize + 2 + jitter,
          segment.y * cellSize + 2,
          cellSize - 4,
          cellSize - 4
        );
      });
      ctx.shadowBlur = 0;
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStatus, score, isPaused, onScoreChange]);

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-black rounded-sm overflow-hidden glitch-border">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="w-full h-full grayscale brightness-125 opacity-90 contrast-150"
      />

      <AnimatePresence>
        {gameStatus === 'idle' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-10 p-12 text-center"
          >
            <h2 className="text-5xl font-bold glitch-text mb-2 uppercase tracking-tighter">SNAKE.CORE</h2>
            <div className="w-full h-[1px] bg-glitch-magenta mb-8" />
            <p className="text-sm font-mono mb-12 opacity-60">_ESTABLISHING NEURAL LINK... [READY]</p>
            <button
              onClick={resetGame}
              className="px-10 py-4 bg-glitch-cyan text-black font-bold uppercase tracking-widest hover:bg-glitch-magenta hover:text-white transition-all transform active:scale-95"
            >
              INITIALIZE_SEQUENCE
            </button>
          </motion.div>
        )}

        {gameStatus === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-glitch-magenta/90 mix-blend-difference z-10 p-12 text-center"
          >
            <h2 className="text-6xl font-black text-white italic mb-4 glitch-text underline">BUFFER_UNDERFLOW</h2>
            <p className="text-2xl text-black font-mono font-bold mb-10 bg-white px-4">FINAL_SIGNAL: {score}</p>
            <button
              onClick={resetGame}
              className="px-10 py-4 border-4 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-glitch-magenta transition-all"
            >
              REBOOT_MODULE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Tearing Effect Overlay */}
      <motion.div 
        animate={{
          top: ["-10%", "110%"],
          opacity: [0, 0.2, 0]
        }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 5 }}
        className="absolute left-0 w-full h-[20px] bg-white z-20 pointer-events-none mix-blend-overlay"
      />
    </div>
  );
}

