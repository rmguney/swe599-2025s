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
        Training: "Multiple rover agents leveraging reinforcement learning for collaborative exploration of the environment, physics, controls, and object recognition. This scene serves as a respresentation of the training process.",
        Inference: "Watch the AI-trained rover autonomously navigate and collect samples. This scene serves as a representation of the inference process, and the trained model's performance.",
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
