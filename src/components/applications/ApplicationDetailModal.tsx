import { Application } from '@/lib/types';
import Modal from '@/components/Modal';
import ApplicationTimeline from './ApplicationTimeline';
import { STATUS_LABELS, STATUS_COLORS, STATUS_ICONS } from '@/lib/constants';

interface ApplicationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: Application;
    onEdit: () => void;
}

export default function ApplicationDetailModal({ isOpen, onClose, application, onEdit }: ApplicationDetailModalProps) {
    if (!application) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${application.position} at ${application.company?.name}`}
        >
            <div className="detail-container">
                <div className="detail-header glass-card">
                    <div className="header-content">
                        <div className="status-badge" style={{ backgroundColor: STATUS_COLORS[application.status] }}>
                            {STATUS_ICONS[application.status]} {STATUS_LABELS[application.status]}
                        </div>
                        <div className="meta-info">
                            {application.location && <span>📍 {application.location}</span>}
                            {application.salary && <span>💰 ${application.salary.toLocaleString()}</span>}
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => { onEdit(); onClose(); }}>
                        Edit Application
                    </button>
                </div>

                <div className="detail-grid">
                    <div className="timeline-section">
                        <ApplicationTimeline application={application} />
                    </div>
                </div>
            </div>

            <style>{`
                .detail-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-md);
                }

                .header-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }

                .meta-info {
                    display: flex;
                    gap: var(--spacing-md);
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 1rem;
                    font-weight: 600;
                    color: white;
                    align-self: flex-start;
                }
            `}</style>
        </Modal>
    );
}
