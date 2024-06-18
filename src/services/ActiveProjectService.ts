class ActiveProjectService {
  private static readonly ACTIVE_PROJECT_KEY = 'activeProject';

  static getActiveProject(): string | null {
    return localStorage.getItem(this.ACTIVE_PROJECT_KEY);
  }

  static setActiveProject(projectId: string): void {
    localStorage.setItem(this.ACTIVE_PROJECT_KEY, projectId);
  }

  static clearActiveProject(): void {
    localStorage.removeItem(this.ACTIVE_PROJECT_KEY);
  }
}

export default ActiveProjectService;
