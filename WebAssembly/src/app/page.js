'use client';

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileHeader from './components/MobileHeader';
import SceneSwitcher from './components/SceneSwitcher';
import KeyboardControls from './components/KeyboardControls';
import MobileWarning from './components/MobileWarning';

export default function Home() {
  const [activeScene, setActiveScene] = useState('Heuristic');
  const [unityInstance, setUnityInstance] = useState(null);
  const [isUnloading, setIsUnloading] = useState(false);

  const handleSwitchScene = (sceneName) => {
    // Pass the scene switch request to the SceneSwitcher component
    if (activeScene === sceneName || isUnloading) return;
    
    // Find the switchScene function in the SceneSwitcher component instance
    const sceneSwitcherInstance = document.getElementById('scene-switcher-instance');
    if (sceneSwitcherInstance && sceneSwitcherInstance.switchScene) {
      sceneSwitcherInstance.switchScene(sceneName);
    } else {
      // Fallback: directly update the scene state
      setActiveScene(sceneName);
    }
  };

  return (
    <div className="app-container flex flex-col h-screen bg-[#0a0a0a]">
      <MobileWarning />
      <div className="app-header">
        <Header />
        <MobileHeader 
          activeScene={activeScene}
          switchScene={handleSwitchScene}
          unityInstance={unityInstance}
          isUnloading={isUnloading}
        />
      </div>
      
      <div className="app-main flex-1 relative">
        <div id="unity-container">
          <canvas id="unity-canvas" tabIndex="-1"></canvas>
          <div id="unity-loading-bar">
            <div id="unity-logo"></div>
            <div id="unity-progress-bar-empty">
              <div id="unity-progress-bar-full"></div>
            </div>
          </div>
          <div id="unity-warning"></div>
        </div>
        <KeyboardControls 
          activeScene={activeScene} 
          unityInstance={unityInstance} 
        />
        <div id="scene-switcher-instance">
          <SceneSwitcher 
            setActiveSceneProps={setActiveScene}
            setUnityInstanceProps={setUnityInstance}
            setIsUnloadingProps={setIsUnloading}
          />
        </div>
      </div>
      
      <div className="app-footer">
        <Footer 
          activeScene={activeScene}
          switchScene={handleSwitchScene}
          unityInstance={unityInstance}
          isUnloading={isUnloading}
        />
      </div>
    </div>
  );
}
