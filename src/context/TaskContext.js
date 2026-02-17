import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

const TaskContext = createContext(undefined);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadedTasks = storage.getTasks();
      const loadedActivities = storage.getActivities();
      
      setTasks(loadedTasks);
      setActivities(loadedActivities);
    } catch (err) {
      setError('Failed to load data from storage');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isLoading && tasks.length >= 0) {
      const success = storage.saveTasks(tasks);
      if (!success) {
        setError('Failed to save tasks to storage');
      }
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading && activities.length >= 0) {
      const success = storage.saveActivities(activities);
      if (!success) {
        setError('Failed to save activities to storage');
      }
    }
  }, [activities, isLoading]);

  const addActivity = useCallback((type, taskId, taskTitle, details) => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      taskId,
      taskTitle,
      timestamp: new Date().toISOString(),
      details
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  }, []);

  const addTask = useCallback((taskData) => {
    try {
      if (!taskData || !taskData.title || !taskData.title.trim()) {
        throw new Error('Task title is required');
      }

      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        title: taskData.title.trim()
      };

      setTasks(prev => [...prev, newTask]);
      addActivity('created', newTask.id, newTask.title);
      setError(null);
      return newTask;
    } catch (err) {
      setError(err.message);
      console.error('Error adding task:', err);
      return null;
    }
  }, [addActivity]);

  const updateTask = useCallback((id, updates) => {
    try {
      if (!id || !updates) {
        throw new Error('Task ID and updates are required');
      }

      let updatedTask = null;
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          updatedTask = { ...task, ...updates };
          return updatedTask;
        }
        return task;
      }));

      if (updatedTask) {
        addActivity('edited', id, updatedTask.title);
        setError(null);
        return updatedTask;
      } else {
        throw new Error('Task not found');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
      return null;
    }
  }, [addActivity]);

  const deleteTask = useCallback((id) => {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }

      let deletedTask = null;
      setTasks(prev => {
        const taskToDelete = prev.find(task => task.id === id);
        if (taskToDelete) {
          deletedTask = taskToDelete;
        }
        return prev.filter(task => task.id !== id);
      });

      if (deletedTask) {
        addActivity('deleted', id, deletedTask.title);
        setError(null);
        return true;
      } else {
        throw new Error('Task not found');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
      return false;
    }
  }, [addActivity]);

  const moveTask = useCallback((id, newColumn) => {
    try {
      if (!id || !newColumn) {
        throw new Error('Task ID and new column are required');
      }

      if (!['todo', 'doing', 'done'].includes(newColumn)) {
        throw new Error('Invalid column');
      }

      let movedTask = null;
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          if (task.column !== newColumn) {
            movedTask = { ...task, column: newColumn };
            return movedTask;
          }
        }
        return task;
      }));

      if (movedTask) {
        addActivity('moved', id, movedTask.title, `from ${movedTask.column} to ${newColumn}`);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      console.error('Error moving task:', err);
      return false;
    }
  }, [addActivity]);

  const resetBoard = useCallback(() => {
    try {
      setTasks([]);
      setActivities([]);
      const success = storage.resetBoard();
      if (success) {
        setError(null);
        return true;
      } else {
        throw new Error('Failed to reset board storage');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error resetting board:', err);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryLoad = useCallback(() => {
    loadData();
  }, [loadData]);

  const value = {
    tasks,
    activities,
    isLoading,
    error,
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
    clearError,
    retryLoad
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
