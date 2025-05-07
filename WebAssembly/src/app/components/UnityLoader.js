'use client';

import { useEffect, useState } from 'react';
import { useNotifications } from './NotificationContext';

export default function UnityLoader({ sceneName = 'Heuristic', setUnityInstance, setIsLoading }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const loadUnity = () => {
      if (setIsLoading) setIsLoading(true);
      
      const script = document.createElement('script');
      
      let sceneFolder;
      if (sceneName === 'Inference') {
        sceneFolder = 'Inference';
      } else if (sceneName === 'Training') {
        sceneFolder = 'Training';
      } else  if (sceneName === 'Heuristic') {
        sceneFolder = 'Heuristic';
      }
      
      const loaderUrl = `/${sceneFolder}/Build/${sceneFolder}.loader.js`;
      
      console.log(`Loading Unity WebGL build from: ${loaderUrl}`);
      
      script.src = loaderUrl;
      script.async = true;
      script.onerror = () => {
        const errorMsg = `Failed to load Unity loader script from ${loaderUrl}`;
        console.error(errorMsg);
        
        if (setIsLoading) setIsLoading(false);
        
        addNotification({
          type: 'error',
          title: 'Unity Loader Error',
          message: errorMsg,
          details: 'The Unity loader script could not be loaded. This might be due to network issues or missing files.',
          dismissable: true,
          actions: [
            { 
              label: 'Try Again', 
              onClick: handleRetry 
            },
            { 
              label: 'Try Simple Mode', 
              onClick: handleUseSimpleMode,
              className: 'bg-gray-600 text-white hover:bg-gray-500'
            }
          ]
        });
      };
      
      script.onload = () => {
        console.log("Unity loader script loaded successfully");
        const canvas = document.querySelector("#unity-canvas");
        if (!canvas) {
          console.error("Canvas element not found");
          if (setIsLoading) setIsLoading(false);
          return;
        }
        const config = {
          dataUrl: `/${sceneFolder}/Build/${sceneFolder}.data.unityweb`,
          frameworkUrl: `/${sceneFolder}/Build/${sceneFolder}.framework.js.unityweb`,
          codeUrl: `/${sceneFolder}/Build/${sceneFolder}.wasm.unityweb`,
          streamingAssetsUrl: "/StreamingAssets",
          companyName: "rmguney",
          productName: "Pebbles",
          productVersion: "0.2.0",
          showBanner: unityShowBanner,
          compatibilityCheck: null,
          webglContextAttributes: { 
            preserveDrawingBuffer: true,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false
          },
          devicePixelRatio: 1,
          startOnFirstInput: true
        };

        document.querySelector("#unity-loading-bar").style.display = "block";

        try {
          createUnityInstance(canvas, config, (progress) => {
            const progressBar = document.querySelector("#unity-progress-bar-full");
            if (progressBar) {
              progressBar.style.width = 100 * progress + "%";
              setLoadingProgress(Math.round(progress * 100));
              console.log(`Unity loading progress: ${Math.round(progress * 100)}%`);
            }
          }).then((instance) => {
            console.log("Unity instance created successfully");
            const loadingBar = document.querySelector("#unity-loading-bar");
            if (loadingBar) {
              loadingBar.style.display = "none";
            }
            
            if (setIsLoading) setIsLoading(false);
            
            const resumeAudio = () => {
              if (instance) {
                try {
                  const audioContext = instance.Module.WebGLAudioContext;
                  if (audioContext && audioContext.state !== 'running') {
                    audioContext.resume();
                  }
                } catch (e) {
                  console.log("Failed to resume audio context:", e);
                }
              }
              
              ['click', 'touchend'].forEach(eventName => {
                document.removeEventListener(eventName, resumeAudio, true);
              });
            };
            
            ['click', 'touchend'].forEach(eventName => {
              document.addEventListener(eventName, resumeAudio, true);
            });
            
            if (setUnityInstance) {
              setUnityInstance(instance);
            }
            
            const fullscreenButton = document.querySelector(".fullscreen-button");
            if (fullscreenButton) {
              fullscreenButton.onclick = () => {
                instance.SetFullscreen(1);
              };
            }
            
            document.querySelectorAll("button").forEach(button => {
              if (button.textContent.trim() === "Fullscreen") {
                button.onclick = () => {
                  instance.SetFullscreen(1);
                };
              }
            });
          }).catch((message) => {
            console.error("Unity instance creation failed:", message);
            
            if (setIsLoading) setIsLoading(false);
            
            addNotification({
              type: 'error',
              title: 'Unity WebGL Initialization Failed',
              message: `Failed to create Unity instance: ${message || "Unknown error"}`,
              details: 'There may be compatibility issues with your browser or graphics hardware.',
              dismissable: true,
              actions: [
                { 
                  label: 'Try Again', 
                  onClick: handleRetry 
                },
                { 
                  label: 'Try Simple Mode', 
                  onClick: handleUseSimpleMode,
                  className: 'bg-gray-600 text-white hover:bg-gray-500'
                },
                {
                  label: 'Check WebGL Support',
                  onClick: () => window.open('https://get.webgl.org', '_blank'),
                  className: 'bg-transparent border border-gray-500 text-white hover:bg-gray-800'
                }
              ]
            });
            
            const loadingBar = document.querySelector("#unity-loading-bar");
            if (loadingBar) {
              loadingBar.style.display = "none";
            }
          });
        } catch (err) {
          console.error("Exception during Unity initialization:", err);
          
          if (setIsLoading) setIsLoading(false);
          
          addNotification({
            type: 'error',
            title: 'Unity WebGL Exception',
            message: `Exception during Unity initialization: ${err.message}`,
            details: 'There may be compatibility issues with your browser or graphics hardware.',
            dismissable: true,
            actions: [
              { 
                label: 'Try Again', 
                onClick: handleRetry 
              },
              { 
                label: 'Try Simple Mode', 
                onClick: handleUseSimpleMode,
                className: 'bg-gray-600 text-white hover:bg-gray-500'
              }
            ]
          });
          
          const loadingBar = document.querySelector("#unity-loading-bar");
          if (loadingBar) {
            loadingBar.style.display = "none";
          }
        }
      };

      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    window.unityShowBanner = function(msg, type) {
      const warningBanner = document.querySelector("#unity-warning");
      if (!warningBanner) return;

      function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
      }
      
      const div = document.createElement('div');
      div.innerHTML = msg;
      warningBanner.appendChild(div);
      
      if (type === 'error') {
        div.style = 'background: red; padding: 10px;';
        console.error("Unity Error:", msg);
        
        addNotification({
          type: 'error',
          title: 'Unity Error',
          message: msg,
          dismissable: true
        });
      } else {
        if (type === 'warning') {
          div.style = 'background: yellow; padding: 10px;';
          console.warn("Unity Warning:", msg);
        }
        setTimeout(function() {
          warningBanner.removeChild(div);
          updateBannerVisibility();
        }, 5000);
      }
      
      updateBannerVisibility();
    };

    if (!isRetrying) {
      loadUnity();
    }
    
    return () => {
      const canvas = document.querySelector("#unity-canvas");
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) context.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [sceneName, setUnityInstance, isRetrying, addNotification, setIsLoading]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
    }, 500);
  };

  const handleUseSimpleMode = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('simplemode', 'true');
    window.location.href = url.toString();
  };

  return null;
}
