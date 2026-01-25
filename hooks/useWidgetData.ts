'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setWidgetData, updateTimestamp } from '@/store/dataSlice';
import { setWidgetLoading, setWidgetError } from '@/store/dashboardSlice';
import { fetchWidgetData } from '@/utils/apiClient';
import { getCachedData, setCachedData, getWidgetCacheKey } from '@/utils/cacheManager';
import { IWidgetConfig } from '@/types';

export default function useWidgetData(widget: IWidgetConfig) {
    const dispatch = useAppDispatch();
    const widgetData = useAppSelector((state) => state.data.widgetData[widget.id]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async (ignoreCache = false) => {
        // Check cache first if not ignoring
        if (!ignoreCache) {
            const cacheKey = getWidgetCacheKey(widget.id, widget.apiUrl);
            const cached = getCachedData(cacheKey);

            if (cached) {
                dispatch(setWidgetData({
                    widgetId: widget.id,
                    data: cached,
                    timestamp: Date.now()
                }));
                return;
            }
        }

        dispatch(setWidgetLoading({ id: widget.id, loading: true }));

        try {
            const response = await fetchWidgetData(widget.apiUrl);

            if (response.success && response.data) {
                // Update data
                dispatch(setWidgetData({
                    widgetId: widget.id,
                    data: response.data,
                    timestamp: Date.now()
                }));

                // Update cache
                const cacheKey = getWidgetCacheKey(widget.id, widget.apiUrl);
                setCachedData(cacheKey, response.data);

                // Clear error if any
                dispatch(setWidgetError({ id: widget.id, error: '' }));
            } else {
                dispatch(setWidgetError({ id: widget.id, error: response.error || 'Failed to fetch data' }));
            }
        } catch (error) {
            dispatch(setWidgetError({ id: widget.id, error: 'An unexpected error occurred' }));
        } finally {
            dispatch(setWidgetLoading({ id: widget.id, loading: false }));
        }
    }, [dispatch, widget.id, widget.apiUrl]);

    // Initial fetch and interval setup
    useEffect(() => {
        fetchData();

        // Set up refresh interval
        if (widget.refreshInterval > 0) {
            intervalRef.current = setInterval(() => {
                // Only refresh if tab is visible
                if (!document.hidden) {
                    fetchData(true); // Ignore cache for auto-refresh
                }
            }, widget.refreshInterval * 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchData, widget.refreshInterval]); // Dependencies for effect

    // Manual refresh function
    const refresh = useCallback(() => {
        fetchData(true);
    }, [fetchData]);

    return {
        data: widgetData,
        refresh
    };
}
