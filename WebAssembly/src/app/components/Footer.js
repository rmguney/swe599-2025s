'use client';

export default function Footer() {
  return (
    <footer className="hidden lg:flex bg-black/70 py-3 px-6 w-full flex-shrink-0 z-10 justify-center items-center min-h-[60px] max-h-[60px]">
      <div className="flex items-center justify-center max-w-4xl">
        <div className="text-xs text-neutral-400 px-3 max-w-[50%]">
          <p className="text-center overflow-hidden text-ellipsis">
          Pebbles: A Mars rover simulation using deep reinforcement and imitation learning (PPO & GAIL) for autonomous navigation and sample retrieval.
          </p>
        </div>
        
        <div className="h-8 w-px bg-[#2a2a2a] mx-4"></div>
        
        <a 
          href="https://github.com/rmguney/Pebbles" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors duration-200 px-3 py-1 rounded-md hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span className="text-sm">/rmguney</span>
        </a>
      </div>
    </footer>
  );
}
