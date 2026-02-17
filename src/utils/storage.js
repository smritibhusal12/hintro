const STORAGE_KEYS = {
  TASKS: 'task-board-tasks',
  ACTIVITIES: 'task-board-activities',
  USER: 'task-board-user'
};

const validateTask = (task) => {
  if (!task || typeof task !== 'object') return false;
  if (!task.id || typeof task.id !== 'string') return false;
  if (!task.title || typeof task.title !== 'string') return false;
  if (!task.column || !['todo', 'doing', 'done'].includes(task.column)) return false;
  if (!task.priority || !['low', 'medium', 'high'].includes(task.priority)) return false;
  return true;
};

const validateActivity = (activity) => {
  if (!activity || typeof activity !== 'object') return false;
  if (!activity.id || typeof activity.id !== 'string') return false;
  if (!activity.type || !['created', 'edited', 'moved', 'deleted'].includes(activity.type)) return false;
  if (!activity.timestamp || typeof activity.timestamp !== 'string') return false;
  return true;
};

const safeJSONParse = (str, fallback = []) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return fallback;
  }
};

const safeJSONParseUser = (str, fallback = null) => {
  try {
    const parsed = JSON.parse(str);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return fallback;
  }
};

export const storage = {
  // Tasks
  getTasks: () => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return [];
      }
      
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!stored) return [];
      
      const tasks = safeJSONParse(stored);
      return tasks.filter(validateTask);
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  saveTasks: (tasks) => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      
      if (!Array.isArray(tasks)) {
        console.error('Tasks must be an array');
        return false;
      }
      
      const validTasks = tasks.filter(validateTask);
      if (validTasks.length !== tasks.length) {
        console.warn('Some invalid tasks were filtered out');
      }
      
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(validTasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      return false;
    }
  },

  // Activities
  getActivities: () => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return [];
      }
      
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!stored) return [];
      
      const activities = safeJSONParse(stored);
      return activities.filter(validateActivity);
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  },

  saveActivities: (activities) => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      
      if (!Array.isArray(activities)) {
        console.error('Activities must be an array');
        return false;
      }
      
      const validActivities = activities.filter(validateActivity);
      if (validActivities.length !== activities.length) {
        console.warn('Some invalid activities were filtered out');
      }
      
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(validActivities));
      return true;
    } catch (error) {
      console.error('Error saving activities:', error);
      return false;
    }
  },

  // User
  getUser: () => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return null;
      }
      
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (!stored) return null;
      
      return safeJSONParseUser(stored);
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  },

  saveUser: (user) => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      
      if (!user || typeof user !== 'object') {
        console.error('User must be an object');
        return false;
      }
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  },

  clearUser: () => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      
      localStorage.removeItem(STORAGE_KEYS.USER);
      return true;
    } catch (error) {
      console.error('Error clearing user:', error);
      return false;
    }
  },

  // Reset all data
  resetBoard: () => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error resetting board:', error);
      return false;
    }
  },

  // Storage utility methods
  isAvailable: () => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },

  getStorageSize: () => {
    try {
      if (typeof localStorage === 'undefined') return 0;
      
      let totalSize = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      });
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }
};
