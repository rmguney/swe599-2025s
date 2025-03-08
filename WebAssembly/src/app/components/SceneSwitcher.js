'use client';

import { useState, useEffect } from 'react';
import UnityLoader from './UnityLoader';

export default function SceneSwitcher({ setActiveSceneProps, setUnityInstanceProps, setIsUnloadingProps }) {
  const [activeScene, setActiveScene] = useState('Heuristic');
  const [unityInstance, setUnityInstance] = useState(null);
  const [isUnloading, setIsUnloading] = useState(false);

  useEffect(() => {
    if (setActiveSceneProps) setActiveSceneProps(activeScene);
    if (setUnityInstanceProps) setUnityInstanceProps(unityInstance);
    if (setIsUnloadingProps) setIsUnloadingProps(isUnloading);
  }, [activeScene, unityInstance, isUnloading, setActiveSceneProps, setUnityInstanceProps, setIsUnloadingProps]);

  // Expose the switchScene method to the parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const container = document.getElementById('scene-switcher-instance');
      if (container) {
        container.switchScene = switchScene;
      }
    }
    
    return () => {
      const container = document.getElementById('scene-switcher-instance');
      if (container) {
        delete container.switchScene;
      }
    };
  }, [unityInstance]); // Re-attach when unity instance changes

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

  return (
    <>
      {isUnloading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-sm py-2 px-4 rounded">
          Switching to {activeScene}...
        </div>
      )}
      <UnityLoader 
        sceneName={activeScene} 
        setUnityInstance={setUnityInstance}
      />
    </>
  );
}
