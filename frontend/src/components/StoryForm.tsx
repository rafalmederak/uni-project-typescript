import React, { useState, useEffect } from 'react';
import { Story } from '../interfaces/Story';
import { v4 as uuidv4 } from 'uuid';
import UserService from '../services/UserService';
import ActiveProjectService from '../services/ActiveProjectService';

interface StoryFormProps {
  story?: Story;
  onSave: (story: Story) => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ story, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'todo' | 'in progress' | 'done'>('todo');
  const [ownerId, setOwnerId] = useState<string>('unknown');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await UserService.getCurrentUser();
      if (currentUser) {
        setOwnerId(currentUser.id);
      }
    };
    fetchCurrentUser();

    if (story) {
      setName(story.name);
      setDescription(story.description);
      setPriority(story.priority);
      setStatus(story.status);
    } else {
      setName('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
    }
  }, [story]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = story ? story.id : uuidv4();
    const creationDate = story ? story.creationDate : new Date().toISOString();
    const projectId = ActiveProjectService.getActiveProject() || 'unknown';
    onSave({
      id,
      name,
      description,
      priority,
      creationDate,
      status,
      ownerId,
      projectId,
    });
    setName('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Priority</label>
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as 'low' | 'medium' | 'high')
          }
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Status</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as 'todo' | 'in progress' | 'done')
          }
          className="w-full p-2 border rounded"
        >
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        {story ? 'Update' : 'Create'} Story
      </button>
    </form>
  );
};

export default StoryForm;
