import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReminders } from '@/hooks/useReminders';
import { useApplications } from '@/hooks/useApplications';
import Modal from '@/components/Modal';
import { CheckIcon, PlusIcon, CalendarIcon, TrashIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

export default function UpcomingReminders() {
    const { reminders, loading, createReminder, toggleComplete, deleteReminder } = useReminders();
    const { applications } = useApplications();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReminder, setNewReminder] = useState({
        title: '',
        due_date: new Date().toISOString().split('T')[0],
        application_id: ''
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createReminder({
                ...newReminder,
                completed: false
            });
            setIsModalOpen(false);
            setNewReminder({
                title: '',
                due_date: new Date().toISOString().split('T')[0],
                application_id: ''
            });
        } catch (error) {
            console.error('Failed to create reminder:', error);
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await toggleComplete(id, true);
        } catch (error) {
            console.error('Failed to complete reminder:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this reminder?')) {
            try {
                await deleteReminder(id);
            } catch (error) {
                console.error('Failed to delete reminder:', error);
            }
        }
    };

    const upcomingReminders = reminders
        .filter(r => !r.completed)
        .slice(0, 5);

    if (loading) return (
        <div className="glass-card reminder-widget loading">
            <div className="spinner-sm" />
            <p>Loading reminders...</p>
        </div>
    );

    return (
        <div className="glass-card reminder-widget">
            <div className="widget-header">
                <div className="title-area">
                    <h3>Upcoming Reminders</h3>
                    <span className="badge badge-secondary">{upcomingReminders.length}</span>
                </div>
                <button 
                    className="btn btn-ghost btn-sm btn-icon" 
                    onClick={() => setIsModalOpen(true)}
                    title="Add Reminder"
                >
                    <PlusIcon />
                </button>
            </div>

            <div className="reminder-list">
                {upcomingReminders.length === 0 ? (
                    <div className="empty-reminders">
                        <div className="empty-icon">🔔</div>
                        <p className="text-secondary text-sm">No upcoming reminders</p>
                        <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(true)}>
                            Create one
                        </button>
                    </div>
                ) : (
                    upcomingReminders.map(reminder => (
                        <div key={reminder.id} className="reminder-item glass-hover">
                            <button
                                className="check-circle"
                                onClick={() => handleComplete(reminder.id)}
                                title="Mark as complete"
                            >
                                <CheckIcon className="icon" />
                            </button>
                            <div className="reminder-content">
                                <p className="reminder-title">{reminder.title}</p>
                                <div className="reminder-meta">
                                    <span className="reminder-date">
                                        <CalendarIcon className="meta-icon" />
                                        {format(new Date(reminder.due_date), 'MMM d')}
                                    </span>
                                    {reminder.application && (
                                        <Link
                                            to={`/applications?id=${reminder.application_id}`}
                                            className="reminder-link badge badge-secondary"
                                        >
                                            {reminder.application.company?.name || 'Application'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <button 
                                className="delete-btn" 
                                onClick={() => handleDelete(reminder.id)}
                                title="Delete reminder"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Reminder Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Reminder"
            >
                <form onSubmit={handleCreate} className="reminder-form">
                    <div className="form-group">
                        <label className="form-label">Task Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., Follow up on application"
                            required
                            value={newReminder.title}
                            onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                            type="date"
                            className="form-input"
                            required
                            value={newReminder.due_date}
                            onChange={e => setNewReminder({ ...newReminder, due_date: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Link to Application (Optional)</label>
                        <select
                            className="form-select"
                            value={newReminder.application_id}
                            onChange={e => setNewReminder({ ...newReminder, application_id: e.target.value })}
                        >
                            <option value="">None</option>
                            {applications.map(app => (
                                <option key={app.id} value={app.id}>
                                    {app.position} @ {app.company?.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Reminder
                        </button>
                    </div>
                </form>
            </Modal>

            <style>{`
                .reminder-widget {
                    padding: var(--spacing-lg);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .reminder-widget.loading {
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-md);
                    color: var(--text-secondary);
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                }

                .title-area {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }

                .widget-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .reminder-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                    flex: 1;
                }

                .reminder-item {
                    display: flex;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-md);
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: var(--radius-lg);
                    border: 1px solid transparent;
                    transition: all var(--transition-base);
                    position: relative;
                    group: hover;
                }

                .reminder-item:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: var(--glass-border);
                    transform: translateX(4px);
                }

                .check-circle {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid var(--text-tertiary);
                    background: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: 0;
                    margin-top: 2px;
                    transition: all var(--transition-base);
                    color: transparent;
                }

                .check-circle:hover {
                    border-color: var(--accent-success);
                    color: var(--accent-success);
                    background: rgba(0, 255, 100, 0.1);
                }

                .check-circle .icon {
                    width: 14px;
                    height: 14px;
                }

                .reminder-content {
                    flex: 1;
                }

                .reminder-title {
                    margin: 0 0 6px 0;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .reminder-meta {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .reminder-date {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .meta-icon {
                    width: 12px;
                    height: 12px;
                }

                .reminder-link {
                    font-size: 0.7rem;
                    padding: 2px 8px;
                    text-decoration: none;
                }

                .delete-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    padding: 4px;
                    opacity: 0;
                    transition: all var(--transition-fast);
                    border-radius: var(--radius-sm);
                }

                .reminder-item:hover .delete-btn {
                    opacity: 1;
                }

                .delete-btn:hover {
                    color: var(--accent-error);
                    background: rgba(255, 0, 0, 0.1);
                }

                .empty-reminders {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-2xl) var(--spacing-xl);
                    text-align: center;
                    gap: var(--spacing-sm);
                }

                .empty-icon {
                    font-size: 2rem;
                    margin-bottom: var(--spacing-sm);
                    opacity: 0.5;
                }

                .reminder-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-md);
                }

                .spinner-sm {
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--glass-border);
                    border-top-color: var(--accent-primary);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
