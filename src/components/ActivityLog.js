import React from 'react';
import { useTask } from '../context/TaskContext';
import { Clock, Edit, Move, Trash2, Plus } from 'lucide-react';

const ActivityLog = () => {
  const { activities } = useTask();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'created':
        return <Plus size={16} className="text-green-600" />;
      case 'edited':
        return <Edit size={16} className="text-blue-600" />;
      case 'moved':
        return <Move size={16} className="text-purple-600" />;
      case 'deleted':
        return <Trash2 size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getActivityText = (activity) => {
    const { type, taskTitle, details } = activity;
    
    switch (type) {
      case 'created':
        return `Created task "${taskTitle}"`;
      case 'edited':
        return `Edited task "${taskTitle}"`;
      case 'moved':
        return `Moved task "${taskTitle}" ${details || ''}`;
      case 'deleted':
        return `Deleted task "${taskTitle}"`;
      default:
        return `Action on "${taskTitle}"`;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
        <p className="text-gray-500 text-center py-8">No activities yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
