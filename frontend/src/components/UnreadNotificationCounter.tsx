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
    <div className="ml-2 bg-red-500 text-white rounded-full px-2">
      {unreadCount}
    </div>
  );
};

export default UnreadNotificationCounter;
