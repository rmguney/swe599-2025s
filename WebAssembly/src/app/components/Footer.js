'use client';

export default function Footer({ activeScene, switchScene, unityInstance, isUnloading }) {
  const buttonBaseClass = "text-neutral-300 px-3 py-1.5 text-sm transition-all duration-200 hover:text-white relative";
  
  const getButtonClasses = (sceneName) => {
    return `${buttonBaseClass} ${
      activeScene === sceneName 
        ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white" 
        : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-white hover:after:opacity-50"
    }`;
  };

  return (
    <footer className="hidden lg:flex bg-[#121212] py-3 px-6 border-t border-[#2a2a2a] w-full flex-shrink-0 z-10 justify-center items-center min-h-[60px] max-h-[60px]">
      <div className="flex items-center gap-8 lg:-translate-y-0.5">
        <button 
          className={getButtonClasses('Heuristic')}
          onClick={() => switchScene('Heuristic')}
          disabled={isUnloading}
        >
          Heuristic
        </button>
        <button 
          className={getButtonClasses('Agents')}
          onClick={() => switchScene('Agents')}
          disabled={isUnloading}
        >
          Agents (WIP)
        </button>
        <button 
          className={getButtonClasses('Inference')}
          onClick={() => switchScene('Inference')}
          disabled={isUnloading}
        >
          Inference (WIP)
        </button>
        
        <div className="h-6 w-px bg-[#2a2a2a]"></div>
        
        <button 
          className={buttonBaseClass + " hover:text-white disabled:opacity-50 disabled:hover:text-neutral-300 flex items-center justify-center"}
          onClick={() => unityInstance?.SetFullscreen(1)}
          disabled={!unityInstance}
          title="Fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
          </svg>
        </button>
      </div>
    </footer>
  );
}
