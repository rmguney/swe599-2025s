'use client';

import { useState, useEffect } from 'react';
import UnityLoader from './UnityLoader';

export default function SceneSwitcher() {
  const [activeScene, setActiveScene] = useState('Manual');
  const [unityInstance, setUnityInstance] = useState(null);

  const switchScene = (sceneName) => {
    if (activeScene === sceneName) return;
    
    // If we have a unity instance, destroy it before switching
    if (unityInstance) {
      unityInstance.Quit().then(() => {
        setUnityInstance(null);
        setActiveScene(sceneName);
      });
    } else {
      setActiveScene(sceneName);
    }
  };

  // Common button style classes
  const buttonBaseClass = "bg-[rgba(0,0,0,0.5)] text-white px-2 py-1 rounded border border-[#444] transition-all duration-200 hover:bg-[rgba(60,60,60,0.5)] text-xs";
  const activeButtonClass = "bg-[#222] border-[#dddddd]";

  return (
    <>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          className={`${buttonBaseClass} ${activeScene === 'Manual' ? activeButtonClass : ''}`}
          onClick={() => switchScene('Manual')}
        >
          Manual Mode
        </button>
        <button 
          className={`${buttonBaseClass} ${activeScene === 'AI' ? activeButtonClass : ''}`}
          onClick={() => switchScene('AI')}
        >
          AI Mode (WIP)
        </button>
        <button 
          className={buttonBaseClass}
          onClick={() => unityInstance?.SetFullscreen(1)}
        >
          Fullscreen
        </button>
      </div>
      <UnityLoader 
        sceneName={activeScene} 
        setUnityInstance={setUnityInstance}
      />
    </>
  );
}
