import React from 'react';
import { User } from '../interfaces/User';

interface NavBarProps {
  loggedInUser: User | null;
}

const NavBar: React.FC<NavBarProps> = ({ loggedInUser }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl">Project Management</h1>
        {loggedInUser && (
          <div className="text-white">
            Logged in as: {loggedInUser.firstName} {loggedInUser.lastName}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
