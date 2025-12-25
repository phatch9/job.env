import { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import KanbanBoard from '@/components/KanbanBoard';
import ApplicationForm from '@/components/ApplicationForm';
import { Application, ApplicationStatus } from '@/lib/types';

export default function KanbanPage() {
  const { applications, updateStatus, deleteApplication, loading } = useApplications();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | undefined>();

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingApplication(undefined);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner" />
          <p className="text-secondary">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Kanban Board</h1>
          <p className="text-secondary">
            Drag and drop applications to update their status
          </p>
        </div>
      </div>

      <KanbanBoard
        applications={applications}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        application={editingApplication}
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
      `}</style>
    </div>
  );
}
