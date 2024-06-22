export interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  creationDate: string;
  status: 'todo' | 'in progress' | 'done';
  ownerId: string;
}
