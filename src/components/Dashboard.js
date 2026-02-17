import React, { useState } from 'react';
import TaskBoard from './TaskBoard';
import ActivityLog from './ActivityLog';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';

const Dashboard = () => {
  const [showActivity, setShowActivity] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (showActivity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onShowActivity={() => setShowActivity(false)} onToggleSidebar={toggleSidebar} />
        <div className="flex">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:mt-16 lg:ml-6 lg:rounded-lg lg:shadow-sm
          `}>
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                <button
                  onClick={() => setShowActivity(false)}
                  className="mb-4 text-blue-600 hover:text-blue-800 flex items-center space-x-2 lg:hidden"
                >
                  ← Back to Board
                </button>
                <ActivityLog />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-6 pt-16">
            <div className="max-w-7xl mx-auto p-6">
              <div className="hidden lg:flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
                <button
                  onClick={() => setShowActivity(false)}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
                >
                  ← Back to Board
                </button>
              </div>
              
              {/* Mobile Activity Log */}
              <div className="lg:hidden">
                <ActivityLog />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Header onShowActivity={() => setShowActivity(true)} onToggleSidebar={toggleSidebar} />
        
        <div className="flex">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - Activity Preview */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:mt-16 lg:ml-6 lg:rounded-lg lg:shadow-sm
          `}>
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <button
                    onClick={() => setShowActivity(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                <ActivityLog />
              </div>
            </div>
          </div>

          {/* Main Content - Task Board */}
          <div className="flex-1 lg:ml-6 pt-16">
            <TaskBoard />
          </div>
        </div>

        {/* Mobile Activity Button */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button
            onClick={() => setShowActivity(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="View activity log"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Dashboard;
