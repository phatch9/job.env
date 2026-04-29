type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const IS_DEV = import.meta.env.DEV;

class Logger {
    private prefix: string;

    constructor(prefix: string = 'job.env') {
        this.prefix = prefix;
    }

    private log(level: LogLevel, message: string, data?: any) {
        if (!IS_DEV && level === 'debug') return;

        const timestamp = new Date().toISOString();
        const color = this.getColor(level);
        const logMethod = level === 'debug' ? 'log' : level;

        console[logMethod as 'log' | 'info' | 'warn' | 'error'](
            `%c[${this.prefix}] %c[${level.toUpperCase()}] %c${timestamp}%c\n${message}`,
            `color: ${color}; font-weight: bold;`,
            `color: white; background: ${color}; padding: 2px 5px; border-radius: 3px;`,
            'color: gray; font-size: 0.8rem;',
            'color: inherit;',
            data ?? ''
        );
    }

    private getColor(level: LogLevel): string {
        switch (level) {
            case 'info': return '#3b82f6'; // blue
            case 'warn': return '#f59e0b'; // amber
            case 'error': return '#ef4444'; // red
            case 'debug': return '#8b5cf6'; // purple
            default: return '#6b7280';
        }
    }

    info(message: string, data?: any) { this.log('info', message, data); }
    warn(message: string, data?: any) { this.log('warn', message, data); }
    error(message: string, data?: any) { this.log('error', message, data); }
    debug(message: string, data?: any) { this.log('debug', message, data); }
}

export const logger = new Logger();
export default logger;
