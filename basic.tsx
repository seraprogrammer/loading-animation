import React, { useState, useEffect } from 'react';

// --- Precise Shape Definitions ---
// The grid is 0-8:
// 0 1 2
// 3 4 5
// 6 7 8
const SHAPES = {
  'PLUS': [[1, 3, 4, 5, 7]],
  'CROSS': [[0, 2, 4, 6, 8]],
  '2x2': [
    [0, 1, 3, 4], // Top left
    [1, 2, 4, 5], // Top right
    [3, 4, 6, 7], // Bottom left
    [4, 5, 7, 8]  // Bottom right
  ],
  'L_SHAPE': [
    [0, 3, 6, 7], [2, 5, 8, 7], [1, 4, 7, 8], [0, 1, 2, 5]
  ],
  'DOT': [[4], [0], [2], [6], [8]],
  'SQUARE_3x3': [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
  'SPARSE_BLOCK': [
    [0, 1, 3, 4, 8], [1, 2, 4, 5, 6], [3, 4, 6, 7, 2], [4, 5, 7, 8, 0] // Asymmetrical blocks
  ]
};

// --- Theme Configurations ---
// Speed is in milliseconds (how fast the matrix updates)
const THEME_CONFIG = {
  warm: { 
    colors: ['#fca5a5', '#fdba74', '#f97316', '#fb923c', '#f43f5e', '#ef4444'], 
    speed: 160, 
    shapes: ['2x2', 'L_SHAPE', 'SPARSE_BLOCK', 'DOT'] 
  },
  cool: { 
    colors: ['#93c5fd', '#60a5fa', '#3b82f6', '#22d3ee', '#818cf8', '#67e8f9'], 
    speed: 160, 
    shapes: ['2x2', 'L_SHAPE', 'DOT'] 
  },
  dim: { 
    colors: ['#52525b', '#71717a'], 
    speed: 350, // Slower, "searching" feel
    shapes: ['DOT'] 
  },
  mixed: { 
    colors: ['#f97316', '#f43f5e', '#3b82f6', '#22d3ee', '#fbbf24', '#a855f7'], 
    speed: 110, // Very fast rapid cycling for the "prototype" phase
    shapes: ['PLUS', 'CROSS', '2x2', 'SQUARE_3x3'] 
  }
};

const PixelIcon = ({ theme }) => {
  const [pixels, setPixels] = useState(Array(9).fill({ active: false, color: '#000', opacity: 0 }));

  useEffect(() => {
    const config = THEME_CONFIG[theme] || THEME_CONFIG.warm;
    
    const tick = () => {
      // 1. Pick a random shape category from the theme
      const shapeCategory = config.shapes[Math.floor(Math.random() * config.shapes.length)];
      const variants = SHAPES[shapeCategory];
      
      // 2. Pick a specific variant of that shape
      const activeIndices = variants[Math.floor(Math.random() * variants.length)];
      
      // 3. Pick a solid color for this entire "frame"
      const baseColor = config.colors[Math.floor(Math.random() * config.colors.length)];

      setPixels(Array(9).fill(0).map((_, i) => {
        if (activeIndices.includes(i)) {
          return {
            active: true,
            color: baseColor,
            // Slight random opacity variance per pixel gives it that "LED cluster" texture
            opacity: Math.random() * 0.3 + 0.7 
          };
        }
        return { active: false, color: 'transparent', opacity: 0 };
      }));
    };

    tick();
    const interval = setInterval(tick, config.speed);
    return () => clearInterval(interval);
  }, [theme]);

  return (
    <div className="grid grid-cols-3 gap-[1.5px] w-[15px] h-[15px] flex-shrink-0">
      {pixels.map((p, i) => (
        <div
          key={i}
          className="w-full h-full rounded-[0.5px]"
          style={{
            backgroundColor: p.active ? p.color : 'transparent',
            opacity: p.opacity,
            // CRITICAL FIX: No CSS transition duration. This forces the pixels to SNAP 
            // instantly like a real LED grid, fixing the "mushy" animation look.
            transition: 'none' 
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  // Exact sequence and timing mirroring the provided video structure
  const SEQUENCE = [
    { top: "Read app-sidebar.tsx 219 lines", bottom: "Thinking", theme: "warm", duration: 4000 },
    { top: "Read app-sidebar.tsx 219 lines", bottom: "Reading file", theme: "cool", duration: 1500 },
    { top: "Read dropdown-menu.tsx 257 lines", bottom: "Reading file", theme: "cool", duration: 1500 },
    { top: "Read tooltip.tsx 63 lines", bottom: "Reading input.tsx", theme: "dim", duration: 3500 },
    { top: "Read input.tsx 23 lines", bottom: "Thinking", theme: "warm", duration: 1500 },
    { top: "Read input.tsx 23 lines", bottom: "Reading file", theme: "cool", duration: 2500 },
    { top: "Read sidebar.tsx 741 lines", bottom: "Thinking", theme: "warm", duration: 2500 },
    { top: "Read sidebar.tsx 741 lines", bottom: "Responding", theme: "cool", duration: 1500 },
    { top: "Read sidebar.tsx 741 lines", bottom: "Creating prototype", theme: "mixed", duration: 8000 },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const currentStep = SEQUENCE[currentStepIndex];
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % SEQUENCE.length);
    }, currentStep.duration);
    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  const currentData = SEQUENCE[currentStepIndex];

  return (
    <div className="min-h-screen bg-[#f3f3ee] relative font-sans overflow-hidden flex flex-col items-center">
      
      {/* Precise CSS Keyframes for the UI Text sliding */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpEnter {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-text-slide {
          /* Smooth, fast curve matching the Vercel/Linear style */
          animation: slideUpEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Main Pill Container - Snapped to top edge */}
      <div className="fixed top-0 z-50">
        <div 
          className="bg-[#0a0a0a] rounded-b-[26px] px-[32px] pt-[12px] pb-[16px]
                     flex flex-col items-center justify-center 
                     min-w-[280px] shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
        >
          {/* Top Text (File Line count) */}
          <div className="h-[18px] overflow-hidden flex items-center justify-center w-full relative mb-[3px]">
            <div 
              key={currentData.top} 
              className="absolute animate-text-slide text-[#a1a1aa] text-[13px] font-medium tracking-tight whitespace-nowrap"
            >
              {currentData.top}
            </div>
          </div>
          
          {/* Bottom Text & Icon (Status) */}
          <div className="h-[22px] overflow-hidden flex items-center justify-center w-full relative">
            <div 
              key={currentData.bottom}
              className="absolute animate-text-slide flex items-center gap-[10px]"
            >
              <PixelIcon theme={currentData.theme} />
              <span className="text-[#fafafa] text-[14.5px] font-medium tracking-wide">
                {currentData.bottom}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
