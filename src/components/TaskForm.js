import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
    column: 'todo'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
        column: task.column || 'todo'
      });
    }
  }, [task]);

  const validate = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Description validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    // Due date validation
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    // Tags validation
    if (formData.tags) {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (tagsArray.length > 10) {
        newErrors.tags = 'Maximum 10 tags allowed';
      }
      
      const invalidTags = tagsArray.filter(tag => tag.length > 20);
      if (invalidTags.length > 0) {
        newErrors.tags = 'Each tag must be less than 20 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: tagsArray
      };
      
      const result = onSave(taskData);
      
      if (result === null || result === false) {
        setErrors({ submit: 'Failed to save task. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear submit error when user makes any change
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setErrors({});
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">{errors.submit}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task title..."
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.title}</span>
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter task description..."
              maxLength={500}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.description}</span>
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.dueDate}</span>
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., urgent, frontend, bug"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.tags ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{errors.tags}</span>
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Column
            </label>
            <select
              name="column"
              value={formData.column}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : (task ? 'Update' : 'Create')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
