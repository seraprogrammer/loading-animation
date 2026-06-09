import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Exact Shape & Color Sequences ---
// Mapped exactly to the video timeline (00:00 - 00:27)
const ANIMATION_PHASES = {
  warm: {
    speed: 300,
    frames: [
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#fdba74' }, // Solid orange
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 0], color: '#fdba74' }, // Missing BR
      { pattern: [1, 1, 0, 1, 1, 1, 1, 1, 1], color: '#fdba74' }, // Missing TR
      { pattern: [0, 0, 0, 1, 1, 0, 1, 1, 0], color: '#fca5a5' }, // Pink 2x2
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#fca5a5' }, // Pink Solid
    ]
  },
  readingCool: {
    speed: 250,
    frames: [
      { pattern: [0, 1, 1, 0, 1, 1, 0, 0, 0], color: '#7dd3fc' }, // Top Right 2x2
      { pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1], color: '#38bdf8' }, // X
      { pattern: [1, 1, 0, 1, 1, 0, 0, 0, 0], color: '#7dd3fc' }, // Top Left 2x2
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#38bdf8' }, // Solid
    ]
  },
  readingDim: {
    speed: 600,
    frames: [
      { pattern: [0, 0, 0, 1, 0, 0, 0, 0, 0], color: '#52525b' }, // Single dim dot
      { pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0], color: '#52525b' }, // Empty
    ]
  },
  thinkingDim: {
    speed: 400,
    frames: [
      { pattern: [0, 0, 0, 1, 1, 0, 0, 0, 0], color: '#d97706' }, // Two dim dots
      { pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0], color: '#d97706' }, // Empty
    ]
  },
  readingSolid: {
    speed: 1000,
    frames: [
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#451a03' }, // Solid Dark Brown
    ]
  },
  thinkingPink: {
    speed: 250,
    frames: [
      { pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1], color: '#f472b6' }, // X
      { pattern: [0, 1, 0, 1, 1, 1, 0, 1, 0], color: '#fb7185' }, // Plus
      { pattern: [1, 1, 0, 1, 1, 0, 0, 0, 0], color: '#f472b6' }, // 2x2
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#fb7185' }, // Solid
    ]
  },
  respondingBlue: {
    speed: 300,
    frames: [
      { pattern: [0, 0, 0, 1, 1, 1, 1, 1, 1], color: '#38bdf8' }, // Bottom heavy
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#7dd3fc' }, // Solid
    ]
  },
  prototype: {
    speed: 150,
    frames: [
      { pattern: [0, 1, 0, 1, 1, 1, 0, 1, 0], color: '#fb923c' }, // Orange Plus
      { pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1], color: '#fb923c' }, // Orange X
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#fb923c' }, // Orange Solid
      { pattern: [0, 1, 0, 1, 1, 1, 0, 1, 0], color: '#f43f5e' }, // Pink Plus
      { pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1], color: '#f43f5e' }, // Pink X
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#f43f5e' }, // Pink Solid
      { pattern: [0, 1, 0, 1, 1, 1, 0, 1, 0], color: '#38bdf8' }, // Blue Plus
      { pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1], color: '#38bdf8' }, // Blue X
      { pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#38bdf8' }, // Blue Solid
    ]
  }
};

