import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Activity } from 'lucide-react';

const Header = ({ onShowActivity, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleActivityClick = () => {
    onShowActivity();
    setMobileMenuOpen(false);
  };

  const handleSidebarToggle = () => {
    onToggleSidebar();
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Toggle for Desktop */}
            <button
              onClick={handleSidebarToggle}
              className="hidden lg:block p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Task Board</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleActivityClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Activity size={16} />
              <span>Activity Log</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-600" />
              <span className="text-sm text-gray-700 truncate max-w-xs">{user?.email}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <button
                onClick={handleSidebarToggle}
                className="w-full flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left"
              >
                <Activity size={16} />
                <span>Toggle Sidebar</span>
              </button>
              
              <button
                onClick={handleActivityClick}
                className="w-full flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left"
              >
                <Activity size={16} />
                <span>Activity Log</span>
              </button>
              
              <div className="flex items-center space-x-2 px-3 py-2">
                <User size={20} className="text-gray-600" />
                <span className="text-sm text-gray-700 truncate">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
