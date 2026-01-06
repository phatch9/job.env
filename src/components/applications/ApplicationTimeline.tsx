import { Application } from '@/lib/types';
import { format } from 'date-fns';

interface TimelineProps {
    application: Application;
}

export default function ApplicationTimeline({ application }: TimelineProps) {
    // Construct timeline events from application data
    const events = [
        {
            date: application.created_at,
            title: 'Application Created',
            type: 'created',
            description: `Started tracking application for ${application.position}`
        }
    ];

    if (application.applied_date) {
        events.push({
            date: application.applied_date,
            title: 'Applied',
            type: 'applied',
            description: 'Application submitted'
        });
    }

    if (application.interview_date) {
        events.push({
            date: application.interview_date,
            title: 'Interview',
            type: 'interview',
            description: 'Interview scheduled/completed'
        });
    }

    if (application.offer_date) {
        events.push({
            date: application.offer_date,
            title: 'Offer Received',
            type: 'offer',
            description: 'Congratulations! Offer received'
        });
    }

    if (application.rejected_date) {
        events.push({
            date: application.rejected_date,
            title: 'Rejected',
            type: 'rejected',
            description: 'Application rejected'
        });
    }

    // Sort events by date descending
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="timeline-container">
            <h3>Timeline</h3>
            <div className="timeline">
                {events.map((event, index) => (
                    <div key={index} className={`timeline-item ${event.type}`}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-content glass-card">
                            <span className="timeline-date">
                                {format(new Date(event.date), 'MMM d, yyyy')}
                            </span>
                            <h4>{event.title}</h4>
                            <p>{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .timeline-container {
                    margin-top: var(--spacing-xl);
                }
                
                .timeline {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-top: var(--spacing-lg);
                    border-left: 2px solid var(--glass-border);
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: var(--spacing-lg);
                }

                .timeline-item:last-child {
                    margin-bottom: 0;
                }

                .timeline-marker {
                    position: absolute;
                    left: -1.5rem;
                    top: 1rem;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    background: var(--bg-primary);
                    border: 2px solid var(--text-secondary);
                    transform: translateX(-50%);
                    z-index: 1;
                }

                .timeline-item.created .timeline-marker { border-color: var(--accent-secondary); background: var(--accent-secondary); }
                .timeline-item.applied .timeline-marker { border-color: var(--accent-primary); background: var(--accent-primary); }
                .timeline-item.interview .timeline-marker { border-color: var(--accent-warning); background: var(--accent-warning); }
                .timeline-item.offer .timeline-marker { border-color: var(--accent-success); background: var(--accent-success); }
                .timeline-item.rejected .timeline-marker { border-color: var(--accent-error); background: var(--accent-error); }

                .timeline-content {
                    padding: var(--spacing-md);
                    border: 1px solid var(--glass-border);
                }

                .timeline-date {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    display: block;
                    margin-bottom: 0.25rem;
                }

                .timeline-content h4 {
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                    margin-top: 0;
                }

                .timeline-content p {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
