import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Project } from './interfaces/Project';
import { Story } from './interfaces/Story';
import { Task } from './interfaces/Task';
import { User } from './interfaces/User';

export const projectConverter: FirestoreDataConverter<Project> = {
  toFirestore(project: Project): Project {
    return { ...project };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Project {
    const data = snapshot.data()!;
    return { id: snapshot.id, ...data } as Project;
  },
};

export const storyConverter: FirestoreDataConverter<Story> = {
  toFirestore(story: Story): Story {
    return { ...story };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Story {
    const data = snapshot.data()!;
    return { id: snapshot.id, ...data } as Story;
  },
};

export const taskConverter: FirestoreDataConverter<Task> = {
  toFirestore(task: Task): Task {
    return { ...task };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Task {
    const data = snapshot.data()!;
    return { id: snapshot.id, ...data } as Task;
  },
};

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): User {
    return { ...user };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    const data = snapshot.data()!;
    return { id: snapshot.id, ...data } as User;
  },
};
