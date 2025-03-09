'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-6 max-w-[500px] w-full text-white text-center shadow-lg"
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-1 text-xs text-left">Small Screen Detected</p>
            <p className="text-neutral-300 text-xs text-left">
              This website is designed to be viewed at larger screens and some scenes require a keyboard or mouse to control and some screens might still not open due to memory limitation of mobile devices.
            </p>
            <p className="mt-4 mb-1 text-xs text-left">For the best experience:</p>
            <ul className="ml-5 list-disc text-neutral-300 text-xs text-left">
              <li>Use a desktop or laptop computer if possible</li>
              <li>If using a mobile device, view in landscape orientation </li>
            </ul>
            <div className="mt-4">
              <button 
                onClick={handleDismiss} 
                className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1.5 text-xs font-bold relative rounded transition-colors duration-200"
              >
                Continue anyway
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
