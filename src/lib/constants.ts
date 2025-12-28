import { ApplicationStatus } from './types';

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
    wishlist: 'hsl(210, 100%, 60%)',
    applied: 'hsl(280, 100%, 65%)',
    interview: 'hsl(45, 100%, 60%)',
    offer: 'hsl(140, 100%, 45%)',
    rejected: 'hsl(0, 80%, 60%)',
};

export const STATUS_ICONS: Record<ApplicationStatus, string> = {
    wishlist: '⭐',
    applied: '📤',
    interview: '💼',
    offer: '🎉',
    rejected: '❌',
};

export const STATUS_DESCRIPTIONS: Record<ApplicationStatus, string> = {
    wishlist: 'Jobs you\'re interested in',
    applied: 'Applications submitted',
    interview: 'Interview scheduled or completed',
    offer: 'Offer received',
    rejected: 'Application rejected',
};

// Validation constants
export const MIN_SALARY = 0;
export const MAX_SALARY = 10000000;
export const MAX_POSITION_LENGTH = 200;
export const MAX_COMPANY_NAME_LENGTH = 200;
export const MAX_LOCATION_LENGTH = 200;
export const MAX_NOTE_LENGTH = 10000;

// UI constants
export const KANBAN_COLUMN_WIDTH = 320;
export const APPLICATION_CARD_HEIGHT = 200;
export const DEBOUNCE_DELAY = 300;

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

// Z-index layers
export const Z_INDEX = {
    modal: 1000,
    dropdown: 100,
    header: 50,
    overlay: 999,
};

// Breakpoints (in pixels)
export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
};

// Animation durations (in ms)
export const ANIMATION_DURATION = {
    fast: 150,
    base: 300,
    slow: 500,
};