// --- 2. Hardware-Accelerated Grid Matrix ---
const PixelMatrix = ({ theme }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0); // Reset animation cycle when theme changes
    const phase = ANIMATION_PHASES[theme];
    if (!phase) return;

    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % phase.frames.length);
    }, phase.speed);

    return () => clearInterval(interval);
  }, [theme]);

  const phase = ANIMATION_PHASES[theme] || ANIMATION_PHASES.warm;
  const currentFrame = phase.frames[frameIndex] || phase.frames[0];

  return (
    <div className="grid grid-cols-3 gap-[1px] w-[14px] h-[14px] flex-shrink-0">
      {currentFrame.pattern.map((isActive, i) => (
        <motion.div
          key={i}
          className="w-full h-full rounded-[0.5px]"
          initial={false}
          animate={{
            backgroundColor: isActive ? currentFrame.color : 'rgba(0,0,0,0)',
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.85
          }}
          transition={{ 
            duration: 0.15, 
            ease: "easeInOut" 
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  // --- 3. Exact Sequence & Timing from your uploaded video ---
  const SEQUENCE = [
    { top: "Read app-sidebar.tsx 219 lines", bottom: "Thinking", theme: "warm", duration: 4000 },
    { top: "Read dropdown-menu.tsx 257 lines", bottom: "Reading file", theme: "readingCool", duration: 2000 },
    { top: "Read tooltip.tsx 63 lines", bottom: "Reading input.tsx", theme: "readingDim", duration: 4000 },
    { top: "Read input.tsx 23 lines", bottom: "Thinking", theme: "thinkingDim", duration: 1000 },
    { top: "Read input.tsx 23 lines", bottom: "Reading file", theme: "readingSolid", duration: 3000 },
    { top: "Read sidebar.tsx 741 lines", bottom: "Thinking", theme: "thinkingPink", duration: 3000 },
    { top: "Read sidebar.tsx 741 lines", bottom: "Responding", theme: "respondingBlue", duration: 1000 },
    { top: "Read sidebar.tsx 741 lines", bottom: "Creating prototype", theme: "prototype", duration: 8000 },
  ];

  const [globalIndex, setGlobalIndex] = useState(0);

  useEffect(() => {
    const currentData = SEQUENCE[globalIndex % SEQUENCE.length];
    const timer = setTimeout(() => {
      setGlobalIndex((prev) => prev + 1);
    }, currentData.duration);
    return () => clearTimeout(timer);
  }, [globalIndex]);

  const currentData = SEQUENCE[globalIndex % SEQUENCE.length];

  return (
    <div className="min-h-screen bg-[#f5f5f2] relative font-sans overflow-hidden flex flex-col items-center">
      
      {/* The main sticky Pill */}
      <div className="fixed top-0 z-50">
        <div 
          className="bg-[#09090b] rounded-b-[24px] px-[32px] pt-[12px] pb-[16px]
                     flex flex-col items-center justify-center 
                     min-w-[280px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]
                     border-b border-white/5"
        >
          
          {/* Top Text (File/Action info) sliding window */}
          <div className="relative h-[18px] w-full flex justify-center mb-[4px]">
            <AnimatePresence>
              <motion.div
                key={currentData.top}
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute text-[#a1a1aa] text-[13px] font-medium tracking-tight whitespace-nowrap"
              >
                {currentData.top}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Bottom Text & Icon (Status) sliding window */}
          <div className="relative h-[22px] w-full flex justify-center">
            <AnimatePresence>
              <motion.div
                key={currentData.bottom}
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute flex items-center gap-[8px]"
              >
                <PixelMatrix theme={currentData.theme} />
                <span className="text-[#fafafa] text-[14.5px] font-medium tracking-wide">
                  {currentData.bottom}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Background numbers that slowly fade in precisely during the 'prototype' phase */}
      <AnimatePresence>
        {currentData.theme === 'prototype' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.15, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-[100px] left-0 right-0 flex justify-center pointer-events-none"
          >
            <div className="flex gap-[48px] font-mono text-[28px] text-[#a1a1aa] mix-blend-multiply">
              <div className="flex flex-col items-center leading-[1.15]"><span>1</span><span>0</span><span>0</span></div>
              <div className="flex flex-col items-center leading-[1.15]"><span>0</span><span>1</span><span>1</span></div>
              <div className="flex flex-col items-center leading-[1.15]"><span>1</span><span>0</span><span>0</span></div>
              <div className="flex flex-col items-center leading-[1.15]"><span>0</span><span>0</span><span>0</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
