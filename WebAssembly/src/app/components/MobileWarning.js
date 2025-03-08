'use client';

import { useState, useEffect } from 'react';

export default function MobileWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth < 1024 && !dismissed);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-3">
      <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-6 max-w-[500px] w-full text-white text-center shadow-lg">
        <p className="text-neutral-300 text-xs text-left">
          This website is designed to be viewed at larger screens and some scenes require a keyboard or mouse to control
        </p>
          <p className="mt-4 mb-1 text-xs text-left">For the best experience:</p>
          <ul className="ml-5 list-disc text-neutral-300 text-xs text-left">
            <li>Use a desktop or laptop computer if possible</li>
            <li>If using a mobile device, view in landscape orientation</li>
          </ul>
        <div className="mt-5">
          <button 
            onClick={handleDismiss} 
            className="text-neutral-300 px-3 py-1.5 text-xs transition-all duration-200 hover:text-white relative"
          >
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  );
}
