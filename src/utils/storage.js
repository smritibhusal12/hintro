const STORAGE_KEYS = {
  TASKS: 'task-board-tasks',
  ACTIVITIES: 'task-board-activities',
  USER: 'task-board-user'
};

export const storage = {
  // Tasks
  getTasks: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  saveTasks: (tasks) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  // Activities
  getActivities: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  },

  saveActivities: (activities) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  },

  // User
  getUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  },

  saveUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  clearUser: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  },

  // Reset all data
  resetBoard: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    } catch (error) {
      console.error('Error resetting board:', error);
    }
  }
};
