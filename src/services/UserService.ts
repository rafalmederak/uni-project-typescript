interface User {
  id: string;
  firstName: string;
  lastName: string;
}

class UserService {
  private static readonly LOGGED_IN_USER_KEY = 'loggedInUser';

  static getLoggedInUser(): User | null {
    const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setLoggedInUser(user: User): void {
    localStorage.setItem(this.LOGGED_IN_USER_KEY, JSON.stringify(user));
  }

  static mockLoggedInUser(): void {
    const mockUser: User = {
      id: '1',
      firstName: 'Carlo',
      lastName: 'Ancelotti',
    };
    this.setLoggedInUser(mockUser);
  }
}

export default UserService;
