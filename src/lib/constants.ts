import { ApplicationStatus } from './types';

// Application Status Constants
export const APPLICATION_STATUSES: ApplicationStatus[] = [
    'wishlist',
    'applied',
    'interview',
    'offer',
    'rejected',
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    wishlist: 'Wishlist',
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
    wishlist: 'hsl(210, 100%, 60%)',      // Blue
    applied: 'hsl(280, 100%, 65%)',       // Purple
    interview: 'hsl(45, 100%, 60%)',      // Yellow/Gold
    offer: 'hsl(140, 100%, 45%)',         // Green
    rejected: 'hsl(0, 80%, 60%)',         // Red
};

export const STATUS_ICONS: Record<ApplicationStatus, string> = {
    wishlist: '⭐',
    applied: '📤',
    interview: '💼',
    offer: '🎉',
    rejected: '❌',
};

// Default Values
export const DEFAULT_APPLICATION_STATUS: ApplicationStatus = 'wishlist';

// Date Format
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

// Validation
export const MIN_SALARY = 0;
export const MAX_SALARY = 1000000;

// UI Constants
export const KANBAN_COLUMN_WIDTH = 320;
export const APPLICATION_CARD_HEIGHT = 200;
export const ANIMATION_DURATION = 200;

// Local Storage Keys
export const STORAGE_KEYS = {
    THEME: 'jobhunt-theme',
    FILTERS: 'jobhunt-filters',
    SORT: 'jobhunt-sort',
} as const;
