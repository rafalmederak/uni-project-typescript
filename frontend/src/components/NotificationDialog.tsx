import React, { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import notificationService, {
  Notification,
} from '../services/NotificationService';

const NotificationDialog: React.FC = () => {
  const [dialogNotifications, setDialogNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    const subscription: Subscription = notificationService
      .list()
      .subscribe((notifications) => {
        const filteredNotifications = notifications.filter(
          (notification) =>
            notification.priority === 'medium' ||
            notification.priority === 'high'
        );
        setDialogNotifications(filteredNotifications);
      });

    return () => subscription.unsubscribe();
  }, []);

  const handleClose = (notification: Notification) => {
    notificationService.markAsRead(notification);
    setDialogNotifications((prev) => prev.filter((n) => n !== notification));
  };

  return (
    <>
      {dialogNotifications.map((notification, index) => (
        <div
          key={index}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
        >
          <div className="bg-white p-4 border rounded shadow-md">
            <h3 className="text-lg font-bold">{notification.title}</h3>
            <p>{notification.message}</p>
            <button
              onClick={() => handleClose(notification)}
              className="mt-4 p-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationDialog;
