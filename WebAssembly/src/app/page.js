'use client';

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileHeader from './components/MobileHeader';
import SceneSwitcher from './components/SceneSwitcher';
import MobileWarning from './components/MobileWarning';
import NotificationContainer from './components/NotificationContainer';
import { useSceneNotifications } from './hooks/useSceneNotifications';

export default function Home() {
  const [activeScene, setActiveScene] = useState('Heuristic');
  const [unityInstance, setUnityInstance] = useState(null);
  const [isUnloading, setIsUnloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isLoadingOrUnloading = isLoading || isUnloading;

  // Use the custom hook for handling scene notifications
  useSceneNotifications(activeScene, unityInstance, isLoading, isUnloading);

  const handleSwitchScene = (sceneName) => {
    if (activeScene === sceneName || isLoadingOrUnloading) return;
    
    const sceneSwitcherInstance = document.getElementById('scene-switcher-instance');
    if (sceneSwitcherInstance && sceneSwitcherInstance.switchScene) {
      sceneSwitcherInstance.switchScene(sceneName);
    } else {
      setActiveScene(sceneName);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <MobileWarning />
      <div className="flex-none">
        <Header 
          activeScene={activeScene}
          switchScene={handleSwitchScene}
          unityInstance={unityInstance}
          isUnloading={isLoadingOrUnloading}
        />
        <MobileHeader 
          activeScene={activeScene}
          switchScene={handleSwitchScene}
          unityInstance={unityInstance}
          isUnloading={isLoadingOrUnloading}
        />
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <div className="relative w-full h-full" id="unity-container">
          <canvas id="unity-canvas" tabIndex="-1" className="w-full h-full bg-[#1a1a1a]"></canvas>
          <div id="unity-loading-bar">
            <div id="unity-logo"></div>
            <div id="unity-progress-bar-empty">
              <div id="unity-progress-bar-full"></div>
            </div>
          </div>
          <div id="unity-warning" className="absolute left-1/2 top-[5%] transform -translate-x-1/2 bg-white p-[10px] hidden"></div>
        </div>
        
        <NotificationContainer />
        
        <div id="scene-switcher-instance">
          <SceneSwitcher 
            setActiveSceneProps={setActiveScene}
            setUnityInstanceProps={setUnityInstance}
            setIsUnloadingProps={setIsUnloading}
            setIsLoadingProps={setIsLoading}
          />
        </div>
      </div>
      
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
}
