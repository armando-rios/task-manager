# Task Manager (Mocha)

A terminal-themed task management application built with Astro 6 and React 19. Mocha provides a sleek, efficient way to manage your projects and tasks with a focus on simplicity and performance.

![Mocha Task Manager Screenshot](https://via.placeholder.com/800x450?text=Task+Manager+Screenshot)

## Tech Stack

- [![Astro](https://img.shields.io/badge/Astro-6.0.0-white?style=for-the-badge&logo=astro&logoColor=ff5e01)](https://astro.build)
- [![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
- [![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38b2ac?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
- [![Nanostores](https://img.shields.io/badge/Nanostores-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMjAgN0gyME0xMiAyTDE5IDdIMTkiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTIxIDdWMjFINyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTIgMjJMNCAxN0g0IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0zIDE3VjNIMjEiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTEyIDIyTDE5IDE3SDE5IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=)](https://nanostores.github.io)
- [![@dnd-kit](https://img.shields.io/badge/@dnd%2Dkit-000000?style=for-the-badge&logo=dragndrop&logoColor=white)](https://dndkit.com)
- [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

## Features

- **Authentication**: Secure login, registration, and email verification powered by Supabase
- **Project Management**: Full CRUD operations for projects with optimistic UI updates
- **Task Management**: 
  - List view with drag-and-drop sorting using @dnd-kit
  - Task priorities (low, medium, high) and statuses (todo, in-progress, done)
  - Markdown support in task descriptions
- **Themes**: 5 beautiful color themes inspired by popular palettes:
  - Catppuccin
  - Kanagawa
  - Kanagawa Dragon
  - Tokyo Night
  - Nord
- **Real-time Sync**: Cross-tab synchronization using BroadcastChannel API
- **Performance**: SSR dashboard pages with static auth/landing pages for optimal performance

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- A Supabase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/task-manager-astro.git
cd task-manager-astro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then fill in your Supabase credentials in the `.env` file.

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4321`.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key | Yes |
| `PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Project Structure

```
src/
├── components/      # Reusable UI components
├── layouts/         # Layout components
├── pages/           # Page components
├── stores/          # Nanostores for state management
├── styles/          # Global styles and theme configurations
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.