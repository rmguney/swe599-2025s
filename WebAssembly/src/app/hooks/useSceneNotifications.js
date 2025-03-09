'use client';

import { useEffect } from 'react';
import { useNotifications } from '../components/NotificationContext';

export function useSceneNotifications(activeScene, unityInstance, isLoading, isUnloading) {
  const { addNotification, clearNotifications } = useNotifications();
  const isLoadingOrUnloading = isLoading || isUnloading;

  useEffect(() => {
    if (unityInstance && !isLoadingOrUnloading) {
      clearNotifications();
      
      const sceneDescriptions = {
        Heuristic: "Manually control the Mars rover, navigate terrain, and collect samples.",
        Inference: "Watch the AI-trained rover autonomously navigate and collect samples. This scene is still under development and not a representation of the final AI model.",
        Agents: "Multiple rover agents leveraging reinforcement learning for collaborative exploration. This scene is still under development and not a representation of the final AI model."
      };
      
      addNotification({
        type: 'info',
        title: `${activeScene} Scene`,
        message: sceneDescriptions[activeScene] || "",
        timeout: 10000
      });
      
      if (activeScene === 'Heuristic') {
        setTimeout(() => {
          addNotification({
            type: 'controls',
            timeout: 20000, 
            dismissable: true
          });
        }, 1000);
      }
    }
  }, [activeScene, unityInstance, isLoadingOrUnloading, addNotification, clearNotifications]);

  return null;
}
