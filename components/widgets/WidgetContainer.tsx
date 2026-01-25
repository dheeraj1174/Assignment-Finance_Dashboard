'use client';

import React, { useCallback, useEffect } from 'react';
import { IWidgetConfig, DisplayMode } from '@/types';
import { useAppDispatch } from '@/store';
import { removeWidget } from '@/store/dashboardSlice';
import useWidgetData from '@/hooks/useWidgetData';
import WidgetCard from './WidgetCard';
import WidgetTable from './WidgetTable';
import WidgetChart from './WidgetChart';

interface WidgetContainerProps {
    widget: IWidgetConfig;
    onEdit: () => void;
}

export default function WidgetContainer({ widget, onEdit }: WidgetContainerProps) {
    const dispatch = useAppDispatch();
    const { refresh } = useWidgetData(widget);

    const handleDelete = useCallback(() => {
        if (confirm('Are you sure you want to delete this widget?')) {
            dispatch(removeWidget(widget.id));
        }
    }, [dispatch, widget.id]);

    switch (widget.displayMode) {
        case DisplayMode.CARD:
            return (
                <WidgetCard
                    widget={widget}
                    onRefresh={refresh}
                    onConfigure={onEdit}
                    onDelete={handleDelete}
                />
            );
        case DisplayMode.TABLE:
            return (
                <WidgetTable
                    widget={widget}
                    onRefresh={refresh}
                    onConfigure={onEdit}
                    onDelete={handleDelete}
                />
            );
        case DisplayMode.CHART:
            return (
                <WidgetChart
                    widget={widget}
                    onRefresh={refresh}
                    onConfigure={onEdit}
                    onDelete={handleDelete}
                />
            );
        default:
            return null;
    }
}
