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
import { Story } from '../interfaces/Story';
import { storyConverter } from '../converters';

const storyCollectionRef = collection(db, 'stories').withConverter(
  storyConverter
);

class StoryService {
  static async getStories(): Promise<Story[]> {
    const querySnapshot = await getDocs(storyCollectionRef);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  static async createStory(
    story: WithFieldValue<Story>
  ): Promise<DocumentReference<Story>> {
    const storyRef = await addDoc(storyCollectionRef, story);
    await updateDoc(storyRef, { id: storyRef.id });
    return storyRef;
  }

  static async updateStory(story: Story): Promise<void> {
    const storyDoc = doc(db, 'stories', story.id).withConverter(storyConverter);
    await updateDoc(storyDoc, story);
  }

  static async deleteStory(id: string): Promise<void> {
    const storyDoc = doc(db, 'stories', id).withConverter(storyConverter);
    await deleteDoc(storyDoc);
  }
}

export default StoryService;
