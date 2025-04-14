# Task Manager

A modern web application for task management with customizable themes. **Project under active development.**

## Description

Task Manager allows you to efficiently organize your projects and tasks with a modern and intuitive interface. It uses local storage to save your data directly in the browser.

## Features

### Available
- **Project Management**: Create, view, and delete projects
- **Task Management**: Add, edit, and delete tasks within each project
- **Priority Levels**: Assign low, medium, or high priority to your tasks
- **Due Dates**: Set deadlines for your tasks
- **Theme Customization**: Choose from 8 different themes:
  - Catppuccin
  - Kanagawa
  - Tokyo Night
  - Gruvbox
  - Nord
  - Dracula
  - Everforest
  - Solarized

### In Development
- [x] Task filtering and sorting
- [ ] Task and project search
- [ ] Task statuses (Pending, In Progress, Completed)
- [ ] Tags/categories for tasks 
- [ ] Improvements for mobile responsive design

## Technologies Used

- JavaScript (ES6+)
- HTML5 and CSS3
- Tailwind CSS
- Webpack
- SWC (Speedy Web Compiler)
- Local Storage API for data persistence

## Installation and Usage

### Requirements
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/task-manager.git
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

The project will be available at `http://localhost:8080`

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
├── .github/             # GitHub workflows
├── src/
│   ├── components/      # UI components
│   ├── controllers/     # Application logic
│   ├── models/          # Data models
│   ├── views/           # Rendering logic
│   ├── index.js         # Application entry point
│   └── style.css        # Global styles and themes
├── index.html           # Main HTML template
├── webpack.common.js    # Shared webpack configuration
├── webpack.dev.js       # Development configuration
├── webpack.prod.js      # Production configuration
└── package.json         # Dependencies and scripts
```

## License

This project is licensed under the MIT License.
