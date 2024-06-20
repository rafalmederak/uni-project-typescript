import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import StoryForm from './components/StoryForm';
import StoryList from './components/StoryList';
import ActiveProjectSelector from './components/ActiveProjectSelector';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import NavBar from './components/NavBar';
import ProjectService from './services/ProjectService';
import StoryService from './services/StoryService';
import TaskService from './services/TaskService';
import ActiveProjectService from './services/ActiveProjectService';
import UserService from './services/UserService';
import { Project } from './interfaces/Project';
import { Story } from './interfaces/Story';
import { Task } from './interfaces/Task';
import { User } from './interfaces/User';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined
  );
  const [editingStory, setEditingStory] = useState<Story | undefined>(
    undefined
  );
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [viewingTask, setViewingTask] = useState<Task | undefined>(undefined);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    UserService.mockUsers();
    UserService.mockLoggedInUser();
    setLoggedInUser(UserService.getLoggedInUser());
    setProjects(ProjectService.getProjects());
    setUsers(UserService.getUsers());
    const savedActiveProjectId = ActiveProjectService.getActiveProject();
    setActiveProjectId(savedActiveProjectId);
    if (savedActiveProjectId) {
      const filteredStories = StoryService.getStories().filter(
        (story) => story.projectId === savedActiveProjectId
      );
      setStories(filteredStories);
      setTasks(
        TaskService.getTasks().filter((task) =>
          filteredStories.some((story) => story.id === task.storyId)
        )
      );
    }
  }, []);

  useEffect(() => {
    if (activeProjectId) {
      const filteredStories = StoryService.getStories().filter(
        (story) => story.projectId === activeProjectId
      );
      setStories(filteredStories);
      setTasks(
        TaskService.getTasks().filter((task) =>
          filteredStories.some((story) => story.id === task.storyId)
        )
      );
    }
  }, [activeProjectId]);

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
      setTasks([]);
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
    setEditingTask(undefined);
    setViewingTask(undefined);
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

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      TaskService.updateTask(task);
      setEditingTask(undefined);
    } else {
      TaskService.createTask(task);
    }
    setTasks(
      TaskService.getTasks().filter((t) =>
        stories.some((s) => s.id === t.storyId)
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    TaskService.deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const handleAssignTask = (task: Task, userId: string) => {
    const updatedTask: Task = {
      ...task,
      assigneeId: userId,
      status: 'in progress',
      startDate: new Date().toISOString(),
    };
    TaskService.updateTask(updatedTask);
    setTasks(
      TaskService.getTasks().filter((t) =>
        stories.some((s) => s.id === t.storyId)
      )
    );
    setViewingTask(undefined);
  };

  const handleCompleteTask = (task: Task) => {
    const updatedTask: Task = {
      ...task,
      status: 'done',
      endDate: new Date().toISOString(),
    };
    TaskService.updateTask(updatedTask);
    setTasks(
      TaskService.getTasks().filter((t) =>
        stories.some((s) => s.id === t.storyId)
      )
    );
    setViewingTask(undefined);
  };

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold">{task.name}</h3>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      {task.status === 'todo' && (
        <button
          onClick={() => handleViewTask(task)}
          className="mr-2 mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Assign
        </button>
      )}
      {task.status === 'in progress' && (
        <button
          onClick={() => handleCompleteTask(task)}
          className="mr-2 mt-2 p-2 bg-green-500 text-white rounded"
        >
          Complete
        </button>
      )}
      <button
        onClick={() => handleEditTask(task)}
        className="mr-2 mt-2 p-2 bg-yellow-500 text-white rounded"
      >
        Edit
      </button>
      <button
        onClick={() => handleDeleteTask(task.id)}
        className="mt-2 p-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <NavBar loggedInUser={loggedInUser} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Project Management</h1>
        <div className="mb-4">
          <ProjectForm project={editingProject} onSave={handleSaveProject} />
          <ProjectList
            projects={projects}
            onDelete={handleDeleteProject}
            onEdit={handleEditProject}
          />
        </div>
        <div className="mb-4">
          <ActiveProjectSelector
            projects={projects}
            activeProjectId={activeProjectId}
            onSelect={handleSetActiveProject}
          />
        </div>
        {activeProjectId && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold mt-4">Active Project Stories</h2>
              <StoryForm story={editingStory} onSave={handleSaveStory} />
              <StoryList
                stories={stories}
                onDelete={handleDeleteStory}
                onEdit={handleEditStory}
              />
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mt-4">Active Project Tasks</h2>
              <TaskForm
                task={editingTask}
                stories={stories}
                onSave={handleSaveTask}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="column bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-bold mb-4">To Do</h2>
                {tasks
                  .filter((task) => task.status === 'todo')
                  .map(renderTaskCard)}
              </div>
              <div className="column bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-bold mb-4">In Progress</h2>
                {tasks
                  .filter((task) => task.status === 'in progress')
                  .map(renderTaskCard)}
              </div>
              <div className="column bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-bold mb-4">Done</h2>
                {tasks
                  .filter((task) => task.status === 'done')
                  .map(renderTaskCard)}
              </div>
            </div>
            {viewingTask && (
              <TaskDetails
                task={viewingTask}
                project={projects.find((p) => p.id === activeProjectId)!}
                story={stories.find((s) => s.id === viewingTask.storyId)!}
                users={users}
                onAssign={handleAssignTask}
                onComplete={handleCompleteTask}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
