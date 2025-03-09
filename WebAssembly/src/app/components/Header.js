'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from './NotificationContext';

export default function Header({ activeScene, switchScene, unityInstance, isUnloading }) {
  const buttonBaseClass = "text-neutral-300 px-3 py-1.5 text-sm transition-all duration-200 hover:text-white relative cursor-pointer";
  const disabledClass = "opacity-50 cursor-not-allowed hover:text-neutral-300";
  const scenes = ['Heuristic', 'Agents', 'Inference'];
  const containerRef = useRef(null);
  const buttonRefs = useRef({
    Heuristic: null,
    Agents: null,
    Inference: null
  });
  const { addNotification } = useNotifications();
  
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

  const handleFullscreenClick = () => {
    if (!unityInstance) {
      addNotification({
        type: 'info',
        title: 'Fullscreen Unavailable',
        message: 'Fullscreen mode is available once the scene is fully loaded.',
        timeout: 5000
      });
      return;
    }
    
    unityInstance.SetFullscreen(1);
  };

  return (
    <header className="hidden lg:flex bg-black/70 text-white py-3 px-6 justify-center items-center min-h-[60px] max-h-[60px] shadow-xl">      
      <div className="flex items-center gap-8 relative" ref={containerRef}>
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
          className={`${activeScene === 'Agents' ? "text-white " : ""}${buttonBaseClass} ${isUnloading ? disabledClass : ""}`}
          onClick={() => handleSceneSwitch('Agents')}
          ref={el => buttonRefs.current.Agents = el}
          style={{ cursor: isUnloading ? 'not-allowed' : 'pointer' }}
        >
          Agents
        </button>
        <button 
          className={`${activeScene === 'Inference' ? "text-white " : ""}${buttonBaseClass} ${isUnloading ? disabledClass : ""}`}
          onClick={() => handleSceneSwitch('Inference')}
          ref={el => buttonRefs.current.Inference = el}
          style={{ cursor: isUnloading ? 'not-allowed' : 'pointer' }}
        >
          Inference
        </button>
        
        <div className="h-6 w-px bg-[#2a2a2a]"></div>
        
        <button 
          className={`${buttonBaseClass} hover:text-white flex items-center justify-center ${!unityInstance ? disabledClass : ""}`}
          onClick={handleFullscreenClick}
          style={{ cursor: !unityInstance ? 'not-allowed' : 'pointer' }}
          title="Fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
