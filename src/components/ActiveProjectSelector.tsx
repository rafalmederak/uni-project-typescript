import React from 'react';
import { Project } from '../interfaces/Project';

interface ActiveProjectSelectorProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelect: (projectId: string) => void;
}

const ActiveProjectSelector: React.FC<ActiveProjectSelectorProps> = ({
  projects,
  activeProjectId,
  onSelect,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">
        Select Active Project
      </label>
      <select
        value={activeProjectId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ActiveProjectSelector;
