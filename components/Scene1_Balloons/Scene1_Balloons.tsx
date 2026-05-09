'use client';

// FIX: We imported 'Variants' here to satisfy TypeScript!
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface Props {
  onComplete: () => void;
}

export default function Scene1_Balloons({ onComplete }: Props) {
  const [balloons, setBalloons] = useState<any[]>([]);
  // Phases: 0 = Closed, 1 = Opening, 2 = Letter
  const [phase, setPhase] = useState(0);
  // Triggers the final white shine across all text
  const [showShine, setShowShine] = useState(false);

  useEffect(() => {
    // Responsive balloons
    const isMobile = window.innerWidth < 768;
    const totalBalloons = isMobile ? 20 : 50;
    const centerBalloons = isMobile ? 12 : 35;

    const newBalloons = Array.from({ length: totalBalloons }).map((_, i) => {
      const isCenter = i < centerBalloons; 
      return {
        id: i,
        left: isCenter ? `${Math.random() * 30 + 35}%` : `${Math.random() * 100}%`,
        top: isCenter ? `${Math.random() * 30 + 35}%` : `${Math.random() * 100}%`,
        width: isMobile ? Math.random() * 40 + 60 : Math.random() * 60 + 80, 
        rotate: Math.random() * 360,
        duration: Math.random() * 4 + 3, 
      };
    });
    setBalloons(newBalloons);
  }, []);

  useEffect(() => {
    // Wait for ALL text to safely finish appearing, then trigger the white glow
    if (phase === 2) {
      const timer = setTimeout(() => {
        setShowShine(true);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleEnvelopeClick = () => {
    if (phase > 0) return;
    setPhase(1);

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FDFCE4', '#FFFFFF', '#8A631B'],
      disableForReducedMotion: true
    });

    setTimeout(() => {
      setPhase(2);
    }, 1200);
  };

  // --- BULLETPROOF FRAMER MOTION VARIANTS (Fixed for TypeScript) ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 1.0, delayChildren: 2.0 }, 
    },
    shine: { opacity: 1 } 
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: { 
      opacity: 1, y: 0, filter: "blur(0px)", 
      textShadow: "0px 0px 0px rgba(255,255,255,0)", scale: 1,
      transition: { duration: 1.2, ease: "easeOut" } 
    },
    shine: {
      opacity: 1, y: 0, filter: "blur(0px)",
      textShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 25px rgba(255,255,255,1)", "0px 0px 8px rgba(255,255,255,0.6)"],
      scale: [1, 1.02, 1],
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const headingVariants: Variants = {
    visible: { textShadow: "0px 0px 0px rgba(255,255,255,0)", scale: 1 },
    shine: {
      textShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 30px rgba(255,255,255,1)", "0px 0px 10px rgba(255,255,255,0.8)"],
      scale: [1, 1.03, 1],
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full overflow-hidden z-20 bg-[#050505]"
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.2 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Safe Font Importer */}
      <style dangerouslySetInnerHTML={{__html: `
        .apple-font {
          font-family: 'Brush Script MT', 'Pacifico', 'Lucida Handwriting', cursive;
          font-weight: normal;
        }
        .readable-cursive {
          font-family: "Georgia", "Times New Roman", serif;
          font-style: italic;
        }
      `}} />

      {/* 1. CINEMATIC BACKGROUND VIDEO */}
      <video autoPlay loop muted playsInline className={`absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none z-0 transition-opacity duration-1000 ${phase === 2 ? 'opacity-30' : 'opacity-50'}`}>
        <source src="/assets/videos/golden-particles.mp4" type="video/mp4" />
      </video>

      {/* 2. THE ENVELOPE (Phases 0 and 1) */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 cursor-pointer group" onClick={handleEnvelopeClick} exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }} transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FDFCE4] to-[#D4AF37] blur-[100px] opacity-60 animate-pulse" />
            <motion.div className="relative w-[320px] md:w-[450px]" whileHover={{ scale: phase === 0 ? 1.05 : 1 }}>
              {phase === 0 && <motion.img src="/envelope-closed.png" alt="Closed" className="w-full h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
              {phase === 1 && <motion.img src="/envelope-open.png" alt="Open" className="w-full h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} />}
              {phase === 0 && <p className="absolute -bottom-14 w-full text-center text-[#D4AF37] font-serif tracking-[0.4em] text-sm animate-bounce drop-shadow-[0_2px_10px_rgba(0,0,0,1)] bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">CLICK TO OPEN</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. THE SMART BALLOON WALL */}
      <motion.div animate={{ opacity: phase === 2 ? 0 : 1, pointerEvents: phase === 2 ? 'none' : 'auto' }}>
        {balloons.map((balloon) => <SmartBalloon key={balloon.id} data={balloon} />)}
      </motion.div>

      {/* 4. THE LUXURY TYPOGRAPHY REVEAL (Phase 2) */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center w-full h-full bg-black/40 p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="flex flex-row gap-2 md:gap-10 items-center justify-center w-full">
              
              {/* LEFT FLOATING EMOJIS */}
              <motion.div className="hidden md:flex relative flex-col gap-10 opacity-80">
                <FloatingEmojis side="left" phase={phase} />
              </motion.div>

              <div className="relative w-full max-w-[800px] flex flex-col items-center justify-center gap-6 md:gap-8 text-center text-white">
                
                {/* 1. "Apple Style" Handwriting Reveal - STRICTLY WHITE */}
                <motion.div
                  initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                  transition={{ duration: 2.2, ease: "easeInOut", delay: 0.2 }}
                >
                  <motion.h2 
                    className="text-6xl md:text-8xl lg:text-9xl mb-4 apple-font"
                    style={{ color: "#FFFFFF" }} 
                    initial="visible"
                    animate={showShine ? "shine" : "visible"}
                    variants={headingVariants}
                  >
                    Hello Senior!
                  </motion.h2>
                </motion.div>

                {/* 2. Staggered Remaining Text - STRICTLY WHITE */}
                <motion.div 
                  className="flex flex-col items-center w-full gap-6 md:gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate={showShine ? "shine" : "visible"}
                >
                  <motion.div variants={textVariants} className="flex flex-col gap-4 w-[95%] md:w-[85%]">
                    <p className="text-xl md:text-3xl leading-relaxed readable-cursive" style={{ color: "#FFFFFF" }}>
                      It's finally our time to give you all the farewell that you truly deserve 🥹
                    </p>
                    <p className="text-xl md:text-3xl leading-relaxed readable-cursive" style={{ color: "#FFFFFF" }}>
                      We've arranged a small farewell for all of you and would love to have everyone there.
                    </p>
                  </motion.div>

                  <motion.div variants={textVariants} className="flex flex-col gap-4 mt-4 w-full items-center font-serif">
                    <p className="text-2xl md:text-4xl tracking-wide font-bold" style={{ color: "#FFFFFF" }}>
                      📍 Venue: Rohini Hall
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-12 mt-2">
                      <p className="text-2xl md:text-4xl tracking-wide" style={{ color: "#FFFFFF" }}>
                        📅 09/05/26
                      </p>
                      <p className="text-2xl md:text-4xl tracking-wide" style={{ color: "#FFFFFF" }}>
                        ⏰ 05:00 PM
                      </p>
                    </div>
                  </motion.div>

                  <motion.p variants={textVariants} className="text-xl md:text-3xl leading-relaxed readable-cursive mt-4 max-w-3xl" style={{ color: "#FFFFFF" }}>
                    Looking forward to celebrating, making memories, and spending one last fun evening together! ✨
                  </motion.p>

                  <motion.h3 variants={textVariants} className="text-5xl md:text-6xl mt-2 apple-font" style={{ color: "#FFFFFF" }}>
                    Hope to see you all there 🤍
                  </motion.h3>
                </motion.div>

              </div>

              {/* RIGHT FLOATING EMOJIS */}
              <motion.div className="hidden md:flex relative flex-col gap-10 opacity-80">
                <FloatingEmojis side="right" phase={phase} />
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// ---------------------------------------------------------
// FLOATING EMOJIS COMPONENT
// ---------------------------------------------------------
function FloatingEmojis({ side, phase }: { side: 'left' | 'right', phase: number }) {
  const emojis = [
    { id: 1, char: '🎓' },
    { id: 2, char: '🥂' },
    { id: 3, char: '✨' },
    { id: 4, char: '💖' },
    { id: 5, char: '🎉' }
  ];

  return (
    <>
      {emojis.map((emoji, index) => {
        const initialX = side === 'left' ? -50 : 50;
        return (
          <motion.div 
            key={emoji.id}
            className="text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, x: initialX }}
            animate={{ 
              opacity: phase === 2 ? 1 : 0, 
              x: 0, 
              y: [0, -15, 0, 15, 0] 
            }}
            transition={{ 
              opacity: { delay: phase === 2 ? index * 0.4 + 2 : 0, duration: 1 },
              x: { delay: phase === 2 ? index * 0.4 + 2 : 0, duration: 1.5, type: 'spring' },
              y: { duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.3, rotate: side === 'left' ? -20 : 20 }}
              className="cursor-pointer pointer-events-auto"
            >
              {emoji.char}
            </motion.div>
          </motion.div>
        );
      })}
    </>
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
      style={{ left: data.left, top: data.top, width: data.width, height: data.width, rotate: data.rotate, marginLeft: -data.width / 2, marginTop: -data.width / 2 }}
      animate={{ y: offset.y !== 0 ? offset.y : ["-5%", "5%", "-5%"], x: offset.x !== 0 ? offset.x : ["-2%", "2%", "-2%"] }}
      transition={{ type: offset.x !== 0 ? "spring" : "tween", stiffness: 40, damping: 15, mass: 0.8, duration: offset.x === 0 ? data.duration : undefined, repeat: offset.x === 0 ? Infinity : 0, ease: offset.x === 0 ? "easeInOut" : undefined }}
      drag dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} dragElastic={0.8}
    >
      <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(212,175,55,0.8) 40%, rgba(138,99,28,1) 100%)', backdropFilter: 'blur(4px)', border: '1px solid rgba(253, 252, 228, 0.6)', boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.6), inset 10px 10px 20px rgba(255,255,255,0.5), 0 10px 25px rgba(212,175,55,0.25)' }} />
    </motion.div>
  );
}