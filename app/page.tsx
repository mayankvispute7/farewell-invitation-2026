'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Scene1_Balloons from "../components/Scene1_Balloons/Scene1_Balloons";

export default function Home() {
  const [stage, setStage] = useState(1);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#050505] via-[#0a0802] to-[#1a1500]">
      <AnimatePresence mode="wait">
        
        {stage === 1 && (
          // When Scene 1 completes, we go straight to Stage 4 (Forms)
          <Scene1_Balloons key="scene1" onComplete={() => setStage(4)} />
        )}

        {stage === 4 && (
          <motion.div 
            key="scene4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center text-[#D4AF37] font-serif text-2xl"
          >
             Loading Forms... (Phase 6)
          </motion.div>
        )}
        
      </AnimatePresence>
    </main>
  );
}