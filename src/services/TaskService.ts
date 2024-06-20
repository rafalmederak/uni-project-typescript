import { Task } from '../interfaces/Task';

class TaskService {
  private static readonly STORAGE_KEY = 'tasks';

  static getTasks(): Task[] {
    const tasks = localStorage.getItem(this.STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  static saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  static createTask(task: Task): Task {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
    return task;
  }

  static updateTask(updatedTask: Task): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === updatedTask.id);

    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
      return updatedTask;
    }

    return null;
  }

  static deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== id);

    if (tasks.length !== filteredTasks.length) {
      this.saveTasks(filteredTasks);
      return true;
    }

    return false;
  }
}

export default TaskService;
