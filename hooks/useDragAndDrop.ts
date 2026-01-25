'use client';

import { useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { IWidgetConfig } from '@/types';
import { useAppDispatch } from '@/store';
import { reorderWidgets } from '@/store/dashboardSlice';

export default function useDragAndDrop(widgets: IWidgetConfig[]) {
    const dispatch = useAppDispatch();
    const handleDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        if (sourceIndex === destinationIndex) return;
        const newWidgets = Array.from(widgets);
        const [reorderedItem] = newWidgets.splice(sourceIndex, 1);
        newWidgets.splice(destinationIndex, 0, reorderedItem);

        // Update positions
        const updatedWidgets = newWidgets.map((w, index) => ({
            ...w,
            position: index,
        }));
        dispatch(reorderWidgets(updatedWidgets));
    }, [widgets, dispatch]);
    return { handleDragEnd };
}
