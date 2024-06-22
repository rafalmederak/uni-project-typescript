import { Project } from '../interfaces/Project';

class ProjectService {
  private static readonly STORAGE_KEY = 'projects';

  static getProjects(): Project[] {
    const projects = localStorage.getItem(this.STORAGE_KEY);
    return projects ? JSON.parse(projects) : [];
  }

  static saveProjects(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }

  static createProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  static updateProject(updatedProject: Project): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === updatedProject.id);

    if (index !== -1) {
      projects[index] = updatedProject;
      this.saveProjects(projects);
      return updatedProject;
    }

    return null;
  }

  static deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filteredProjects = projects.filter((p) => p.id !== id);

    if (projects.length !== filteredProjects.length) {
      this.saveProjects(filteredProjects);
      return true;
    }

    return false;
  }
}

export default ProjectService;
