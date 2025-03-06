'use client';

import { useEffect } from 'react';

export default function UnityLoader() {
  useEffect(() => {
    // Unity loader script
    const loadUnity = () => {
      const script = document.createElement('script');
      const buildUrl = "/Build";
      const loaderUrl = buildUrl + "/WebGL.loader.js";
      script.src = loaderUrl;
      script.async = true;
      
      script.onload = () => {
        const canvas = document.querySelector("#unity-canvas");
        if (!canvas) return;
        
        const config = {
          dataUrl: buildUrl + "/WebGL.data",
          frameworkUrl: buildUrl + "/WebGL.framework.js",
          codeUrl: buildUrl + "/WebGL.wasm",
          streamingAssetsUrl: "/StreamingAssets",
          companyName: "rmguney",
          productName: "Pebbles",
          productVersion: "0.1.0",
          showBanner: unityShowBanner,
        };

        document.querySelector("#unity-loading-bar").style.display = "block";

        createUnityInstance(canvas, config, (progress) => {
          const progressBar = document.querySelector("#unity-progress-bar-full");
          if (progressBar) {
            progressBar.style.width = 100 * progress + "%";
          }
        }).then((unityInstance) => {
          const loadingBar = document.querySelector("#unity-loading-bar");
          if (loadingBar) {
            loadingBar.style.display = "none";
          }
          
          const fullscreenButton = document.querySelector(".fullscreen-button");
          if (fullscreenButton) {
            fullscreenButton.onclick = () => {
              unityInstance.SetFullscreen(1);
            };
          }
        }).catch((message) => {
          alert(message);
        });
      };

      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };

    // Shows a temporary message banner/ribbon for a few seconds
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
      } else {
        if (type === 'warning') {
          div.style = 'background: yellow; padding: 10px;';
        }
        setTimeout(function() {
          warningBanner.removeChild(div);
          updateBannerVisibility();
        }, 5000);
      }
      
      updateBannerVisibility();
    };

    loadUnity();
    
  }, []);

  return null;
}
