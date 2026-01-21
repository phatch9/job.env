# Apply.come - System Architecture

## Overview

Apply.come is a full-stack job application tracking system built with a modern serverless architecture using React for the frontend and Supabase for the backend.

## Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Web Browser"]
        React["React Application"]
        Router["React Router"]
    end

    subgraph State["State Management"]
        AuthContext["Auth Context"]
        CustomHooks["Custom Hooks"]
    end

    subgraph Components["Component Layer"]
        Pages["Pages"]
        Components["Reusable Components"]
        Layout["Layout"]
    end

    subgraph Backend["Backend Layer (Supabase)"]
        Auth["Supabase Auth"]
        Database["PostgreSQL Database"]
        Realtime["Realtime Subscriptions"]
        RLS["Row Level Security"]
    end

    Browser --> React
    React --> Router
    Router --> Pages
    Pages --> Components
    Components --> CustomHooks
    CustomHooks --> AuthContext
    CustomHooks --> Auth
    CustomHooks --> Database
    CustomHooks --> Realtime
    Database --> RLS
```

## Component Hierarchy

```mermaid
graph TD
    App["App.tsx"]
    App --> AuthProvider["AuthProvider"]
    AuthProvider --> AppRoutes["AppRoutes"]
    AppRoutes --> AuthForm["AuthForm"]
    AppRoutes --> Layout["Layout"]
    Layout --> Dashboard["Dashboard Page"]
    Layout --> Kanban["Kanban Page"]
    Kanban --> KanbanBoard["KanbanBoard"]
    KanbanBoard --> ApplicationCard["ApplicationCard"]
```

## Data Flow

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant AuthForm
    participant useAuth
    participant Supabase
    participant App

    User->>AuthForm: Enter credentials
    AuthForm->>useAuth: signIn(email, password)
    useAuth->>Supabase: auth.signInWithPassword()
    Supabase-->>useAuth: Session + User
    useAuth-->>AuthForm: Success
    AuthForm-->>App: Redirect to Dashboard
```

### Application CRUD Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant useApplications
    participant Supabase
    participant Realtime

    User->>Component: Create Application
    Component->>useApplications: createApplication(data)
    useApplications->>useApplications: Optimistic Update
    useApplications->>Supabase: INSERT query
    Supabase-->>useApplications: New Application
    Supabase->>Realtime: Broadcast Change
    Realtime-->>useApplications: Real-time Update
    useApplications-->>Component: Updated State
```

### Kanban Drag & Drop Flow

```mermaid
sequenceDiagram
    participant User
    participant KanbanBoard
    participant useApplications
    participant Supabase

    User->>KanbanBoard: Drag card to new column
    KanbanBoard->>useApplications: updateStatus(id, newStatus)
    useApplications->>useApplications: Optimistic Update
    useApplications->>Supabase: UPDATE status + timestamp
    Supabase-->>useApplications: Updated Application
    useApplications-->>KanbanBoard: Confirm Update
```

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ COMPANIES : creates
    USERS ||--o{ APPLICATIONS : creates
    COMPANIES ||--o{ APPLICATIONS : has
    APPLICATIONS ||--o{ NOTES : has

    USERS {
        uuid id PK
        string email
        timestamp created_at
    }

    COMPANIES {
        uuid id PK
        uuid user_id FK
        string name
        string website
        string description
        string location
        timestamp created_at
        timestamp updated_at
    }

    APPLICATIONS {
        uuid id PK
        uuid user_id FK
        uuid company_id FK
        string position
        string status
        integer salary
        string location
        string job_url
        timestamp applied_date
        timestamp interview_date
        timestamp offer_date
        timestamp rejected_date
        timestamp created_at
        timestamp updated_at
    }

    NOTES {
        uuid id PK
        uuid application_id FK
        string content
        timestamp created_at
        timestamp updated_at
    }
```

## Security Architecture

### Row Level Security (RLS)

All database tables implement RLS policies to ensure data isolation:

1. **User Isolation**: Users can only access their own data
2. **Cascading Policies**: Notes inherit access from applications
3. **Automatic Enforcement**: Enforced at database level

```mermaid
graph LR
    User["Authenticated User"]
    Query["Database Query"]
    RLS["RLS Policy Check"]
    Data["User's Data Only"]

    User --> Query
    Query --> RLS
    RLS --> Data
```

## State Management

### Context-based Authentication

```mermaid
graph TD
    AuthProvider["AuthProvider Context"]
    AuthProvider --> useAuth1["useAuth in Layout"]
    AuthProvider --> useAuth2["useAuth in useApplications"]
    AuthProvider --> useAuth3["useAuth in useCompanies"]
```

### Custom Hooks Pattern

Each data entity has a dedicated hook:
- **useAuth**: Authentication state and methods
- **useApplications**: Applications CRUD + real-time
- **useCompanies**: Companies CRUD + real-time

## Real-time Updates

```mermaid
graph LR
    DB["Database Change"]
    Channel["Supabase Channel"]
    Hook["Custom Hook"]
    Component["React Component"]
    UI["UI Update"]

    DB --> Channel
    Channel --> Hook
    Hook --> Component
    Component --> UI
```

## Deployment Architecture

```mermaid
graph TB
    subgraph CDN["CDN / Hosting"]
        Static["Static Assets"]
        HTML["index.html"]
        JS["JavaScript Bundle"]
        CSS["CSS Files"]
    end

    subgraph Supabase["Supabase Cloud"]
        Auth["Auth Service"]
        DB["PostgreSQL"]
        RT["Realtime Engine"]
        Storage["File Storage"]
    end

    User["User Browser"]
    User --> CDN
    CDN --> Supabase
```

## Performance Optimizations

1. **Optimistic Updates**: Immediate UI feedback
2. **Real-time Subscriptions**: Live data without polling
3. **Database Indexes**: Fast query performance
4. **Memoization**: Prevent unnecessary re-renders
5. **Code Splitting**: Lazy load routes (future)

## Technology Decisions

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent TypeScript support
- Virtual DOM for performance

### Why Supabase?
- PostgreSQL database (ACID compliance)
- Built-in authentication
- Real-time subscriptions
- Row Level Security
- Generous free tier

### Why Vite?
- Fast development server
- Optimized production builds
- Native ESM support
- Excellent TypeScript support

### Why Vanilla CSS?
- No build step overhead
- Full control over styling
- CSS custom properties for theming
- Modern CSS features (grid, flexbox, backdrop-filter)

## Scalability Considerations

1. **Database**: PostgreSQL scales vertically and horizontally
2. **Authentication**: Supabase handles auth scaling
3. **Real-time**: Supabase manages WebSocket connections
4. **Frontend**: Static files served via CDN
5. **Caching**: Browser caching + CDN caching
