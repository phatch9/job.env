# Apply.come Database Setup

This document describes the database schema and setup instructions for the Apply.come application.

## Database Schema

### Tables

#### `companies`
Stores company information for job applications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| name | TEXT | Company name (required) |
| website | TEXT | Company website URL |
| description | TEXT | Company description |
| location | TEXT | Company location |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

#### `applications`
Stores job application tracking information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| company_id | UUID | Foreign key to companies |
| position | TEXT | Job position title (required) |
| status | TEXT | Application status (required) |
| salary | INTEGER | Salary amount |
| location | TEXT | Job location |
| job_url | TEXT | Job posting URL |
| applied_date | TIMESTAMP | Date application was submitted |
| interview_date | TIMESTAMP | Date of interview |
| offer_date | TIMESTAMP | Date offer was received |
| rejected_date | TIMESTAMP | Date of rejection |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Status Values:**
- `wishlist` - Interested in applying
- `applied` - Application submitted
- `interview` - Interview scheduled/completed
- `offer` - Offer received
- `rejected` - Application rejected

#### `notes`
Stores notes associated with applications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| application_id | UUID | Foreign key to applications |
| content | TEXT | Note content (required) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data:

- **Companies**: Users can CRUD their own companies
- **Applications**: Users can CRUD their own applications
- **Notes**: Users can CRUD notes for their own applications

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Migrations

In your Supabase project dashboard:

1. Go to SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run the SQL

Alternatively, if using Supabase CLI:

```bash
supabase db push
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Verify Setup

After running migrations, verify the tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: `companies`, `applications`, `notes`

## Indexes

The following indexes are created for optimal query performance:

- `idx_companies_user_id` - Fast company lookups by user
- `idx_applications_user_id` - Fast application lookups by user
- `idx_applications_company_id` - Fast application lookups by company
- `idx_applications_status` - Fast filtering by status
- `idx_notes_application_id` - Fast note lookups by application

## Automatic Timestamps

All tables have triggers that automatically update the `updated_at` column when records are modified.
