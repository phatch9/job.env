# Apply.come 🎯

> modern job application tracking system with beautiful glass-morphism UI

[![License: Apache](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)](https://supabase.com/)

## ✨ Features

### Core Functionality

- 🔐 **Secure Authentication** - Email/password authentication via Supabase with session management
- 📊 **Application Tracking** - Complete CRUD operations for job applications
- 📋 **Kanban Board** - Intuitive drag-and-drop interface with visual status management
- 🏢 **Company Management** - Track company information and job details
- 🔍 **Search & Filter** - Find applications quickly by company or job title
- 📝 **Rich Notes** - Detailed application notes and metadata tracking

### User Experience

- 🎨 **Responsive Design** - Perfect on mobile, tablet, and desktop
- 🌙 **Dark Theme** - Beautiful dark mode with vibrant accent colors
- ✨ **Glassmorphism UI** - Modern glass-morphic design with smooth animations
- ⚡ **Real-time Updates** - Live data synchronization across devices
- 🚀 **Optimistic Updates** - Instant UI feedback for better UX

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Vanilla CSS with CSS Custom Properties
- **Routing**: React Router v6
- **Drag & Drop**: react-beautiful-dnd
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up free](https://supabase.com))

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd Apply.come
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration:
   - Copy contents from `supabase/migrations/001_initial_schema.sql`
   - Paste and execute in SQL Editor
3. Get your project credentials from Settings → API

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📖 Usage

### Application Status Flow

Applications move through these statuses:

1. **Wishlist** ⭐ - Jobs you're interested in
2. **Applied** 📤 - Applications submitted
3. **Interview** 💼 - Interview scheduled/completed
4. **Offer** 🎉 - Offer received
5. **Rejected** ❌ - Application rejected

### Kanban Board

Drag and drop application cards between columns to update their status. The system automatically tracks timestamps for each status change.

### Dashboard

View statistics and get a quick overview of all your applications across different stages.

## 📁 Project Structure

```
Apply.come/
├── docs/                    # Documentation
├── public/                  # Static assets
│   └── index.css           # Global styles
├── src/
│   ├── app/                # Page components
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & config
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase/
│   └── migrations/         # Database migrations
└── package.json
```

## 🧪 Testing

```bash
npm run test
```

## 🏗️ Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## 📚 Documentation

- [Database Setup](docs/DATABASE_SETUP.md) - Database schema and setup instructions
- [Code Standards](docs/code-standards.md) - Coding guidelines and best practices
- [Codebase Summary](docs/codebase-summary.md) - Project structure and architecture
- [System Architecture](docs/system-architecture.md) - Architecture diagrams and data flow

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) for drag-and-drop functionality
- [Inter Font](https://rsms.me/inter/) for beautiful typography

---

Built with ❤️ using React, TypeScript, and Supabase
b Tracker - Your applications, interviews, and offers managenment system
