'use client';

import { useState, useEffect } from 'react';
import UnityLoader from './UnityLoader';
import { motion, AnimatePresence } from 'framer-motion';

export default function SceneSwitcher({ setActiveSceneProps, setUnityInstanceProps, setIsUnloadingProps, setIsLoadingProps }) {
  const [activeScene, setActiveScene] = useState('Heuristic');
  const [unityInstance, setUnityInstance] = useState(null);
  const [isUnloading, setIsUnloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (setActiveSceneProps) setActiveSceneProps(activeScene);
    if (setUnityInstanceProps) setUnityInstanceProps(unityInstance);
    if (setIsUnloadingProps) setIsUnloadingProps(isUnloading);
    if (setIsLoadingProps) setIsLoadingProps(isLoading);
  }, [activeScene, unityInstance, isUnloading, isLoading, setActiveSceneProps, setUnityInstanceProps, setIsUnloadingProps, setIsLoadingProps]);

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
  }, [unityInstance]);

  const switchScene = (sceneName) => {
    if (activeScene === sceneName || isUnloading || isLoading) return;
    
    setIsUnloading(true);
    
    if (unityInstance) {
      console.log(`Unloading scene: ${activeScene}`);
      
      const canvas = document.getElementById('unity-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
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
      <AnimatePresence>
        {isUnloading && (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-sm py-2 px-4 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Switching to {activeScene}...
          </motion.div>
        )}
      </AnimatePresence>
      <UnityLoader 
        sceneName={activeScene} 
        setUnityInstance={setUnityInstance}
        setIsLoading={setIsLoading}
      />
    </>
  );
}
