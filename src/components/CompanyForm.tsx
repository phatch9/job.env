import { useState, FormEvent } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { Company, CompanyFormData } from '@/lib/types';
import Modal from './Modal';

interface CompanyFormProps {
    isOpen: boolean;
    onClose: () => void;
    company?: Company;
}

export default function CompanyForm({ isOpen, onClose, company }: CompanyFormProps) {
    const { createCompany, updateCompany } = useCompanies();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CompanyFormData>({
        name: company?.name || '',
        website: company?.website || '',
        description: company?.description || '',
        location: company?.location || '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (company) {
                await updateCompany(company.id, formData);
            } else {
                await createCompany(formData);
            }
            onClose();
            // Reset form
            setFormData({ name: '', website: '', description: '', location: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save company');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={company ? 'Edit Company' : 'Add Company'}
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Company Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g. Google, Microsoft, Startup Inc."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="website" className="form-label">
                        Website
                    </label>
                    <input
                        id="website"
                        type="url"
                        className="form-input"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://company.com"
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
                        placeholder="e.g. San Francisco, CA"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the company..."
                        rows={4}
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
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
                    </button>
                </div>
            </form>

            <style>{`
        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--glass-border);
        }
      `}</style>
        </Modal>
    );
}
