import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { Notification } from '../interfaces/Notification';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

const notificationCollectionRef = collection(db, 'notifications');
const archivedNotificationCollectionRef = collection(
  db,
  'archived_notifications'
);

class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadNotifications();
  }

  private async loadNotifications() {
    const querySnapshot = await getDocs(
      query(notificationCollectionRef, where('read', '==', false))
    );
    const notifications = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Notification)
    );
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
  }

  private async updateUnreadCount() {
    const querySnapshot = await getDocs(
      query(notificationCollectionRef, where('read', '==', false))
    );
    this.unreadCountSubject.next(querySnapshot.size);
  }

  async send(notification: Notification) {
    const id = uuidv4(); // Generowanie unikalnego identyfikatora
    const notificationDoc = doc(notificationCollectionRef, id);
    await setDoc(notificationDoc, { ...notification, id });
    this.loadNotifications();
  }

  list() {
    return this.notificationsSubject.asObservable();
  }

  unreadCount() {
    return this.unreadCountSubject.asObservable();
  }

  async markAsRead(notification: Notification) {
    const notificationDoc = doc(notificationCollectionRef, notification.id);
    await updateDoc(notificationDoc, { read: true });
    const archivedNotificationDoc = doc(
      archivedNotificationCollectionRef,
      notification.id
    );
    await setDoc(archivedNotificationDoc, notification);
    await deleteDoc(notificationDoc);
    this.loadNotifications();
  }
}

export default new NotificationService();
