import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import StoryForm from './components/StoryForm';
import StoryList from './components/StoryList';
import ActiveProjectSelector from './components/ActiveProjectSelector';
import ProjectService from './services/ProjectService';
import StoryService from './services/StoryService';
import ActiveProjectService from './services/ActiveProjectService';
import UserService from './services/UserService';
import { Project } from './interfaces/Project';
import { Story } from './interfaces/Story';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined
  );
  const [editingStory, setEditingStory] = useState<Story | undefined>(
    undefined
  );
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    UserService.mockLoggedInUser();
    setProjects(ProjectService.getProjects());
    const savedActiveProjectId = ActiveProjectService.getActiveProject();
    setActiveProjectId(savedActiveProjectId);
    if (savedActiveProjectId) {
      setStories(
        StoryService.getStories().filter(
          (story) => story.projectId === savedActiveProjectId
        )
      );
    }
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
    if (activeProjectId === id) {
      ActiveProjectService.clearActiveProject();
      setActiveProjectId(null);
      setStories([]);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleSetActiveProject = (projectId: string) => {
    ActiveProjectService.setActiveProject(projectId);
    setActiveProjectId(projectId);
    setEditingProject(undefined);
    setEditingStory(undefined);
    if (projectId) {
      setStories(
        StoryService.getStories().filter(
          (story) => story.projectId === projectId
        )
      );
    } else {
      setStories([]);
    }
  };

  const handleSaveStory = (story: Story) => {
    if (editingStory) {
      StoryService.updateStory(story);
      setEditingStory(undefined);
    } else {
      StoryService.createStory(story);
    }
    setStories(
      StoryService.getStories().filter((s) => s.projectId === story.projectId)
    );
  };

  const handleDeleteStory = (id: string) => {
    StoryService.deleteStory(id);
    setStories(stories.filter((story) => story.id !== id));
    setEditingStory(undefined);
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
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
      <ActiveProjectSelector
        projects={projects}
        activeProjectId={activeProjectId}
        onSelect={handleSetActiveProject}
      />
      {activeProjectId && (
        <>
          <h2 className="text-xl font-bold mt-4">Active Project Stories</h2>
          <StoryForm story={editingStory} onSave={handleSaveStory} />
          <StoryList
            stories={stories}
            onDelete={handleDeleteStory}
            onEdit={handleEditStory}
          />
        </>
      )}
    </div>
  );
};

export default App;
