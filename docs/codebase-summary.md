# Apply.come - Codebase Summary

## Project Overview

Apply.come is a modern job application tracking system built with React, TypeScript, and Supabase. It features a beautiful glassmorphism UI and an intuitive Kanban board interface for managing job applications.

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Styling**: Vanilla CSS with CSS custom properties
- **Routing**: React Router v6
- **Drag & Drop**: react-beautiful-dnd
- **Date Handling**: date-fns

## Project Structure

```
Apply.come/
├── docs/                      # Documentation
│   ├── DATABASE_SETUP.md     # Database schema and setup
│   ├── code-standards.md     # Coding guidelines
│   ├── codebase-summary.md   # This file
│   └── system-architecture.md # Architecture diagrams
├── public/                    # Static assets
│   └── index.css             # Global styles and design system
├── src/                       # Source code
│   ├── app/                  # Page components
│   │   ├── layout.tsx        # Main layout with sidebar
│   │   ├── page.tsx          # Dashboard page
│   │   └── kanban/
│   │       └── page.tsx      # Kanban board page
│   ├── components/           # Reusable components
│   │   ├── AuthForm.tsx      # Authentication form
│   │   ├── ApplicationCard.tsx # Application card
│   │   └── KanbanBoard.tsx   # Kanban board with DnD
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication hook
│   │   ├── useApplications.ts # Applications CRUD
│   │   └── useCompanies.ts   # Companies CRUD
│   ├── lib/                  # Utilities and configuration
│   │   ├── supabase.ts       # Supabase client
│   │   ├── types.ts          # TypeScript types
│   │   └── constants.ts      # App constants
│   ├── App.tsx               # Main app with routing
│   └── main.tsx              # Entry point
├── supabase/                 # Supabase configuration
│   └── migrations/           # Database migrations
│       └── 001_initial_schema.sql
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── index.html                # HTML entry point
```

## Core Features

### 1. Authentication
- Email/password authentication via Supabase
- Protected routes
- Session management
- Auto-refresh tokens

### 2. Application Tracking
- CRUD operations for job applications
- Status tracking (Wishlist → Applied → Interview → Offer/Rejected)
- Company association
- Salary and location tracking
- Job posting URLs
- Date tracking for each status

### 3. Kanban Board
- Drag-and-drop interface
- Visual status columns
- Real-time updates
- Color-coded status indicators

### 4. Dashboard
- Application statistics
- Status breakdown
- Quick overview

### 5. Company Management
- CRUD operations for companies
- Company details (name, website, description, location)
- Association with applications

## Key Components

### Hooks

#### `useAuth`
- Manages authentication state
- Provides sign in/up/out functions
- Listens for auth state changes

#### `useApplications`
- Fetches and manages applications
- CRUD operations
- Real-time subscriptions
- Optimistic updates

#### `useCompanies`
- Fetches and manages companies
- CRUD operations
- Real-time subscriptions

### Components

#### `KanbanBoard`
- Drag-and-drop functionality
- Status columns
- Application cards
- Empty states

#### `ApplicationCard`
- Displays application details
- Status indicator
- Action buttons
- Responsive design

#### `Layout`
- Sidebar navigation
- User info display
- Sign out functionality
- Responsive mobile menu

## Design System

### Colors
- Dark theme with vibrant accents
- Glassmorphism effects
- Status-specific colors
- Gradient accents

### Typography
- Inter font family
- Responsive font sizes
- Clear hierarchy

### Components
- Glass cards
- Gradient buttons
- Smooth animations
- Hover effects

## Data Flow

1. **Authentication**: User signs in → Supabase Auth → Session stored
2. **Data Fetching**: Component mounts → Hook fetches data → Real-time subscription
3. **Updates**: User action → Optimistic update → API call → Real-time sync
4. **Status Change**: Drag card → Update status → Update timestamp → Sync to DB

## Security

- Row Level Security (RLS) on all tables
- User-scoped data access
- Secure authentication
- Environment variables for secrets

## Performance Optimizations

- Optimistic updates for instant feedback
- Real-time subscriptions for live data
- Indexed database queries
- Lazy loading (future enhancement)
- Memoization where needed

## Future Enhancements

- Notes functionality
- Search and filter
- Applications list view
- Companies page
- Export data
- Email notifications
- Calendar integration
- Analytics and insights
