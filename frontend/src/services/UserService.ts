import { User } from '../interfaces/User';

class UserService {
  private static readonly LOGGED_IN_USER_KEY = 'loggedInUser';
  private static readonly USERS_KEY = 'users';

  static getLoggedInUser(): User | null {
    const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setLoggedInUser(user: User): void {
    localStorage.setItem(this.LOGGED_IN_USER_KEY, JSON.stringify(user));
  }

  static mockLoggedInUser(): void {
    const users = this.getUsers();
    if (users.length > 0) {
      this.setLoggedInUser(users[0]);
    }
  }

  static getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static setUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static mockUsers(): void {
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'Carlo',
        lastName: 'Ancelotti',
        role: 'admin',
      },
      {
        id: '2',
        firstName: 'Jose',
        lastName: 'Mourinho',
        role: 'developer',
      },
      {
        id: '3',
        firstName: 'Pep',
        lastName: 'Guardiola',
        role: 'devops',
      },
    ];
    this.setUsers(mockUsers);
  }
}

export default UserService;
