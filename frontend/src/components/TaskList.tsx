import React from 'react';
import { Task } from '../interfaces/Task';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onAssign: (task: Task) => void;
  onComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onEdit,
  onAssign,
  onComplete,
}) => {
  const renderTask = (task: Task) => (
    <div key={task.id} className="p-4 mb-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">{task.name}</h2>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      {task.status === 'todo' && (
        <button
          onClick={() => onAssign(task)}
          className="mr-2 mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Assign
        </button>
      )}
      {task.status === 'in progress' && (
        <button
          onClick={() => onComplete(task)}
          className="mr-2 mt-2 p-2 bg-green-500 text-white rounded"
        >
          Complete
        </button>
      )}
      <button
        onClick={() => onEdit(task)}
        className="mr-2 mt-2 p-2 bg-yellow-500 text-white rounded"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="mt-2 p-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );

  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'in progress');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">To Do</h2>
      {todoTasks.map(renderTask)}

      <h2 className="text-2xl font-bold mb-4">In Progress</h2>
      {inProgressTasks.map(renderTask)}

      <h2 className="text-2xl font-bold mb-4">Done</h2>
      {doneTasks.map(renderTask)}
    </div>
  );
};

export default TaskList;
