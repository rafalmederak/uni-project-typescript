import React from 'react';
import { User } from '../interfaces/User';

interface NavBarProps {
  loggedInUser: User | null;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ loggedInUser, onLogout }) => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-lg font-bold">Project Management</div>
          {loggedInUser && (
            <div className="flex items-center">
              <div className="text-white mr-8">
                {loggedInUser.firstName} {loggedInUser.lastName}
              </div>
              <button
                onClick={onLogout}
                className="p-2 bg-white text-black rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
