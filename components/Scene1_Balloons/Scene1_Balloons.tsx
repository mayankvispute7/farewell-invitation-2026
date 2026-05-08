'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface Props {
  onComplete: () => void;
}

export default function Scene1_Balloons({ onComplete }: Props) {
  const [balloons, setBalloons] = useState<any[]>([]);
  // Phases: 0 = Closed Envelope, 1 = Open Envelope, 2 = Reading Letter
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 50 balloons, packed tightly in the center
    const newBalloons = Array.from({ length: 50 }).map((_, i) => {
      const isCenter = i < 35; 
      return {
        id: i,
        left: isCenter ? `${Math.random() * 30 + 35}%` : `${Math.random() * 100}%`,
        top: isCenter ? `${Math.random() * 30 + 35}%` : `${Math.random() * 100}%`,
        width: Math.random() * 60 + 80, 
        rotate: Math.random() * 360,
        duration: Math.random() * 4 + 3, 
      };
    });
    setBalloons(newBalloons);
  }, []);

  const handleEnvelopeClick = () => {
    if (phase > 0) return;
    
    // 1. Switch to Open Envelope immediately
    setPhase(1);

    // 2. Fire Confetti Explosion
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FDFCE4', '#FFFFFF', '#8A631B'],
      disableForReducedMotion: true
    });

    // 3. Wait 1.2 seconds, then transition to the Letter
    setTimeout(() => {
      setPhase(2);
    }, 1200);
  };

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full overflow-hidden z-20 bg-[#050505]"
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.2 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      
      {/* 1. CINEMATIC BACKGROUND VIDEO */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none z-0 transition-opacity duration-1000 ${phase === 2 ? 'opacity-20' : 'opacity-50'}`}
      >
        <source src="/assets/videos/golden-particles.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Sun Rays over the video (Fades out for final invitation) */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1500px] md:h-[1500px] pointer-events-none z-0 flex items-center justify-center"
        animate={{ opacity: phase === 2 ? 0 : 0.8 }}
      >
        <div 
          className="absolute inset-0 rounded-full animate-[spin_30s_linear_infinite]"
          style={{
            background: 'repeating-conic-gradient(from 0deg, rgba(253, 252, 228, 0.4) 0deg 8deg, transparent 8deg 16deg)',
            maskImage: 'radial-gradient(circle, black 10%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(circle, black 10%, transparent 60%)'
          }}
        />
      </motion.div>

      {/* 2. THE ENVELOPE (Phases 0 and 1) */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 cursor-pointer group" 
            onClick={handleEnvelopeClick}
            exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }} // Zooms out when letter appears
            transition={{ duration: 1 }}
          >
            {/* Glow Behind Envelope */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FDFCE4] to-[#D4AF37] blur-[100px] opacity-60 animate-pulse" />

            <motion.div className="relative w-[320px] md:w-[450px]" whileHover={{ scale: phase === 0 ? 1.05 : 1 }}>
              
              {/* Closed Envelope Image */}
              {phase === 0 && (
                <motion.img 
                  src="/envelope-closed.png" 
                  alt="Closed" 
                  className="w-full h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                />
              )}

              {/* Open Envelope Image */}
              {phase === 1 && (
                <motion.img 
                  src="/envelope-open.png" 
                  alt="Open" 
                  className="w-full h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                />
              )}
              
              {phase === 0 && (
                <p className="absolute -bottom-14 w-full text-center text-[#D4AF37] font-serif tracking-[0.4em] text-sm animate-bounce drop-shadow-[0_2px_10px_rgba(0,0,0,1)] bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  CLICK TO OPEN
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. THE SMART BALLOON WALL (Fades out when letter is reading) */}
      <motion.div animate={{ opacity: phase === 2 ? 0 : 1, pointerEvents: phase === 2 ? 'none' : 'auto' }}>
        {balloons.map((balloon) => (
          <SmartBalloon key={balloon.id} data={balloon} />
        ))}
      </motion.div>

      {/* 4. THE VINTAGE LETTER (Phase 2 - Strictly Centered and Perfect Fit) */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div 
          className="absolute inset-0 z-50 flex items-center justify-center w-full h-full bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Wrapper for both entry AND looping float animation */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* THIS INNER DIV CARRIES THE SUBTLE GENTLE FLOATING ANIMATION 
                (Error Fixed: Animation written directly into props to satisfy TypeScript)
            */}
            <motion.div
              animate={{
                y: [0, -10, 0, 10, 0],
                scale: [1, 1.02, 1, 0.98, 1],
                opacity: [1, 0.92, 1, 0.92, 1]
              }}
              transition={{
                duration: 18, 
                ease: "linear",
                repeat: Infinity
              }}
            >
              {/* THIS IS THE FINAL COMPLETED INVITATION IMAGE! */}
              <img 
                src="/bg.jpeg" 
                alt="Invitation Card"
                className="w-[95%] max-w-[500px] aspect-[1/1.4] shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-md pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// ---------------------------------------------------------
// ISOLATED BALLOON COMPONENT 
// ---------------------------------------------------------
function SmartBalloon({ data }: { data: any }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleHover = () => {
    const pushX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 400 + 300);
    const pushY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 400 + 300);
    setOffset({ x: pushX, y: pushY }); 
  };

  return (
    <motion.div
      onMouseEnter={handleHover} onTouchStart={handleHover} 
      className="absolute z-30 cursor-grab active:cursor-grabbing"
      style={{ 
        left: data.left, top: data.top, width: data.width, height: data.width, 
        rotate: data.rotate, marginLeft: -data.width / 2, marginTop: -data.width / 2,
      }}
      animate={{ 
        y: offset.y !== 0 ? offset.y : ["-5%", "5%", "-5%"],
        x: offset.x !== 0 ? offset.x : ["-2%", "2%", "-2%"],
      }}
      transition={{ 
        type: offset.x !== 0 ? "spring" : "tween", stiffness: 40, damping: 15, mass: 0.8,      
        duration: offset.x === 0 ? data.duration : undefined, repeat: offset.x === 0 ? Infinity : 0, 
        ease: offset.x === 0 ? "easeInOut" : undefined
      }}
      drag dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} dragElastic={0.8}
    >
      <div 
        className="w-full h-full rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(212,175,55,0.8) 40%, rgba(138,99,28,1) 100%)',
          backdropFilter: 'blur(4px)', border: '1px solid rgba(253, 252, 228, 0.6)',
          boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.6), inset 10px 10px 20px rgba(255,255,255,0.5), 0 10px 25px rgba(212,175,55,0.25)',
        }}
      />
    </motion.div>
  );
}