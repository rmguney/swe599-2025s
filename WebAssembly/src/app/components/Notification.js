'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from './NotificationContext';
import { PiMouseLeftClickFill, PiMouseMiddleClickFill } from "react-icons/pi";

export default function Notification({ notification, style }) {
  const { removeNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (notification.type !== 'error' && notification.autoDismiss !== false) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => removeNotification(notification.id), 300);
      }, notification.timeout || 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [notification, removeNotification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => removeNotification(notification.id), 300); 
  };

  const getNotificationStyle = () => {
    switch (notification.type) {
      case 'error':
        return "bg-red-900/90 border-red-600/60";
      case 'controls':
        return "bg-black/70 border-white/20";
      case 'info':
      default:
        return "bg-black/70 border-white/20";
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 0.95, y: 0 },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    hover: { opacity: 1 }
  };
  
  const contentVariants = {
    initial: { scale: 0.95 },
    animate: { scale: 1 },
    exit: { scale: 0.95, transition: { duration: 0.2 } }
  };

  const renderContent = () => {
    switch (notification.type) {
      case 'controls':
        return (
          <>
            <div className="text-white text-xs font-bold mb-2 pr-3">Controls:</div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-white text-xs mb-2">Rover Movement:</div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg animate-pulse-slow">W</div>
                  </div>
                  <div className="flex justify-center gap-1">
                    <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg animate-pulse-slow">A</div>
                    <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg animate-pulse-slow">S</div>
                    <div className="w-8 h-8 text-xs border-2 bg-none border-white/40 flex items-center justify-center text-white rounded font-bold shadow-lg animate-pulse-slow">D</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-white text-xs mb-1">Camera Controls:</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 text-xs bg-none flex items-center justify-center text-white rounded shadow-lg">
                      <PiMouseLeftClickFill size={24} />
                    </div>
                    <span className="text-white text-xs">Click + Drag = Rotate Camera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 text-xs bg-none flex items-center justify-center text-white rounded shadow-lg">
                      <PiMouseMiddleClickFill size={24} />
                    </div>
                    <span className="text-white text-xs">Scroll = Zoom In/Out</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'error':
        return (
          <>
            <div className="font-bold text-red-300 mb-2">{notification.title}</div>
            <p className="text-white mb-2">{notification.message}</p>
            {notification.details && <p className="text-white/70 italic mb-2">{notification.details}</p>}
            <div className="mt-4 flex flex-col gap-2">
              {notification.actions?.map((action, index) => (
                <button 
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1.5 text-xs font-medium rounded ${action.className || 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </>
        );
      case 'info':
      default:
        return (
          <>
            <div className="font-bold mb-1 pr-3">{notification.title}</div>
            <p>{notification.message}</p>
          </>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="w-[250px] min-w-[250px] z-20"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover="hover"
          transition={{ duration: 0.3 }}
          style={style}
        >
          <motion.div 
            className={`text-white text-xs p-3 rounded shadow-lg border relative ${getNotificationStyle()}`}
            variants={contentVariants}
            transition={{ duration: 0.2 }}
          >
            {notification.dismissable !== false && (
              <button 
                onClick={handleDismiss}
                className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
                aria-label="Close notification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
