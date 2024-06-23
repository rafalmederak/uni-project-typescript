import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

type ISOString = string;

type Notification = {
  title: string;
  message: string;
  date: ISOString;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
};

class NotificationService {
  private notificationsSubject: BehaviorSubject<Notification[]> =
    new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  send(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    this.updateUnreadCount();
  }

  list(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(
      (notification) => !notification.read
    ).length;
    this.unreadCountSubject.next(unreadCount);
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    this.updateUnreadCount();
  }
}

const notificationService = new NotificationService();
export default notificationService;
export type { Notification };
