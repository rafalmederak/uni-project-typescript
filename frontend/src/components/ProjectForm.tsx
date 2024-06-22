import React, { useState, useEffect } from 'react';
import { Project } from '../interfaces/Project';
import { v4 as uuidv4 } from 'uuid';

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [project]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = project ? project.id : uuidv4();
    onSave({ id, name, description });
    setName('');
    setDescription('');
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
      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        {project ? 'Update' : 'Create'} Project
      </button>
    </form>
  );
};

export default ProjectForm;
