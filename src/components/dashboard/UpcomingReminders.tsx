import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { remindersApi } from '@/lib/api/reminders';
import { Reminder } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { CheckIcon, PlusIcon, CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

export default function UpcomingReminders() {
    const { user } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReminders = async () => {
        if (!user) return;
        try {
            const data = await remindersApi.getUpcoming();
            setReminders(data);
        } catch (error) {
            console.error('Failed to fetch reminders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, [user]);

    const handleComplete = async (id: string) => {
        try {
            await remindersApi.toggleComplete(id, true);
            setReminders(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Failed to complete reminder:', error);
        }
    };

    if (loading) return <div className="glass-card p-6">Loading...</div>;

    return (
        <div className="glass-card reminder-widget">
            <div className="widget-header">
                <h3>Upcoming Reminders</h3>
                <button className="btn btn-ghost btn-sm btn-icon">
                    <PlusIcon />
                </button>
            </div>

            <div className="reminder-list">
                {reminders.length === 0 ? (
                    <div className="empty-reminders">
                        <p className="text-secondary text-sm">No upcoming reminders</p>
                    </div>
                ) : (
                    reminders.map(reminder => (
                        <div key={reminder.id} className="reminder-item">
                            <button
                                className="check-circle"
                                onClick={() => handleComplete(reminder.id)}
                            >
                                <CheckIcon className="icon" />
                            </button>
                            <div className="reminder-content">
                                <p className="reminder-title">{reminder.title}</p>
                                <div className="reminder-meta">
                                    <span className="reminder-date">
                                        <CalendarIcon className="w-3 h-3 inline mr-1" />
                                        {format(new Date(reminder.due_date), 'MMM d')}
                                    </span>
                                    {reminder.application && (
                                        <Link
                                            to={`/applications?id=${reminder.application_id}`}
                                            className="reminder-link badge badge-secondary"
                                        >
                                            {reminder.application.company?.name}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .reminder-widget {
                    padding: var(--spacing-lg);
                    height: 100%;
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }

                .widget-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }

                .reminder-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .reminder-item {
                    display: flex;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-sm);
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-md);
                    transition: background var(--transition-fast);
                }

                .reminder-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .check-circle {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid var(--text-tertiary);
                    background: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: 0;
                    margin-top: 2px;
                    transition: all var(--transition-fast);
                }

                .check-circle:hover {
                    border-color: var(--accent-success);
                    color: var(--accent-success);
                }

                .check-circle .icon {
                    opacity: 0;
                    transform: scale(0.5);
                    transition: all var(--transition-fast);
                }

                .check-circle:hover .icon {
                    opacity: 1;
                    transform: scale(1);
                }

                .reminder-content {
                    flex: 1;
                }

                .reminder-title {
                    margin: 0 0 4px 0;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .reminder-meta {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .reminder-link {
                    font-size: 0.7rem;
                    padding: 2px 6px;
                    text-decoration: none;
                }
            `}</style>
        </div>
    );
}
