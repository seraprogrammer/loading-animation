import React from 'react';

const LogicalCore = () => {
  return (
    <div className="relative w-[14px] h-[14px] flex-shrink-0 animate-spin-step">
      {/* We use raw CSS here because we need highly precise control over the 
        cubic-bezier timing functions *inside* specific keyframe percentages 
        to get that ultra-smooth, premium Apple-like snap.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes expand-step {
          0%, 15% { 
            transform: translate(0, 0) scale(1); 
            border-radius: 2px; 
            box-shadow: 0 0 0px rgba(255,255,255,0);
            animation-timing-function: cubic-bezier(0.85, 0, 0.15, 1); 
          }
          40%, 60% { 
            transform: translate(var(--tx), var(--ty)) scale(0.75); 
            border-radius: 50%; 
            opacity: 0.5; 
            /* Adds a soft "firing synapse" glow when expanded */
            box-shadow: 0 0 8px rgba(255,255,255,0.4); 
            animation-timing-function: cubic-bezier(0.85, 0, 0.15, 1); 
          }
          85%, 100% { 
            transform: translate(0, 0) scale(1); 
            border-radius: 2px; 
            box-shadow: 0 0 0px rgba(255,255,255,0);
          }
        }
        
        @keyframes spin-step {
          0%, 15% { 
            transform: rotate(0deg); 
            animation-timing-function: cubic-bezier(0.85, 0, 0.15, 1); 
          }
          85%, 100% { 
            transform: rotate(90deg); 
          }
        }

        .animate-spin-step { animation: spin-step 2s infinite; }
        .logic-node { animation: expand-step 2s infinite; }
      `}} />

      {/* The 4 quadrants of the logic core */}
      <div className="logic-node absolute top-0 left-0 w-[6px] h-[6px] bg-white" style={{ "--tx": "-4px", "--ty": "-4px" }} />
      <div className="logic-node absolute top-0 right-0 w-[6px] h-[6px] bg-white" style={{ "--tx": "4px", "--ty": "-4px" }} />
      <div className="logic-node absolute bottom-0 left-0 w-[6px] h-[6px] bg-white" style={{ "--tx": "-4px", "--ty": "4px" }} />
      <div className="logic-node absolute bottom-0 right-0 w-[6px] h-[6px] bg-white" style={{ "--tx": "4px", "--ty": "4px" }} />
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center font-sans">
      
      {/* Required CSS for the text shimmer and dot fading */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer-sweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes dot-fade {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}} />

      {/* Sleek, minimalist container */}
      <div 
        className="bg-[#18181b] border border-white/5 rounded-full pl-[18px] pr-[22px] py-[12px] flex items-center gap-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <LogicalCore />
        
        <div className="flex items-center">
          {/* Shimmering Text */}
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 bg-[length:200%_auto] font-medium text-[14.5px] tracking-wide"
            style={{ animation: 'shimmer-sweep 2.5s linear infinite' }}
          >
            Reasoning
          </span>
          
          {/* Softly sequential fading ellipsis */}
          <span className="text-zinc-400 text-[14.5px] font-medium ml-[2px] tracking-widest flex">
            <span style={{ animation: 'dot-fade 1.4s ease-in-out infinite 0s' }}>.</span>
            <span style={{ animation: 'dot-fade 1.4s ease-in-out infinite 0.2s' }}>.</span>
            <span style={{ animation: 'dot-fade 1.4s ease-in-out infinite 0.4s' }}>.</span>
          </span>
        </div>

      </div>

    </div>
  );
}
