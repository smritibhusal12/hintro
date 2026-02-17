import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const TaskContext = createContext(undefined);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    setTasks(storage.getTasks());
    setActivities(storage.getActivities());
  }, []);

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.saveActivities(activities);
  }, [activities]);

  const addActivity = (type, taskId, taskTitle, details) => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      taskId,
      taskTitle,
      timestamp: new Date().toISOString(),
      details
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep only last 50 activities
  };

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    addActivity('created', newTask.id, newTask.title);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    const task = tasks.find(t => t.id === id);
    if (task) {
      addActivity('edited', id, task.title);
    }
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    if (task) {
      addActivity('deleted', id, task.title);
    }
  };

  const moveTask = (id, newColumn) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, column: newColumn } : task
    ));
    if (task && task.column !== newColumn) {
      addActivity('moved', id, task.title, `from ${task.column} to ${newColumn}`);
    }
  };

  const resetBoard = () => {
    setTasks([]);
    setActivities([]);
    storage.resetBoard();
  };

  const value = {
    tasks,
    activities,
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
