import { Story } from '../interfaces/Story';

class StoryService {
  private static readonly STORAGE_KEY = 'stories';

  static getStories(): Story[] {
    const stories = localStorage.getItem(this.STORAGE_KEY);
    return stories ? JSON.parse(stories) : [];
  }

  static saveStories(stories: Story[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }

  static createStory(story: Story): void {
    const stories = this.getStories();
    stories.push(story);
    this.saveStories(stories);
  }

  static updateStory(updatedStory: Story): Story | null {
    const stories = this.getStories();
    const index = stories.findIndex((s) => s.id === updatedStory.id);

    if (index !== -1) {
      stories[index] = updatedStory;
      this.saveStories(stories);
      return updatedStory;
    }

    return null;
  }

  static deleteStory(id: string): boolean {
    const stories = this.getStories();
    const filteredStories = stories.filter((s) => s.id !== id);

    if (stories.length !== filteredStories.length) {
      this.saveStories(filteredStories);
      return true;
    }

    return false;
  }
}

export default StoryService;
