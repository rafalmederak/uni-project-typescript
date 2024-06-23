import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  WithFieldValue,
  DocumentReference,
} from 'firebase/firestore';
import { Task } from '../interfaces/Task';
import { taskConverter } from '../converters';

const taskCollectionRef = collection(db, 'tasks').withConverter(taskConverter);

class TaskService {
  static async getTasks(): Promise<Task[]> {
    const querySnapshot = await getDocs(taskCollectionRef);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  static async createTask(
    task: WithFieldValue<Task>
  ): Promise<DocumentReference<Task>> {
    const taskRef = await addDoc(taskCollectionRef, task);
    await updateDoc(taskRef, { id: taskRef.id });
    return taskRef;
  }

  static async updateTask(task: Task): Promise<void> {
    const taskDoc = doc(db, 'tasks', task.id).withConverter(taskConverter);
    await updateDoc(taskDoc, task);
  }

  static async deleteTask(id: string): Promise<void> {
    const taskDoc = doc(db, 'tasks', id).withConverter(taskConverter);
    await deleteDoc(taskDoc);
  }
}

export default TaskService;
