import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { User } from '../interfaces/User';
import { userConverter } from '../converters';
import { auth } from '../firebaseConfig';

const userCollectionRef = collection(db, 'users').withConverter(userConverter);

class UserService {
  static async getUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(userCollectionRef);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  static async getUserById(userId: string): Promise<User | null> {
    const userDoc = doc(db, 'users', userId).withConverter(userConverter);
    const docSnapshot = await getDoc(userDoc);
    return docSnapshot.exists() ? docSnapshot.data() : null;
  }

  static async createUser(user: User): Promise<void> {
    const userDoc = doc(db, 'users', user.id).withConverter(userConverter);
    await setDoc(userDoc, user); // Use setDoc instead of addDoc to specify the document ID
  }

  static async updateUser(user: User): Promise<void> {
    const userDoc = doc(db, 'users', user.id).withConverter(userConverter);
    await updateDoc(userDoc, user);
  }

  static async deleteUser(id: string): Promise<void> {
    const userDoc = doc(db, 'users', id).withConverter(userConverter);
    await deleteDoc(userDoc);
  }

  static async getCurrentUser(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return this.getUserById(currentUser.uid);
    }
    return null;
  }
}

export default UserService;
