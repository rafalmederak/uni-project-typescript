import React from 'react';
import { Story } from '../interfaces/Story';

interface StoryListProps {
  stories: Story[];
  onDelete: (id: string) => void;
  onEdit: (story: Story) => void;
}

const StoryList: React.FC<StoryListProps> = ({ stories, onDelete, onEdit }) => {
  const renderStory = (story: Story) => (
    <div key={story.id} className="p-4 mb-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">{story.name}</h2>
      <p>{story.description}</p>
      <p>Priority: {story.priority}</p>
      <p>Status: {story.status}</p>
      <button
        onClick={() => onEdit(story)}
        className="mr-2 mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(story.id)}
        className="mt-2 p-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );

  const todoStories = stories.filter((story) => story.status === 'todo');
  const inProgressStories = stories.filter(
    (story) => story.status === 'in progress'
  );
  const doneStories = stories.filter((story) => story.status === 'done');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">To Do</h2>
      {todoStories.map(renderStory)}

      <h2 className="text-2xl font-bold mb-4">In Progress</h2>
      {inProgressStories.map(renderStory)}

      <h2 className="text-2xl font-bold mb-4">Done</h2>
      {doneStories.map(renderStory)}
    </div>
  );
};

export default StoryList;
