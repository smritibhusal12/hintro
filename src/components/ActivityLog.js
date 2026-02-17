import React, { useState, useMemo } from 'react';
import { useTask } from '../context/TaskContext';
import { Clock, Edit, Move, Trash2, Plus, Filter, Search, RotateCcw } from 'lucide-react';

const ActivityLog = () => {
  const { activities } = useTask();
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.taskTitle?.toLowerCase().includes(query) ||
        activity.details?.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'latest') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }

    return filtered;
  }, [activities, filterType, searchQuery, sortBy]);

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

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'created': return 'Created';
      case 'edited': return 'Edited';
      case 'moved': return 'Moved';
      case 'deleted': return 'Deleted';
      default: return 'All';
    }
  };

  const clearFilters = () => {
    setFilterType('all');
    setSearchQuery('');
    setSortBy('latest');
  };

  const hasActiveFilters = filterType !== 'all' || searchQuery.trim() || sortBy !== 'latest';

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No activities yet</p>
          <p className="text-gray-400 text-sm">Start creating, editing, or moving tasks to see activity here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>{filteredAndSortedActivities.length} of {activities.length} activities</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">All Types</option>
              <option value="created">Created</option>
              <option value="edited">Edited</option>
              <option value="moved">Moved</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <RotateCcw size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <RotateCcw size={14} />
              <span>Clear filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Activities List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAndSortedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Filter size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No activities match your filters</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredAndSortedActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">
                  {getActivityText(activity)}
                </p>
                {activity.details && (
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.details}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {formatTime(activity.timestamp)}
                  </p>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {getActivityTypeLabel(activity.type)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Activity Summary */}
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex space-x-4">
              <span>Total: {activities.length}</span>
              <span>Created: {activities.filter(a => a.type === 'created').length}</span>
              <span>Edited: {activities.filter(a => a.type === 'edited').length}</span>
              <span>Moved: {activities.filter(a => a.type === 'moved').length}</span>
              <span>Deleted: {activities.filter(a => a.type === 'deleted').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
