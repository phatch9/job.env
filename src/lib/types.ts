// Application Status Types
export type ApplicationStatus =
    | 'wishlist'
    | 'applied'
    | 'interview'
    | 'offer'
    | 'rejected';

// Database Types
export interface User {
    id: string;
    email: string;
    created_at: string;
}

export interface Company {
    id: string;
    user_id: string;
    name: string;
    website?: string;
    description?: string;
    location?: string;
    created_at: string;
    updated_at: string;
}

export interface Application {
    id: string;
    user_id: string;
    company_id: string;
    company?: Company;
    position: string;
    status: ApplicationStatus;
    salary?: number;
    location?: string;
    job_url?: string;
    applied_date?: string;
    interview_date?: string;
    offer_date?: string;
    rejected_date?: string;
    created_at: string;
    updated_at: string;
}

export interface Note {
    id: string;
    application_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

// Form Types
export interface ApplicationFormData {
    company_id: string;
    position: string;
    status: ApplicationStatus;
    salary?: number;
    location?: string;
    job_url?: string;
    applied_date?: string;
}

export interface CompanyFormData {
    name: string;
    website?: string;
    description?: string;
    location?: string;
}

// UI Types
export interface KanbanColumn {
    id: ApplicationStatus;
    title: string;
    applications: Application[];
}

export interface SearchFilters {
    query: string;
    status?: ApplicationStatus;
    minSalary?: number;
    maxSalary?: number;
    location?: string;
}

export interface SortOption {
    field: 'created_at' | 'applied_date' | 'position' | 'salary';
    direction: 'asc' | 'desc';
}
