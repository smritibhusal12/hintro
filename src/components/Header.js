import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = ({ onShowActivity }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onShowActivity}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Activity Log
            </button>
            
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-600" />
              <span className="text-sm text-gray-700">{user?.email}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
