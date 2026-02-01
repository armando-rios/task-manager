# Task Manager

A full-stack task management application with user authentication, email verification, and a modern Single Page Application (SPA) interface. **Project under active development.**

## Description

Task Manager is a complete task management solution that allows users to organize their projects and tasks with a modern and intuitive interface. Features secure user authentication, email verification, and cloud-based data persistence using MongoDB.

## Features

### Available

- **User Authentication**: Secure registration and login with JWT tokens and httpOnly cookies
- **Email Verification**: Email verification system using Resend API
- **Project Management**: Create, view, and delete projects with descriptions
- **Task Management**: Create and view tasks within each project
- **Priority Levels**: Assign low, medium, or high priority to your tasks
- **Due Dates**: Set deadlines for your tasks
- **Responsive Design**: Optimized interface for desktop and mobile devices
- **SPA Architecture**: Client-side routing for seamless navigation
- **Modern UI**: Clean interface with skeleton loaders and smooth transitions

### In Development

- [ ] Task editing and deletion functionality
- [ ] Priority filtering for tasks
- [ ] Drag & Drop to reorder tasks
- [ ] Theme Customization (Catppuccin, Kanagawa, Tokyo Night, Gruvbox, Nord, Dracula, Everforest, Solarized)
- [ ] Task statuses (Pending, In Progress, Completed)
- [ ] Task and project search functionality
- [ ] Tags/categories for tasks
- [ ] User profile management
- [ ] Password recovery

## Technologies Used

### Frontend

- JavaScript (ES6+ Modules)
- HTML5 and CSS3
- Tailwind CSS v4
- Webpack 5
- SWC (Speedy Web Compiler)
- Client-side routing (SPA)

### Backend

- Node.js with Express 5
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Resend for email services
- RESTful API architecture

## Installation and Usage

### Requirements

- Node.js (v18.0.0 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=your_resend_api_key
NODE_ENV=development
```

### Installation

```bash
# Clone the repository
git clone https://github.com/armando-rios/task-manager.git
cd task-manager

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
# or
yarn build
```

The compiled files will be generated in the `dist` directory.

## Project Structure

```
task-manager/
├── api/                    # Backend API endpoints
│   ├── _lib/              # Shared backend utilities
│   │   ├── authMiddleware.js   # JWT authentication middleware
│   │   ├── db.js              # MongoDB connection
│   │   ├── emailService.js    # Email service with Resend
│   │   ├── userModel.js       # User schema and model
│   │   ├── projectModel.js    # Project schema and model
│   │   └── taskModel.js       # Task schema and model
│   ├── auth/              # Authentication endpoints
│   │   ├── register.js        # User registration
│   │   ├── login.js           # User login
│   │   ├── logout.js          # User logout
│   │   ├── verify-email.js    # Email verification
│   │   ├── resend-verification.js
│   │   └── me.js              # Get current user
│   ├── projects.js        # Projects CRUD operations
│   └── tasks.js           # Tasks CRUD operations
├── src/                   # Frontend source code
│   ├── components/        # UI components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Reusable components (Button, Input, Modal, etc.)
│   │   └── dashboard/    # Dashboard components (Header, Sidebar, Task, etc.)
│   ├── pages/            # SPA pages
│   │   ├── auth.js           # Login/Register page
│   │   ├── dashboard.js      # Main dashboard
│   │   ├── verifyEmail.js    # Email verification page
│   │   ├── waitingVerification.js
│   │   └── notFound.js       # 404 page
│   ├── controllers/      # Business logic
│   ├── models/           # Frontend data models
│   ├── router/           # Client-side routing
│   ├── services/         # API service layer
│   ├── utils/            # Utility functions
│   ├── index.js          # Application entry point
│   └── style.css         # Global styles and themes
├── index.html            # Main HTML template
├── webpack.common.js     # Shared webpack configuration
├── webpack.dev.js        # Development configuration
├── webpack.prod.js       # Production configuration
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### Projects

- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `DELETE /api/projects` - Delete project

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks` - Update task
- `DELETE /api/tasks` - Delete task

## License

This project is licensed under the MIT License.
