import React from 'react';
import { Project } from '../interfaces/Project';

interface ProjectListProps {
  projects: Project[];
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onDelete,
  onEdit,
}) => {
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id} className="p-4 mb-4 border rounded shadow-md">
          <h2 className="text-xl font-bold">{project.name}</h2>
          <p>{project.description}</p>
          <button
            onClick={() => onEdit(project)}
            className="mr-2 mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="mt-2 p-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
