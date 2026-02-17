# Task Board Application

A comprehensive task management application built with **React JavaScript** and Tailwind CSS. This application demonstrates frontend engineering best practices including state management, drag-and-drop functionality, and local storage persistence.

## Features

### Authentication
- Static login with hardcoded credentials
- Email: `intern@demo.com`
- Password: `intern123`
- "Remember me" functionality using localStorage
- Protected routes and logout functionality

### Task Management
- **Fixed Columns**: Todo, Doing, Done
- **Task Properties**:
  - Title (required)
  - Description
  - Priority (Low, Medium, High)
  - Due Date
  - Tags
  - Created At timestamp
- **Operations**: Create, Edit, Delete tasks
- **Drag & Drop**: Move tasks between columns

### Search & Filter
- Search tasks by title
- Filter by priority level
- Sort by due date (empty values last)

### Persistence
- All data persists across browser refreshes
- Uses localStorage for data storage
- Safe handling of empty or missing storage
- Reset Board option with confirmation dialog

### Activity Log
- Tracks all task operations:
  - Task created
  - Task edited
  - Task moved
  - Task deleted
- Shows latest 50 activities with timestamps

## Technical Implementation

### Technologies Used
- **React 18** with JavaScript
- **React Router** for navigation
- **React Beautiful DND** for drag-and-drop
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **LocalStorage API** for data persistence

### Project Structure
```
src/
├── components/           # React components (.js)
│   ├── ActivityLog.js  # Activity tracking component
│   ├── Dashboard.js    # Main dashboard layout
│   ├── Header.js       # Navigation header
│   ├── Login.js        # Authentication form
│   ├── TaskBoard.js    # Main task board with drag-drop
│   ├── TaskCard.js     # Individual task display
│   └── TaskForm.js     # Task creation/editing form
├── context/             # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── TaskContext.js  # Task management state
├── types.js             # JSDoc type definitions
├── utils/               # Utility functions
│   └── storage.js       # localStorage management
├── App.js              # Main application component
├── App.test.js         # Test suite
├── index.js            # Application entry point
└── index.css            # Global styles
```

### State Management
- **React Context** for global state management
- **AuthContext**: Handles authentication state and user session
- **TaskContext**: Manages tasks, activities, and UI state
- **LocalStorage**: Persists data across sessions

### Key Features Implementation

#### Authentication Flow
1. User enters credentials on login page
2. Validates against hardcoded credentials
3. On success, stores user session in localStorage
4. Redirects to dashboard with protected routes
5. "Remember me" option persists session across browser restarts

#### Drag & Drop
- Uses `react-beautiful-dnd` library
- Tasks can be dragged between Todo, Doing, and Done columns
- Automatically updates task status and logs activity

#### Data Persistence
- All tasks and activities stored in localStorage
- Automatic save on any data change
- Graceful handling of storage errors
- Reset functionality clears all data

#### Activity Tracking
- Comprehensive logging of all user actions
- Timestamped entries with relative time display
- Limited to 50 most recent activities for performance

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   # If cloning from git
   git clone <repository-url>
   cd task-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App (one-way operation)

## Testing

The application includes a comprehensive test suite covering:

1. **Login Form Rendering** - Verifies all form elements are present
2. **Invalid Login Handling** - Tests error message display for wrong credentials
3. **Successful Login** - Validates user data storage on successful authentication

### Running Tests
```bash
npm test
```

## Deployment

### Building for Production
```bash
npm run build
```
This creates an optimized production build in the `build` folder.

### Deployment Options

1. **Netlify** (Recommended)
   - Drag and drop the `build` folder to Netlify
   - Or connect Git repository for automatic deployments

2. **Vercel**
   - Import project from Git repository
   - Vercel automatically detects and builds React applications

3. **GitHub Pages**
   ```bash
   # Install gh-pages if not already installed
   npm install --save-dev gh-pages
   
   # Add to package.json scripts:
   # "predeploy": "npm run build",
   # "deploy": "gh-pages -d build"
   
   npm run deploy
   ```

4. **Static Hosting**
   - Upload the `build` folder contents to any static hosting service
   - Ensure the hosting service supports client-side routing

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations

- This is a frontend-only application with no backend
- Credentials are hardcoded for demonstration purposes
- Uses JavaScript with JSDoc for documentation instead of TypeScript
- In production, implement proper authentication with secure backend
- Consider adding input validation and sanitization for production use

## Performance Optimizations

- Lazy loading of components
- Efficient state management with React Context
- Optimized re-renders using proper dependency arrays
- Limited activity log to prevent memory issues
- Debounced search functionality (can be implemented)

## Future Enhancements

- Backend API integration
- Real-time collaboration
- Advanced filtering and sorting
- Task templates
- File attachments
- Comments and mentions
- Time tracking
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For any questions or issues, please create an issue in the project repository.
