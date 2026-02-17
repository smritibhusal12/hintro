import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTask } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Plus, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';

const TaskBoard = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    moveTask, 
    resetBoard,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    isLoading,
    error,
    clearError,
    retryLoad
  } = useTask();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(undefined);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const columns = [
    { id: 'todo', title: 'Todo', color: 'bg-gray-100' },
    { id: 'doing', title: 'Doing', color: 'bg-blue-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' }
  ];

  const getFilteredAndSortedTasks = (columnTasks) => {
    let filtered = columnTasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Sort
    if (sortBy === 'dueDate') {
      filtered = filtered.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    return filtered;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const success = moveTask(active.id, over.id);
      
      if (!success) {
        console.error('Failed to move task');
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = (taskData) => {
    let result;
    if (editingTask) {
      result = updateTask(editingTask.id, taskData);
    } else {
      result = addTask(taskData);
    }

    if (result) {
      setShowForm(false);
      setEditingTask(undefined);
    }
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId);
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetBoard();
      setShowResetConfirm(false);
    } catch (error) {
      console.error('Failed to reset board:', error);
    } finally {
      setIsResetting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h3 className="text-lg font-semibold">Error Loading Tasks</h3>
          </div>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={retryLoad}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Board</h1>
            <p className="text-gray-600">Manage your tasks efficiently with drag and drop</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset Board</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt">Sort by Created</option>
                <option value="dueDate">Sort by Due Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => {
              const columnTasks = tasks.filter(task => task.column === column.id);
              const filteredTasks = getFilteredAndSortedTasks(columnTasks);
              
              return (
                <div key={column.id} className={`${column.color} rounded-lg p-4`}>
                  <h2 className="font-semibold text-lg mb-4 text-gray-800 flex items-center justify-between">
                    <span>{column.title}</span>
                    <span className="text-sm font-normal bg-white px-2 py-1 rounded-full">
                      {filteredTasks.length}
                    </span>
                  </h2>
                  
                  <div className="min-h-[300px] rounded-lg">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                        {searchQuery && (
                          <p className="text-xs mt-1">Try adjusting your filters</p>
                        )}
                      </div>
                    ) : (
                      <SortableContext 
                        items={filteredTasks.map(task => task.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {filteredTasks.map(task => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </SortableContext>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DndContext>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <TaskForm
              task={editingTask}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(undefined);
              }}
            />
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reset Task Board?
            </h3>
            <p className="text-gray-600 mb-6">
              This will delete all tasks and reset the board to its initial state. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? 'Resetting...' : 'Reset Board'}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
