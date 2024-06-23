import React from 'react';
import { Task } from '../interfaces/Task';
import { Project } from '../interfaces/Project';
import { Story } from '../interfaces/Story';
import { User } from '../interfaces/User';

interface TaskDetailsProps {
  task: Task;
  project: Project;
  story: Story;
  users: User[];
  onAssign: (task: Task, userId: string) => void;
  onComplete: (task: Task) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  project,
  story,
  users,
  onAssign,
  onComplete,
}) => {
  const assignee = users.find((user) => user.id === task.assigneeId);

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">{task.name}</h2>
      <p>
        <strong>Project:</strong> {project.name}
      </p>
      <p>
        <strong>Story:</strong> {story.name}
      </p>
      <p>
        <strong>Description:</strong> {task.description}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Estimated Time:</strong> {task.estimatedTime} hours
      </p>
      {assignee && (
        <p>
          <strong>Assignee:</strong> {assignee.firstName} {assignee.lastName}
        </p>
      )}
      {task.status === 'in progress' && task.startDate && (
        <p>
          <strong>Start Date:</strong>{' '}
          {new Date(task.startDate).toLocaleString()}
        </p>
      )}
      {task.status === 'done' && task.endDate && (
        <p>
          <strong>End Date:</strong> {new Date(task.endDate).toLocaleString()}
        </p>
      )}
      {task.status === 'todo' && (
        <div className="mt-4">
          <label className="block text-sm font-bold mb-2">Assign to:</label>
          <select
            onChange={(e) => onAssign(task, e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>
      )}
      {task.status === 'in progress' && (
        <button
          onClick={() => onComplete(task)}
          className="mt-4 p-2 bg-green-500 text-white rounded"
        >
          Complete Task
        </button>
      )}
    </div>
  );
};

export default TaskDetails;
