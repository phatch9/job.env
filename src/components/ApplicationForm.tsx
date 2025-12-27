import { useState, FormEvent } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { useCompanies } from '@/hooks/useCompanies';
import { Application, ApplicationFormData, ApplicationStatus } from '@/lib/types';
import { APPLICATION_STATUSES, STATUS_LABELS } from '@/lib/constants';
import Modal from './Modal';

interface ApplicationFormProps {
    isOpen: boolean;
    onClose: () => void;
    application?: Application;
}

export default function ApplicationForm({ isOpen, onClose, application }: ApplicationFormProps) {
    const { createApplication, updateApplication } = useApplications();
    const { companies } = useCompanies();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ApplicationFormData>({
        company_id: application?.company_id || '',
        position: application?.position || '',
        status: application?.status || 'wishlist',
        salary: application?.salary || undefined,
        location: application?.location || '',
        job_url: application?.job_url || '',
        applied_date: application?.applied_date || '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (application) {
                await updateApplication(application.id, formData);
            } else {
                await createApplication(formData);
            }
            onClose();
            // Reset form
            setFormData({
                company_id: '',
                position: '',
                status: 'wishlist',
                salary: undefined,
                location: '',
                job_url: '',
                applied_date: '',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={application ? 'Edit Application' : 'Add Application'}
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="company_id" className="form-label">
                        Company *
                    </label>
                    <select
                        id="company_id"
                        className="form-select"
                        value={formData.company_id}
                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                        required
                    >
                        <option value="">Select a company</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                    {companies.length === 0 && (
                        <p className="text-xs text-tertiary" style={{ marginTop: 'var(--spacing-xs)' }}>
                            No companies yet. Add a company first!
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="position" className="form-label">
                        Position *
                    </label>
                    <input
                        id="position"
                        type="text"
                        className="form-input"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                        placeholder="e.g. Senior Software Engineer"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status" className="form-label">
                        Status *
                    </label>
                    <select
                        id="status"
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                        required
                    >
                        {APPLICATION_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="salary" className="form-label">
                            Salary
                        </label>
                        <input
                            id="salary"
                            type="number"
                            className="form-input"
                            value={formData.salary || ''}
                            onChange={(e) => setFormData({ ...formData, salary: e.target.value ? parseInt(e.target.value) : undefined })}
                            placeholder="e.g. 120000"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location" className="form-label">
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            className="form-input"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Remote, NYC"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="job_url" className="form-label">
                        Job Posting URL
                    </label>
                    <input
                        id="job_url"
                        type="url"
                        className="form-input"
                        value={formData.job_url}
                        onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                        placeholder="https://company.com/jobs/123"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="applied_date" className="form-label">
                        Applied Date
                    </label>
                    <input
                        id="applied_date"
                        type="date"
                        className="form-input"
                        value={formData.applied_date ? new Date(formData.applied_date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                    />
                </div>

                {error && (
                    <div className="form-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading || companies.length === 0}>
                        {loading ? 'Saving...' : application ? 'Update Application' : 'Add Application'}
                    </button>
                </div>
            </form>

            <style>{`
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--glass-border);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </Modal>
    );
}
