import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Application, ApplicationStatus, KanbanColumn } from '@/lib/types';
import { APPLICATION_STATUSES, STATUS_LABELS, STATUS_COLORS, STATUS_ICONS } from '@/lib/constants';
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
    const [columns, setColumns] = useState<KanbanColumn[]>([]);

    // Organize applications into columns
    useEffect(() => {
        const newColumns: KanbanColumn[] = APPLICATION_STATUSES.map((status) => ({
            id: status,
            title: STATUS_LABELS[status],
            applications: applications.filter((app) => app.status === status),
        }));
        setColumns(newColumns);
    }, [applications]);

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // Dropped outside the list
        if (!destination) return;

        // Dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as ApplicationStatus;
        onStatusChange(draggableId, newStatus);
    };

    return (
        <div className="kanban-board">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-columns">
                    {columns.map((column) => (
                        <div key={column.id} className="kanban-column">
                            <div className="column-header">
                                <div className="column-title">
                                    <span className="column-icon">{STATUS_ICONS[column.id]}</span>
                                    <h3>{column.title}</h3>
                                    <span className="column-count">{column.applications.length}</span>
                                </div>
                                <div
                                    className="column-indicator"
                                    style={{ backgroundColor: STATUS_COLORS[column.id] }}
                                />
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''
                                            }`}
                                    >
                                        {column.applications.map((application, index) => (
                                            <Draggable
                                                key={application.id}
                                                draggableId={application.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''
                                                            }`}
                                                    >
                                                        <ApplicationCard
                                                            application={application}
                                                            onEdit={onEdit}
                                                            onDelete={onDelete}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {column.applications.length === 0 && (
                                            <div className="empty-column">
                                                <p className="text-tertiary text-sm">
                                                    No applications yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            <style>{`
        .kanban-board {
          width: 100%;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding: var(--spacing-lg);
        }

        .kanban-columns {
          display: flex;
          gap: var(--spacing-lg);
          min-height: calc(100vh - 200px);
        }

        .kanban-column {
          flex: 0 0 320px;
          display: flex;
          flex-direction: column;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(var(--glass-blur));
          padding: var(--spacing-md);
          max-height: calc(100vh - 220px);
        }

        .column-header {
          margin-bottom: var(--spacing-md);
        }

        .column-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .column-icon {
          font-size: 1.25rem;
        }

        .column-title h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .column-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 var(--spacing-xs);
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
        }

        .column-indicator {
          height: 3px;
          border-radius: var(--radius-sm);
        }

        .column-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          padding: var(--spacing-xs);
          margin: calc(var(--spacing-xs) * -1);
          min-height: 100px;
          transition: background-color var(--transition-base);
        }

        .column-content.dragging-over {
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
        }

        .draggable-item {
          transition: transform var(--transition-fast);
        }

        .draggable-item.dragging {
          transform: rotate(2deg);
          opacity: 0.9;
        }

        .empty-column {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          text-align: center;
          border: 2px dashed var(--glass-border);
          border-radius: var(--radius-md);
          min-height: 120px;
        }

        /* Scrollbar for columns */
        .column-content::-webkit-scrollbar {
          width: 6px;
        }

        .column-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .column-content::-webkit-scrollbar-thumb {
          background: var(--glass-bg);
          border-radius: var(--radius-sm);
        }

        .column-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .kanban-board {
            padding: var(--spacing-md);
          }

          .kanban-column {
            flex: 0 0 280px;
          }
        }
      `}</style>
        </div>
    );
}
