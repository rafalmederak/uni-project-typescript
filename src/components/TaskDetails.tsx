import React, { useState } from 'react';
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
  const [assigneeId, setAssigneeId] = useState<string>(task.assigneeId || '');

  const handleAssign = () => {
    onAssign(task, assigneeId);
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">{task.name}</h2>
      <p>{task.description}</p>
      <p>Project: {project.name}</p>
      <p>Story: {story.name}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      <p>Estimated Time: {task.estimatedTime} hours</p>
      <p>Creation Date: {task.creationDate}</p>
      {task.startDate && <p>Start Date: {task.startDate}</p>}
      {task.endDate && <p>End Date: {task.endDate}</p>}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Assignee</label>
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a user</option>
          {users
            .filter(
              (user) => user.role === 'devops' || user.role === 'developer'
            )
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.role})
              </option>
            ))}
        </select>
      </div>
      <button
        onClick={handleAssign}
        className="mr-2 mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Assign
      </button>
      <button
        onClick={() => onComplete(task)}
        className="mt-2 p-2 bg-green-500 text-white rounded"
      >
        Complete
      </button>
    </div>
  );
};

export default TaskDetails;
