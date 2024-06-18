import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import ProjectService from './services/ProjectService';
import { Project } from './interfaces/Project';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined
  );

  useEffect(() => {
    setProjects(ProjectService.getProjects());
  }, []);

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      ProjectService.updateProject(project);
      setEditingProject(undefined);
    } else {
      ProjectService.createProject(project);
    }
    setProjects(ProjectService.getProjects());
  };

  const handleDeleteProject = (id: string) => {
    ProjectService.deleteProject(id);
    setProjects(ProjectService.getProjects());
    setEditingProject(undefined);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Management</h1>
      <ProjectForm project={editingProject} onSave={handleSaveProject} />
      <ProjectList
        projects={projects}
        onDelete={handleDeleteProject}
        onEdit={handleEditProject}
      />
    </div>
  );
};

export default App;
