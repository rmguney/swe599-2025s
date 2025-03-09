'use client';

import { useNotifications } from './NotificationContext';
import Notification from './Notification';
import { motion } from 'framer-motion';

export default function NotificationContainer() {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <motion.div 
      className="absolute top-4 left-4 flex flex-col gap-3 z-50 max-w-[280px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {notifications.map((notification, index) => (
        <Notification 
          key={notification.id} 
          notification={notification} 
          style={{ zIndex: 50 + notifications.length - index }}
        />
      ))}
    </motion.div>
  );
}
