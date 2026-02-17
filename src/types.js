// JavaScript version of types - using JSDoc for documentation

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier
 * @property {string} title - Task title (required)
 * @property {string} [description] - Task description
 * @property {'low'|'medium'|'high'} priority - Task priority
 * @property {string} [dueDate] - Due date in ISO format
 * @property {string[]} tags - Array of tags
 * @property {string} createdAt - Creation timestamp
 * @property {'todo'|'doing'|'done'} column - Current column
 */

/**
 * @typedef {Object} Activity
 * @property {string} id - Unique identifier
 * @property {'created'|'edited'|'moved'|'deleted'} type - Activity type
 * @property {string} taskId - Related task ID
 * @property {string} taskTitle - Related task title
 * @property {string} timestamp - Activity timestamp
 * @property {string} [details] - Additional details
 */

/**
 * @typedef {Object} User
 * @property {string} email - User email
 * @property {boolean} rememberMe - Remember me preference
 */

export {};
