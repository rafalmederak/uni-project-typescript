import React, { useEffect, useState } from 'react';
import notificationService from '../services/NotificationService';
import { Notification } from '../interfaces/Notification';
import { IoMdNotificationsOutline } from 'react-icons/io'; // Importuj ikonę powiadomień

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const subscription = notificationService.list().subscribe(setNotifications);
    const unreadCountSubscription = notificationService
      .unreadCount()
      .subscribe(setUnreadCount);
    return () => {
      subscription.unsubscribe();
      unreadCountSubscription.unsubscribe();
    };
  }, []);

  const handleMarkAsRead = (notification: Notification) => {
    notificationService.markAsRead(notification);
  };

  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 bg-blue-500 text-white rounded-full"
      >
        <IoMdNotificationsOutline size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="fixed top-12 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className="mb-2">
                <div
                  className={`p-2 border rounded ${
                    notification.read
                      ? 'bg-gray-200'
                      : 'bg-white dark:bg-gray-700'
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
      )}
    </div>
  );
};

export default NotificationList;
