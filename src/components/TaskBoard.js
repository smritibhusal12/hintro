import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTask } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Plus, RotateCcw } from 'lucide-react';

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
    setSortBy
  } = useTask();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(undefined);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
    moveTask(draggableId, destination.droppableId);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleReset = () => {
    resetBoard();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset Board</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => {
              const columnTasks = tasks.filter(task => task.column === column.id);
              const filteredTasks = getFilteredAndSortedTasks(columnTasks);
              
              return (
                <div key={column.id} className={`${column.color} rounded-lg p-4`}>
                  <h2 className="font-semibold text-lg mb-4 text-gray-800">
                    {column.title} ({filteredTasks.length})
                  </h2>
                  
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {filteredTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={handleEdit}
                                  onDelete={deleteTask}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {showForm && (
          <TaskForm
            task={editingTask}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Reset Board</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reset the board? This will delete all tasks and activities.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
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
