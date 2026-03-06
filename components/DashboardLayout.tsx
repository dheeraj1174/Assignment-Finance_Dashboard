    'use client';

    import React, { useState, useEffect } from 'react';
    import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
    import { useAppSelector, useAppDispatch } from '@/store';
    import { IWidgetConfig } from '@/types';
    import { addWidget, updateWidget } from '@/store/dashboardSlice';
    import useDragAndDrop from '@/hooks/useDragAndDrop';
    import Header from './Header';
    import AddWidgetModal from './AddWidgetModal';
    import WidgetContainer from './widgets/WidgetContainer';
    import EmptyState from './ui/EmptyState';
    import Button from './ui/Button';

    export default function DashboardLayout() {
        const dispatch = useAppDispatch();
        const widgets = useAppSelector((state) => state.dashboard.widgets);
        const theme = useAppSelector((state) => state.theme.mode);

        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingWidget, setEditingWidget] = useState<IWidgetConfig | null>(null);
        const { handleDragEnd } = useDragAndDrop(widgets);

        // Strict mode support for react-beautiful-dnd
        const [enabled, setEnabled] = useState(false);
        useEffect(() => {
            const animation = requestAnimationFrame(() => setEnabled(true));
            return () => {
                cancelAnimationFrame(animation);
                setEnabled(false);
            };
        }, []);

        const handleSaveWidget = (widget: IWidgetConfig) => {
            if (editingWidget) {
                dispatch(updateWidget(widget));
            } else {
                dispatch(addWidget(widget));
            }
            setIsModalOpen(false);
            setEditingWidget(null);
        };

        const handleEditWidget = (widget: IWidgetConfig) => {
            setEditingWidget(widget);
            setIsModalOpen(true);
        };

        const handleAddClick = () => {
            setEditingWidget(null);
            setIsModalOpen(true);
        };

        if (!enabled) {
            return null;
        }

        return (
            <div className={`min-h-screen bg-background text-text-primary ${theme}`}>
                <Header onAddWidget={handleAddClick} />

                <main className="container mx-auto px-4 py-8">
                    {widgets.length === 0 ? (
                        <EmptyState
                            action={
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleAddClick}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create First Widget
                                </Button>
                            }
                        />
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="dashboard-grid" direction="horizontal">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                    >
                                        {widgets.map((widget, index) => (
                                            <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                                        }}
                                                        className="h-full"
                                                    >
                                                        <WidgetContainer widget={widget} onEdit={() => handleEditWidget(widget)} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </main>

                <AddWidgetModal
                    isOpen={isModalOpen}
                    initialWidget={editingWidget}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingWidget(null);
                    }}
                    onSave={handleSaveWidget}
                />
            </div>
        );
    }
