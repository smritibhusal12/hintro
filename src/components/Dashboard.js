import React, { useState } from 'react';
import TaskBoard from './TaskBoard';
import ActivityLog from './ActivityLog';
import Header from './Header';

const Dashboard = () => {
  const [showActivity, setShowActivity] = useState(false);

  if (showActivity) {
    return (
      <div>
        <Header onShowActivity={() => setShowActivity(false)} />
        <div className="max-w-7xl mx-auto p-6">
          <button
            onClick={() => setShowActivity(false)}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            ← Back to Board
          </button>
          <ActivityLog />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header onShowActivity={() => setShowActivity(true)} />
      <TaskBoard />
    </div>
  );
};

export default Dashboard;
