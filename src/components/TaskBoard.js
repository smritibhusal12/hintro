import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

    // Sort by due date
    if (sortBy === 'dueDate') {
      filtered = [...filtered].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    return filtered;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const success = moveTask(draggableId, destination.droppableId);
    
    if (!success) {
      console.error('Failed to move task');
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

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const success = resetBoard();
      if (success) {
        setShowResetConfirm(false);
      }
    } catch (err) {
      console.error('Error resetting board:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.column === 'todo').length;
    const doing = tasks.filter(t => t.column === 'doing').length;
    const done = tasks.filter(t => t.column === 'done').length;
    
    return { total, todo, doing, done };
  };

  const stats = getTaskStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={retryLoad}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={clearError}
                className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>Total: {stats.total}</span>
                <span>Todo: {stats.todo}</span>
                <span>Doing: {stats.doing}</span>
                <span>Done: {stats.done}</span>
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset Board</span>
            </button>
          </div>
          
          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">No Sort</option>
              <option value="dueDate">Sort by Due Date</option>
            </select>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Task Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
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
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[300px] rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-opacity-70' : ''
                        }`}
                      >
                        {filteredTasks.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                            {searchQuery && (
                              <p className="text-xs mt-1">Try adjusting your filters</p>
                            )}
                          </div>
                        ) : (
                          filteredTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-2 transition-opacity ${
                                    snapshot.isDragging ? 'opacity-50' : ''
                                  }`}
                                >
                                  <TaskCard
                                    task={task}
                                    onEdit={handleEdit}
                                    onDelete={deleteTask}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            task={editingTask}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <RotateCcw size={24} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Reset Board</h2>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to reset the board? This will permanently delete:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>All {stats.total} tasks</li>
                  <li>All activity history</li>
                  <li>All saved data</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw size={16} />
                      <span>Reset Board</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
