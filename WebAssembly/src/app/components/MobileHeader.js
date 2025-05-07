'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from './NotificationContext';

export default function MobileHeader({ activeScene, switchScene, unityInstance, isUnloading }) {
  const buttonBaseClass = "text-neutral-300 px-3 py-1.5 text-sm transition-all duration-200 hover:text-white relative focus:outline-none";
  const disabledClass = "opacity-50 cursor-not-allowed hover:text-neutral-300";
  const scenes = ['Heuristic', 'Inference', 'Training'];
  const { addNotification } = useNotifications();
  
  const containerRef = useRef(null);
  const buttonRefs = useRef({
    Heuristic: null,
    Inference: null,
    Training: null
  });
  
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const activeButton = buttonRefs.current[activeScene];
    if (!activeButton) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    
    const left = buttonRect.left - containerRect.left;
    const width = buttonRect.width;
    
    setUnderlineProps({ left, width });
  }, [activeScene]);
  
  const handleSceneSwitch = (sceneName) => {
    if (isUnloading) {
      // Show notification if user tries to switch while loading
      addNotification({
        type: 'info',
        title: 'Scene Switching Blocked',
        message: 'Please wait for the current operation to complete before switching scenes.',
        timeout: 5000
      });
      return;
    }
    
    switchScene(sceneName);
  };
  
  return (
    <div className="lg:hidden">
      <header className="bg-black/70 text-white py-3 px-4 sm:px-6 flex justify-center items-center h-[60px]">
        <div className="flex gap-4 sm:gap-6 items-center justify-center overflow-x-auto scrollbar-hide relative" ref={containerRef}>
          <motion.div 
            className="absolute bottom-0 h-0.5 bg-white"
            initial={false}
            animate={{
              left: underlineProps.left,
              width: underlineProps.width
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
          
          <button 
            className={`${activeScene === 'Heuristic' ? "text-white " : ""}${buttonBaseClass} ${isUnloading ? disabledClass : ""}`}
            onClick={() => handleSceneSwitch('Heuristic')}
            ref={el => buttonRefs.current.Heuristic = el}
            style={{ cursor: isUnloading ? 'not-allowed' : 'pointer' }}
          >
            Heuristic
          </button>
          <button 
            className={`${activeScene === 'Inference' ? "text-white " : ""}${buttonBaseClass} ${isUnloading ? disabledClass : ""}`}
            onClick={() => handleSceneSwitch('Inference')}
            ref={el => buttonRefs.current.Inference = el}
            style={{ cursor: isUnloading ? 'not-allowed' : 'pointer' }}
          >
            Inference
          </button>
          <button 
            className={`${activeScene === 'Training' ? "text-white " : ""}${buttonBaseClass} ${isUnloading ? disabledClass : ""}`}
            onClick={() => handleSceneSwitch('Training')}
            ref={el => buttonRefs.current.Training = el}
            style={{ cursor: isUnloading ? 'not-allowed' : 'pointer' }}
          >
            Training
          </button>
          
          <div className="h-6 w-px bg-[#2a2a2a] mx-2"></div>
          
          <a href="https://github.com/rmguney/Pebbles" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </div>
      </header>
    </div>
  );
}
