import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Application, ApplicationStatus } from '@/lib/types';
import { STATUS_LABELS, STATUS_COLORS, STATUS_ICONS, APPLICATION_STATUSES } from '@/lib/constants';
import ApplicationCard from './ApplicationCard';

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit?: (application: Application) => void;
  onDelete?: (id: string) => void;
}

export default function KanbanBoard({
  applications,
  onStatusChange,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId as ApplicationStatus;
    onStatusChange(draggableId, newStatus);
  };

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {APPLICATION_STATUSES.map((status) => {
          const statusApplications = getApplicationsByStatus(status);
          return (
            <div key={status} className="kanban-column">
              <div className="column-header" style={{ borderTopColor: STATUS_COLORS[status] }}>
                <div className="column-title">
                  <span className="column-icon">{STATUS_ICONS[status]}</span>
                  <h3>{STATUS_LABELS[status]}</h3>
                </div>
                <span className="column-count">{statusApplications.length}</span>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {statusApplications.length === 0 ? (
                      <div className="empty-column">
                        <p className="text-secondary">No applications</p>
                      </div>
                    ) : (
                      statusApplications.map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'dragging' : ''}
                            >
                              <ApplicationCard
                                application={app}
                                onEdit={onEdit}
                                onDelete={onDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>

      <style>{`
        .kanban-board {
          display: flex;
          gap: var(--spacing-lg);
          overflow-x: auto;
          padding-bottom: var(--spacing-lg);
          min-height: 600px;
        }

        .kanban-column {
          flex: 0 0 320px;
          display: flex;
          flex-direction: column;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(12px);
          max-height: calc(100vh - 200px);
        }

        .column-header {
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid var(--glass-border);
          border-top: 3px solid;
          border-top-left-radius: var(--radius-lg);
          border-top-right-radius: var(--radius-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .column-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .column-icon {
          font-size: 1.25rem;
        }

        .column-title h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .column-count {
          background: var(--glass-bg);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .column-content {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          transition: background-color var(--transition-fast);
        }

        .column-content.dragging-over {
          background: rgba(168, 85, 247, 0.1);
        }

        .empty-column {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          border: 2px dashed var(--glass-border);
          border-radius: var(--radius-md);
        }

        .dragging {
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .kanban-board {
            flex-direction: column;
          }

          .kanban-column {
            flex: 1;
            max-height: none;
          }
        }
      `}</style>
    </DragDropContext>
  );
}
