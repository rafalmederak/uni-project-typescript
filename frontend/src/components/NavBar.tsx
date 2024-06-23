import React from 'react';
import { User } from '../interfaces/User';

interface NavBarProps {
  loggedInUser: User | null;
}

const NavBar: React.FC<NavBarProps> = ({ loggedInUser }) => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-lg font-bold">Project Management</div>
          {loggedInUser && (
            <div className="text-white">
              {loggedInUser.firstName} {loggedInUser.lastName}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
