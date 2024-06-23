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
import { Project } from '../interfaces/Project';
import { projectConverter } from '../converters';

const projectCollectionRef = collection(db, 'projects').withConverter(
  projectConverter
);

class ProjectService {
  static async getProjects(): Promise<Project[]> {
    const querySnapshot = await getDocs(projectCollectionRef);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  static async createProject(
    project: WithFieldValue<Project>
  ): Promise<DocumentReference<Project>> {
    const projectRef = await addDoc(projectCollectionRef, project);
    await updateDoc(projectRef, { id: projectRef.id });
    return projectRef;
  }

  static async updateProject(project: Project): Promise<void> {
    const projectDoc = doc(db, 'projects', project.id).withConverter(
      projectConverter
    );
    await updateDoc(projectDoc, project);
  }

  static async deleteProject(id: string): Promise<void> {
    const projectDoc = doc(db, 'projects', id).withConverter(projectConverter);
    await deleteDoc(projectDoc);
  }
}

export default ProjectService;
