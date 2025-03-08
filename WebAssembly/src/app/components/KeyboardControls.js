'use client';

import { useEffect, useState } from 'react';

export default function KeyboardControls({ activeScene, unityInstance }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if we're on the Heuristic scene
  const isHeuristicScene = activeScene === 'Heuristic';

  // Watch for Unity instance to be loaded
  useEffect(() => {
    if (isHeuristicScene && unityInstance) {
      // Unity instance is available, scene is loaded
      setIsLoaded(true);
      // Show the controls with a slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
      setIsVisible(false);
    }
  }, [isHeuristicScene, unityInstance]);

  // Don't render anything if not on Heuristic scene or not loaded
  if (!isHeuristicScene) {
    return null;
  }

  return (
    <div className={`hidden lg:flex flex-col items-start absolute top-[5%] left-[2%] rounded-lg transition-opacity duration-700 z-20 ${
      isVisible ? 'opacity-80 hover:opacity-100' : 'opacity-0'
    }`}>
      <div className="flex flex-col items-center gap-1">
        <div className="flex justify-center">
          <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg">W</div>
        </div>
        <div className="flex justify-center gap-1">
          <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg">A</div>
          <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg">S</div>
          <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg">D</div>
        </div>
      </div>
    </div>
  );
}
