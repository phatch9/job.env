export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

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
    user_id: string;
    application_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface Reminder {
    id: string;
    user_id: string;
    application_id?: string;
    application?: Application; // Joined fields
    title: string;
    due_date: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: string;
    user_id: string;
    application_id?: string;
    name: string;
    file_path: string;
    file_type: string;
    size: number;
    created_at: string;
}

// Form data types
export interface CompanyFormData {
    name: string;
    website?: string;
    description?: string;
    location?: string;
}

export interface ApplicationFormData {
    company_id: string;
    position: string;
    status: ApplicationStatus;
    salary?: number;
    location?: string;
    job_url?: string;
    applied_date?: string;
    interview_date?: string;
    offer_date?: string;
    rejected_date?: string;
}

export interface NoteFormData {
    application_id: string;
    content: string;
}

export interface ReminderFormData {
    application_id?: string;
    title: string;
    due_date: string;
    completed?: boolean;
}

// UI types
export interface StatusColumn {
    id: ApplicationStatus;
    title: string;
    applications: Application[];
}

export interface DashboardStats {
    total: number;
    wishlist: number;
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
}
