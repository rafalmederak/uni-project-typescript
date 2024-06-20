import React, { useState, useEffect } from 'react';
import { Task } from '../interfaces/Task';
import { Story } from '../interfaces/Story';
import { v4 as uuidv4 } from 'uuid';

interface TaskFormProps {
  task?: Task;
  stories: Story[];
  onSave: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, stories, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [storyId, setStoryId] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setPriority(task.priority);
      setStoryId(task.storyId);
      setEstimatedTime(task.estimatedTime);
    } else {
      setName('');
      setDescription('');
      setPriority('medium');
      setStoryId('');
      setEstimatedTime(0);
    }
  }, [task]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = task ? task.id : uuidv4();
    const creationDate = task ? task.creationDate : new Date().toISOString();
    onSave({
      id,
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      status: 'todo',
      creationDate,
    });
    setName('');
    setDescription('');
    setPriority('medium');
    setStoryId('');
    setEstimatedTime(0);
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
        <label className="block text-sm font-bold mb-2">Story</label>
        <select
          value={storyId}
          onChange={(e) => setStoryId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a story</option>
          {stories.map((story) => (
            <option key={story.id} value={story.id}>
              {story.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">
          Estimated Time (hours)
        </label>
        <input
          type="number"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(parseInt(e.target.value, 10))}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        {task ? 'Update' : 'Create'} Task
      </button>
    </form>
  );
};

export default TaskForm;
