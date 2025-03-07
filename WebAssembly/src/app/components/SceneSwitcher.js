'use client';

import { useState, useEffect } from 'react';
import UnityLoader from './UnityLoader';

export default function SceneSwitcher() {
  const [activeScene, setActiveScene] = useState('Manual');
  const [unityInstance, setUnityInstance] = useState(null);
  const [isUnloading, setIsUnloading] = useState(false);

  const switchScene = (sceneName) => {
    if (activeScene === sceneName || isUnloading) return;
    
    setIsUnloading(true);
    
    // If we have a unity instance, destroy it before switching
    if (unityInstance) {
      console.log(`Unloading scene: ${activeScene}`);
      
      // First clear the canvas to indicate scene is unloading
      const canvas = document.getElementById('unity-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // Then properly quit the Unity instance
      unityInstance.Quit().then(() => {
        console.log(`Scene ${activeScene} unloaded successfully`);
        setUnityInstance(null);
        setActiveScene(sceneName);
        setIsUnloading(false);
      }).catch(err => {
        console.error("Error unloading scene:", err);
        setUnityInstance(null);
        setActiveScene(sceneName);
        setIsUnloading(false);
      });
    } else {
      setActiveScene(sceneName);
      setIsUnloading(false);
    }
  };

  const buttonBaseClass = "bg-[rgba(0,0,0,0.5)] text-white px-2 py-1 rounded border border-[#444] transition-all duration-200 hover:bg-[rgba(60,60,60,0.5)] text-xs";
  const activeButtonClass = "bg-[#222] border-[#dddddd]";

  return (
    <>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          className={`${buttonBaseClass} ${activeScene === 'Manual' ? activeButtonClass : ''}`}
          onClick={() => switchScene('Manual')}
          disabled={isUnloading}
        >
          <span className="relative z-10">Manual Mode</span>
        </button>
        <button 
          className={`${buttonBaseClass} ${activeScene === 'AI' ? activeButtonClass : ''}`}
          onClick={() => switchScene('AI')}
          disabled={isUnloading}
        >
          <span className="relative z-10">AI Mode (WIP)</span>
        </button>
        <button 
          className={buttonBaseClass}
          onClick={() => unityInstance?.SetFullscreen(1)}
          disabled={!unityInstance}
        >
          <span className="relative z-10">Fullscreen</span>
        </button>
      </div>
      {isUnloading && (
        <div className="absolute bottom-14 right-4 bg-black/70 text-white text-xs py-1 px-3 rounded">
          Switching scene...
        </div>
      )}
      <UnityLoader 
        sceneName={activeScene} 
        setUnityInstance={setUnityInstance}
      />
    </>
  );
}
