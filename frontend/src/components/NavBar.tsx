import React from 'react';
import { User } from '../interfaces/User';
import ThemeToggle from './ThemeToggle';

interface NavBarProps {
  loggedInUser: User | null;
}

const NavBar: React.FC<NavBarProps> = ({ loggedInUser }) => {
  return (
    <nav className="bg-gray-800 dark:bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl">Project Management</h1>
        <div className="flex items-center">
          <ThemeToggle />
          {loggedInUser && (
            <div className="text-white ml-4">
              Logged in as: {loggedInUser.firstName} {loggedInUser.lastName}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
