import React, { useEffect, useState } from 'react';
import notificationService from '../services/NotificationService';

const UnreadNotificationCounter: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const subscription = notificationService
      .unreadCount()
      .subscribe(setUnreadCount);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative">
      <button className="relative">
        Notifications
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default UnreadNotificationCounter;
