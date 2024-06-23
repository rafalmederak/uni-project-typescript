import React, { useEffect, useState } from 'react';
import notificationService, {
  Notification,
} from '../services/NotificationService';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const subscription = notificationService.list().subscribe(setNotifications);
    return () => subscription.unsubscribe();
  }, []);

  const handleMarkAsRead = (notification: Notification) => {
    notificationService.markAsRead(notification);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} className="mb-2">
            <div
              className={`p-2 border rounded ${
                notification.read ? 'bg-gray-200' : 'bg-white dark:bg-gray-700'
              }`}
            >
              <h3 className="font-bold">{notification.title}</h3>
              <p>{notification.message}</p>
              <small>{new Date(notification.date).toLocaleString()}</small>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification)}
                  className="ml-4 p-1 bg-blue-500 text-white rounded"
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
