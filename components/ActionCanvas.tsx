
import React, { useRef, useEffect, useState } from 'react';

interface ActionCanvasProps {
  onOutcome: (success: boolean) => void;
  difficulty: number; // 1-10 scale
}

interface Vector {
  x: number;
  y: number;
}

interface Entity {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy?: number;
  targetY?: number; // For AI tracking
}

export const ActionCanvas: React.FC<ActionCanvasProps> = ({ onOutcome, difficulty }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Vector | null>(null);
  const [dragCurrent, setDragCurrent] = useState<Vector | null>(null);
  const [ballVelocity, setBallVelocity] = useState<Vector>({ x: 0, y: 0 });
  const [ballPosition, setBallPosition] = useState<Vector>({ x: 0, y: 0 });
  const [phase, setPhase] = useState<'AIM' | 'MOVING' | 'FINISHED'>('AIM');
  const [shotPower, setShotPower] = useState(0); // 0-100 for UI

  // Game entities
  const playerRadius = 12;
  const ballRadius = 7;
  const goalRect = useRef({ x: 0, y: 0, w: 100, h: 40 });
  const defenders = useRef<Entity[]>([]);
  const keeper = useRef<Entity>({ x: 0, y: 0, radius: 10, color: '#facc15', vx: 0, vy: 0, targetY: 0 });

  // Initialize Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Positions
    setBallPosition({ x: w / 2, y: h * 0.85 });

    // Goal
    const goalW = 120;
    goalRect.current = {
      x: (w / 2) - (goalW / 2),
      y: 20,
      w: goalW,
      h: 40
    };

    // Goalkeeper - Now starts center and tracks
    keeper.current = {
        x: w / 2,
        y: 35,
        radius: 12,
        color: '#facc15', 
        vx: 0,
        targetY: 35
    };

    // Defenders (Red)
    const newDefenders: Entity[] = [];
    const defenderCount = Math.min(3, Math.floor(difficulty / 2.5) + 1);
    
    for (let i = 0; i < defenderCount; i++) {
      const spawnY = h * 0.4 + (Math.random() * h * 0.2);
      const speed = 1 + (Math.random() * (difficulty * 0.25)); 
      
      newDefenders.push({
        x: w * (0.2 + Math.random() * 0.6), 
        y: spawnY, 
        radius: 12,
        color: '#ef4444',
        vx: Math.random() < 0.5 ? speed : -speed
      });
    }
    defenders.current = newDefenders;

  }, [difficulty]);

  // Update Power Calculation for UI
  useEffect(() => {
      if (isDragging && dragStart && dragCurrent) {
          const dx = dragStart.x - dragCurrent.x;
          const dy = dragStart.y - dragCurrent.y;
          const rawPower = Math.hypot(dx, dy);
          setShotPower(Math.min(100, (rawPower / 150) * 100));
      } else {
          setShotPower(0);
      }
  }, [isDragging, dragStart, dragCurrent]);

  // Physics Loop
  useEffect(() => {
    let animationId: number;
    const friction = 0.98; // Better friction

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width / window.devicePixelRatio;

      // 1. Keeper Logic (Improved)
      if (phase === 'MOVING') {
          const k = keeper.current;
          const gr = goalRect.current;
          
          // Keeper moves towards ball X (clamped to goal width)
          let targetX = ballPosition.x;
          // Clamp target to goal area
          targetX = Math.max(gr.x, Math.min(gr.x + gr.w, targetX));

          // Reaction Delay simulation: Keeper accelerates towards target
          const keeperSpeed = 1.5 + (difficulty * 0.3); // Speed scales with difficulty
          const dx = targetX - k.x;
          
          if (Math.abs(dx) > 1) {
              k.x += Math.sign(dx) * Math.min(Math.abs(dx), keeperSpeed);
          }
      } else {
          // Idle movement for keeper
           const k = keeper.current;
           k.x += Math.sin(Date.now() / 500) * 0.5;
      }

      // 2. Defenders Logic
      if (phase !== 'FINISHED') {
          defenders.current.forEach(def => {
             def.x += def.vx;
             if (def.x < def.radius + 10 || def.x > w - def.radius - 10) {
                 def.vx = -def.vx;
             }
          });
      }

      // 3. Move Ball
      if (phase === 'MOVING') {
        setBallPosition(prev => {
          let newX = prev.x + ballVelocity.x;
          let newY = prev.y + ballVelocity.y;
          let newVx = ballVelocity.x * friction;
          let newVy = ballVelocity.y * friction;

          // Wall bounce
          const h = canvas.height / window.devicePixelRatio;
          if (newX < ballRadius || newX > w - ballRadius) {
            newVx = -newVx * 0.7; // Lose energy on bounce
            newX = prev.x; 
          }
          if (newY < ballRadius || newY > h - ballRadius) {
            newVy = -newVy * 0.7;
            newY = prev.y;
          }

          // Goal Check
          const gr = goalRect.current;
          // Simple Goal Check: Ball passes goal line inside posts
          if (newY < gr.y + 10 && newX > gr.x && newX < gr.x + gr.w) {
             setPhase('FINISHED');
             onOutcome(true);
             return prev;
          }
          
          // Keeper Collision
          const k = keeper.current;
          // Simple circle collision
          const distK = Math.hypot(newX - k.x, newY - k.y);
          if (distK < k.radius + ballRadius) {
             setPhase('FINISHED');
             onOutcome(false);
             return prev;
          }

          // Defender Collision
          for (const def of defenders.current) {
            const dist = Math.hypot(newX - def.x, newY - def.y);
            if (dist < def.radius + ballRadius) {
              setPhase('FINISHED');
              onOutcome(false); 
              return prev;
            }
          }

          // Stop check
          if (Math.abs(newVx) < 0.1 && Math.abs(newVy) < 0.1) {
              setPhase('FINISHED');
              onOutcome(false);
          }

          setBallVelocity({ x: newVx, y: newVy });
          return { x: newX, y: newY };
        });
      }
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [phase, ballVelocity, onOutcome, ballPosition.x, difficulty]);


  // Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, w, h);

    // Pitch
    ctx.fillStyle = '#15803d'; 
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    const stripeSize = 40;
    for(let i=0; i<h; i+=stripeSize*2) ctx.fillRect(0, i, w, stripeSize);

    // Penalty Box
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    const boxW = w * 0.6;
    const boxH = h * 0.25;
    const boxX = (w - boxW) / 2;
    ctx.strokeRect(boxX, 0, boxW, boxH);
    ctx.beginPath();
    ctx.arc(w/2, boxH * 0.7, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w/2, boxH, 30, 0.6, Math.PI - 0.6);
    ctx.stroke();

    // Goal
    const gr = goalRect.current;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = gr.x; i <= gr.x + gr.w; i += 6) { ctx.moveTo(i, gr.y); ctx.lineTo(i, gr.y + gr.h); }
    for (let i = gr.y; i <= gr.y + gr.h; i += 6) { ctx.moveTo(gr.x, i); ctx.lineTo(gr.x + gr.w, i); }
    ctx.stroke();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(gr.x, gr.y, gr.w, gr.h);

    // Keeper
    const k = keeper.current;
    ctx.beginPath();
    ctx.arc(k.x, k.y, k.radius, 0, Math.PI * 2);
    ctx.fillStyle = k.color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Keeper Gloves (visual detail)
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(k.x - 8, k.y, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(k.x + 8, k.y, 4, 0, Math.PI*2); ctx.fill();

    // Defenders
    defenders.current.forEach(def => {
      ctx.beginPath();
      ctx.arc(def.x, def.y, def.radius, 0, Math.PI * 2);
      ctx.fillStyle = def.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Ball
    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Aiming
    if (phase === 'AIM') {
      ctx.beginPath();
      ctx.arc(ballPosition.x, ballPosition.y + 15, playerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6'; 
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (isDragging && dragStart && dragCurrent) {
        const dx = dragStart.x - dragCurrent.x;
        const dy = dragStart.y - dragCurrent.y;
        const power = Math.min(Math.hypot(dx, dy), 150);
        
        const angle = Math.atan2(dy, dx);
        const arrowLen = power * 1.5;
        const endX = ballPosition.x + Math.cos(angle) * arrowLen;
        const endY = ballPosition.y + Math.sin(angle) * arrowLen;

        const intensity = Math.min(power / 100, 1);
        const r = Math.floor(intensity * 255);
        const g = Math.floor((1 - intensity) * 255);
        ctx.strokeStyle = `rgb(${r}, ${g}, 0)`;
        
        ctx.beginPath();
        ctx.moveTo(ballPosition.x, ballPosition.y);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

  }, [ballPosition, phase, isDragging, dragStart, dragCurrent]);

  const handleStart = (clientX: number, clientY: number) => {
    if (phase !== 'AIM') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setDragCurrent({ x, y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || phase !== 'AIM') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setDragCurrent({
        x: clientX - rect.left,
        y: clientY - rect.top
    });
  };

  const handleEnd = () => {
    if (!isDragging || !dragStart || !dragCurrent || phase !== 'AIM') return;
    
    const powerScale = 0.23; // Adjusted physics
    const dx = dragStart.x - dragCurrent.x;
    const dy = dragStart.y - dragCurrent.y;
    
    if (Math.hypot(dx, dy) > 10) {
        setBallVelocity({ x: dx * powerScale, y: dy * powerScale });
        setPhase('MOVING');
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  return (
    <div className="relative w-full h-full bg-green-900 overflow-hidden rounded-xl shadow-inner border border-green-700">
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      />
      {phase === 'AIM' && (
        <>
            <div className="absolute top-4 right-4 w-3 h-32 bg-slate-900/80 rounded-full border border-white/20 overflow-hidden">
                <div 
                    className={`w-full absolute bottom-0 transition-all duration-75 ${shotPower > 80 ? 'bg-red-500' : shotPower > 50 ? 'bg-yellow-400' : 'bg-green-500'}`}
                    style={{ height: `${shotPower}%` }}
                ></div>
                {/* Sweet Spot Marker */}
                <div className="absolute top-[20%] w-full h-1 bg-white/50"></div>
                <div className="absolute top-[40%] w-full h-1 bg-white/50"></div>
            </div>
            {!isDragging && (
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-bold drop-shadow-md pointer-events-none animate-pulse">
                Drag back and release to shoot!
                </div>
            )}
        </>
      )}
    </div>
  );
};
