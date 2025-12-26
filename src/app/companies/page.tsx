import { useState } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { useApplications } from '@/hooks/useApplications';
import { Company } from '@/lib/types';
import CompanyCard from '@/components/CompanyCard';
import CompanyForm from '@/components/CompanyForm';

export default function CompaniesPage() {
  const { companies, deleteCompany, loading } = useCompanies();
  const { applications } = useApplications();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company? This will also delete all associated applications.')) {
      try {
        await deleteCompany(id);
      } catch (error) {
        console.error('Failed to delete company:', error);
        alert('Failed to delete company. It may have associated applications.');
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompany(undefined);
  };

  const getApplicationCount = (companyId: string) => {
    return applications.filter((app) => app.company_id === companyId).length;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner" />
          <p className="text-secondary">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Companies</h1>
          <p className="text-secondary">
            Manage companies you're interested in or have applied to
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
          <span>➕</span>
          <span>Add Company</span>
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-icon">🏢</div>
          <h2>No Companies Yet</h2>
          <p className="text-secondary">
            Start by adding companies you're interested in applying to
          </p>
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            Add Your First Company
          </button>
        </div>
      ) : (
        <div className="companies-grid">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              applicationCount={getApplicationCount(company.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CompanyForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        company={editingCompany}
      />

      <style>{`
        .page-container {
          min-height: 100vh;
          padding: var(--spacing-xl);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-xl);
        }

        .page-header h1 {
          margin-bottom: var(--spacing-xs);
        }

        .page-header .btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-lg);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          max-width: 500px;
          margin: var(--spacing-2xl) auto;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .empty-state h2 {
          margin-bottom: var(--spacing-md);
        }

        .empty-state .btn {
          margin-top: var(--spacing-lg);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: var(--spacing-lg);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .page-header .btn {
            width: 100%;
          }

          .companies-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
