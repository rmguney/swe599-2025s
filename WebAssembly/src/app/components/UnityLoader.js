'use client';

import { useEffect, useState } from 'react';

export default function UnityLoader({ sceneName = 'Heuristic', setUnityInstance }) {
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  useEffect(() => {
    const loadUnity = () => {
      const script = document.createElement('script');
      
      const sceneFolder = sceneName === 'Inference' ? 'Inference' : 'Heuristic';
      const loaderUrl = `/${sceneFolder}/Build/${sceneFolder}.loader.js`;
      
      console.log(`Loading Unity WebGL build from: ${loaderUrl}`);
      
      script.src = loaderUrl;
      script.async = true;
      script.onerror = () => {
        const errorMsg = `Failed to load Unity loader script from ${loaderUrl}`;
        console.error(errorMsg);
        setError(errorMsg);
      };
      
      script.onload = () => {
        console.log("Unity loader script loaded successfully");
        const canvas = document.querySelector("#unity-canvas");
        if (!canvas) {
          console.error("Canvas element not found");
          return;
        }
        
        // Enhanced configuration for compatibility
        const config = {
          dataUrl: `/${sceneFolder}/Build/${sceneFolder}.data.unityweb`,
          frameworkUrl: `/${sceneFolder}/Build/${sceneFolder}.framework.js.unityweb`,
          codeUrl: `/${sceneFolder}/Build/${sceneFolder}.wasm.unityweb`,
          streamingAssetsUrl: "/StreamingAssets",
          companyName: "rmguney",
          productName: "Pebbles",
          productVersion: "0.2.0",
          showBanner: unityShowBanner,
          // Add WebGL compatibility options
          compatibilityCheck: null,
          webglContextAttributes: { 
            preserveDrawingBuffer: true,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false
          },
          // Disable some features that might cause problems
          devicePixelRatio: 1,
          // More lenient error handling
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
            
            // Fix AudioContext - resume on user interaction
            const resumeAudio = () => {
              if (instance) {
                try {
                  // Resume AudioContext
                  const audioContext = instance.Module.WebGLAudioContext;
                  if (audioContext && audioContext.state !== 'running') {
                    audioContext.resume();
                  }
                } catch (e) {
                  console.log("Failed to resume audio context:", e);
                }
              }
              
              // Remove event listeners after first interaction
              ['click', 'touchend'].forEach(eventName => {
                document.removeEventListener(eventName, resumeAudio, true);
              });
            };
            
            // Add event listeners for user interaction to resume audio
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
            
            // Add fullscreen functionality to any element that might trigger fullscreen
            document.querySelectorAll("button").forEach(button => {
              if (button.textContent.trim() === "Fullscreen") {
                button.onclick = () => {
                  instance.SetFullscreen(1);
                };
              }
            });
          }).catch((message) => {
            console.error("Unity instance creation failed:", message);
            setError({
              title: "Unity WebGL Initialization Failed",
              message: `Failed to create Unity instance: ${message || "Unknown error"}`,
              details: "There may be compatibility issues with your browser or graphics hardware."
            });
            const loadingBar = document.querySelector("#unity-loading-bar");
            if (loadingBar) {
              loadingBar.style.display = "none";
            }
          });
        } catch (err) {
          console.error("Exception during Unity initialization:", err);
          setError({
            title: "Unity WebGL Exception",
            message: `Exception during Unity initialization: ${err.message}`,
            details: "There may be compatibility issues with your browser or graphics hardware."
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
  }, [sceneName, setUnityInstance, isRetrying]);

  const handleRetry = () => {
    setError(null);
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
    }, 500);
  };

  const handleUseSimpleMode = () => {
    // Add a URL parameter to indicate simpler rendering settings
    const url = new URL(window.location.href);
    url.searchParams.set('simplemode', 'true');
    window.location.href = url.toString();
  };

  if (error) {
    return (
      <div className="unity-error-overlay">
        <div className="unity-error-message">
          <h3>{typeof error === 'object' ? error.title : 'Error Loading Simulation'}</h3>
          <p>{typeof error === 'object' ? error.message : error}</p>
          {typeof error === 'object' && error.details && <p className="error-details">{error.details}</p>}
          
          <div className="error-info">
            <p>Common causes:</p>
            <ul>
              <li>Unsupported browser or graphics card</li>
              <li>Outdated graphics drivers</li>
              <li>WebGL features disabled in your browser</li>
            </ul>
          </div>
          
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
            <button onClick={handleUseSimpleMode} className="simple-mode-button">
              Try Simple Mode
            </button>
            <a href="https://get.webgl.org" target="_blank" rel="noopener noreferrer" className="webgl-link">
              Check WebGL Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unity-loader-status">
      {loadingProgress > 0 && loadingProgress < 100 && (
        <div className="unity-mobile-progress">
          Loading: {loadingProgress}%
        </div>
      )}
    </div>
  );
}
