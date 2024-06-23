import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import StoryForm from './components/StoryForm';
import StoryList from './components/StoryList';
import ActiveProjectSelector from './components/ActiveProjectSelector';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProjectService from './services/ProjectService';
import StoryService from './services/StoryService';
import TaskService from './services/TaskService';
import ActiveProjectService from './services/ActiveProjectService';
import UserService from './services/UserService';
import AuthService from './services/AuthService';
import NotificationService from './services/NotificationService';
import NotificationList from './components/NotificationList';
import { Project } from './interfaces/Project';
import { Story } from './interfaces/Story';
import { Task } from './interfaces/Task';
import { User } from './interfaces/User';
import { auth } from './firebaseConfig';
import './index.css';

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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refreshToken')
  );
  const [showRegister, setShowRegister] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      const fetchedUser = await UserService.getUserById(userId);
      if (fetchedUser) {
        setLoggedInUser(fetchedUser);
      }
    };

    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        fetchUserData(firebaseUser.uid);
        firebaseUser.getIdToken().then(setToken);
        setRefreshToken(firebaseUser.refreshToken);
      }
    });
  }, []);

  useEffect(() => {
    if (token) {
      ProjectService.getProjects().then(setProjects);
      UserService.getUsers().then(setUsers);
      const savedActiveProjectId = ActiveProjectService.getActiveProject();
      setActiveProjectId(savedActiveProjectId);
      if (savedActiveProjectId) {
        StoryService.getStories().then((filteredStories) => {
          setStories(
            filteredStories.filter(
              (story) => story.projectId === savedActiveProjectId
            )
          );
          TaskService.getTasks().then((tasks) =>
            setTasks(
              tasks.filter((task) =>
                filteredStories.some((story) => story.id === task.storyId)
              )
            )
          );
        });
      }
    }
  }, [token]);

  useEffect(() => {
    if (activeProjectId) {
      StoryService.getStories().then((filteredStories) => {
        setStories(
          filteredStories.filter((story) => story.projectId === activeProjectId)
        );
        TaskService.getTasks().then((tasks) =>
          setTasks(
            tasks.filter((task) =>
              filteredStories.some((story) => story.id === task.storyId)
            )
          )
        );
      });
    }
  }, [activeProjectId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (refreshToken) {
        try {
          const newToken = await AuthService.refreshToken();
          setToken(newToken);
        } catch (err) {
          console.error('Failed to refresh token:', err);
          handleLogout();
        }
      }
    }, 15 * 60 * 1000); // odswieza token co 15 min

    return () => clearInterval(interval);
  }, [refreshToken]);

  const handleSaveProject = async (project: Project) => {
    if (editingProject) {
      await ProjectService.updateProject(project);
      setEditingProject(undefined);
    } else {
      const projectRef = await ProjectService.createProject(project);
      project.id = projectRef.id;
    }
    const updatedProjects = await ProjectService.getProjects();
    setProjects(updatedProjects);
  };

  const handleDeleteProject = async (id: string) => {
    await ProjectService.deleteProject(id);
    const updatedProjects = await ProjectService.getProjects();
    setProjects(updatedProjects);
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

  const handleSaveStory = async (story: Story) => {
    if (editingStory) {
      await StoryService.updateStory(story);
      setEditingStory(undefined);
    } else {
      const storyRef = await StoryService.createStory(story);
      story.id = storyRef.id;
    }
    const updatedStories = await StoryService.getStories();
    setStories(updatedStories.filter((s) => s.projectId === story.projectId));
  };

  const handleDeleteStory = async (id: string) => {
    await StoryService.deleteStory(id);
    setStories(stories.filter((story) => story.id !== id));
    setEditingStory(undefined);
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
  };

  const handleSaveTask = async (task: Task) => {
    if (editingTask) {
      await TaskService.updateTask(task);
      setEditingTask(undefined);
    } else {
      const taskRef = await TaskService.createTask(task);
      task.id = taskRef.id;
    }
    const updatedTasks = await TaskService.getTasks();
    setTasks(
      updatedTasks.filter((t) => stories.some((s) => s.id === t.storyId))
    );
  };

  const handleDeleteTask = async (id: string) => {
    await TaskService.deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const handleAssignTask = async (task: Task, userId: string) => {
    if (!task.id) {
      console.error('Task must have an ID before it can be updated');
      return;
    }
    const updatedTask: Task = {
      ...task,
      assigneeId: userId,
      status: 'in progress',
      startDate: new Date().toISOString(),
    };
    await TaskService.updateTask(updatedTask);
    const updatedTasks = await TaskService.getTasks();
    setTasks(
      updatedTasks.filter((t) => stories.some((s) => s.id === t.storyId))
    );
    setViewingTask(undefined);

    // Emit a notification
    if (userId === loggedInUser?.id) {
      NotificationService.send({
        id: '',
        title: 'Task Assigned',
        message: `You have been assigned a new task: ${task.name}`,
        date: new Date().toISOString(),
        priority: 'medium',
        read: false,
      });
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (!task.id) {
      console.error('Task must have an ID before it can be updated');
      return;
    }
    const updatedTask: Task = {
      ...task,
      status: 'done',
      endDate: new Date().toISOString(),
    };
    await TaskService.updateTask(updatedTask);
    const updatedTasks = await TaskService.getTasks();
    setTasks(
      updatedTasks.filter((t) => stories.some((s) => s.id === t.storyId))
    );
    setViewingTask(undefined);
  };

  const handleLogin = async (token: string, refreshToken: string) => {
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    const user = auth.currentUser;
    if (user) {
      const fetchedUser = await UserService.getUserById(user.uid);
      if (fetchedUser) {
        setLoggedInUser(fetchedUser);
      }
    }
  };

  const handleRegister = async (token: string, refreshToken: string) => {
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    const user = auth.currentUser;
    if (user) {
      const fetchedUser = await UserService.getUserById(user.uid);
      if (fetchedUser) {
        setLoggedInUser(fetchedUser);
      }
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRefreshToken(null);
    setLoggedInUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const renderTaskCard = (task: Task) => (
    <div
      key={task.id}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4"
    >
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
      {!token ? (
        showRegister ? (
          <div>
            <RegisterForm onRegister={handleRegister} />
            <p className="mt-4">
              Already have an account?{' '}
              <button
                onClick={() => setShowRegister(false)}
                className="text-blue-500"
              >
                Login
              </button>
            </p>
          </div>
        ) : (
          <div>
            <LoginForm onLogin={handleLogin} />
            <p className="mt-4">
              Don't have an account?{' '}
              <button
                onClick={() => setShowRegister(true)}
                className="text-blue-500"
              >
                Register
              </button>
            </p>
          </div>
        )
      ) : (
        <>
          <NavBar loggedInUser={loggedInUser} />
          <NotificationList />
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Project Management</h1>
            <button
              onClick={handleLogout}
              className="mb-4 p-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
            <div className="mb-4">
              <ProjectForm
                project={editingProject}
                onSave={handleSaveProject}
              />
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
                  <h2 className="text-xl font-bold mt-4">
                    Active Project Stories
                  </h2>
                  <StoryForm story={editingStory} onSave={handleSaveStory} />
                  <StoryList
                    stories={stories}
                    onDelete={handleDeleteStory}
                    onEdit={handleEditStory}
                  />
                </div>
                <div className="mb-4">
                  <h2 className="text-xl font-bold mt-4">
                    Active Project Tasks
                  </h2>
                  <TaskForm
                    task={editingTask}
                    stories={stories}
                    onSave={handleSaveTask}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="column bg-gray-100 dark:bg-gray-700 p-4 rounded">
                    <h2 className="text-xl font-bold mb-4">To Do</h2>
                    {tasks
                      .filter((task) => task.status === 'todo')
                      .map(renderTaskCard)}
                  </div>
                  <div className="column bg-gray-100 dark:bg-gray-700 p-4 rounded">
                    <h2 className="text-xl font-bold mb-4">In Progress</h2>
                    {tasks
                      .filter((task) => task.status === 'in progress')
                      .map(renderTaskCard)}
                  </div>
                  <div className="column bg-gray-100 dark:bg-gray-700 p-4 rounded">
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
        </>
      )}
    </div>
  );
};

export default App;
