'use client';

import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { IWidgetConfig, ChartType, ChartInterval } from '@/types';
import { useAppSelector } from '@/store';
import { formatValue, formatRelativeTime } from '@/utils/formatters';
import { getFieldValue } from '@/utils/fieldParser';
import LoadingSpinner from '../ui/LoadingSpinner';

interface WidgetChartProps {
    widget: IWidgetConfig;
    onRefresh: () => void;
    onConfigure: () => void;
    onDelete: () => void;
}

export default function WidgetChart({
    widget,
    onRefresh,
    onConfigure,
    onDelete,
}: WidgetChartProps) {
    const widgetData = useAppSelector((state) => state.data.widgetData[widget.id]);
    const loading = useAppSelector((state) => state.dashboard.loading[widget.id]);
    const error = useAppSelector((state) => state.dashboard.errors[widget.id]);

    // Find array field for data points
    const arrayField = useMemo(() => {
        if (!widgetData?.data) return null;
        if (Array.isArray(widgetData.data)) return null;

        return widget.selectedFields.find((f) => {
            const value = getFieldValue(widgetData.data, f.path);
            return Array.isArray(value);
        });
    }, [widgetData, widget.selectedFields]);

    // Extract chart data
    const chartData = useMemo(() => {
        if (!widgetData?.data) return [];

        // 1. Root is array
        if (Array.isArray(widgetData.data)) {
            return widgetData.data;
        }

        // 2. Use identified array field
        if (arrayField) {
            const data = getFieldValue(widgetData.data, arrayField.path);
            return Array.isArray(data) ? data : [];
        }

        // 3. Fallback: Create virtual array from selected numeric fields
        const numericFields = widget.selectedFields.filter(f => {
            const value = getFieldValue(widgetData.data, f.path);
            return typeof value === 'number' || (!isNaN(parseFloat(value)) && isFinite(value));
        });

        if (numericFields.length > 0) {
            return numericFields.map(f => ({
                name: f.label,
                value: parseFloat(getFieldValue(widgetData.data, f.path))
            }));
        }

        return [];
    }, [widgetData, widget.selectedFields, arrayField]);

    // Identify X and Y axis fields
    const { dataKeys, xAxisKey } = useMemo(() => {
        if (widget.selectedFields.length === 0) return { dataKeys: [], xAxisKey: '' };

        // Handle virtual array case (Fallback 3)
        if (chartData.length > 0 && chartData[0]?.name !== undefined && chartData[0]?.value !== undefined) {
            return {
                dataKeys: [{ key: 'value', label: 'Value', color: '#14b8a6' }],
                xAxisKey: 'name'
            };
        }

        const keys: { key: string; label: string; color: string }[] = [];
        let xKey = '';
        const colors = ['#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6'];

        widget.selectedFields.forEach((field) => {
            const relativePath = arrayField ? field.path.replace(arrayField.path + '.', '') : field.path;

            if (field.type === 'date' || field.label.toLowerCase().includes('date') || field.label.toLowerCase().includes('time')) {
                xKey = relativePath;
            } else if (!field.isArray || Array.isArray(widgetData?.data)) {
                keys.push({
                    key: relativePath,
                    label: field.label,
                    color: colors[keys.length % colors.length],
                });
            }
        });

        return { dataKeys: keys, xAxisKey: xKey };
    }, [widget.selectedFields, chartData, widgetData, arrayField]);


    return (
        <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary">{widget.name}</h3>
                    {widgetData && (
                        <p className="text-xs text-text-secondary mt-1">
                            Last updated: {formatRelativeTime(widgetData.timestamp)}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2 text-text-secondary hover:text-primary-500 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button
                        onClick={onConfigure}
                        className="p-2 text-text-secondary hover:text-primary-500 transition-colors"
                        title="Configure"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 min-h-[300px]">
                {loading && !widgetData && (
                    <div className="h-full flex items-center justify-center">
                        <LoadingSpinner size="md" />
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm font-medium">
                        {error}
                    </div>
                )}

                {widgetData && !error && chartData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke="#64748b"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(val) => {
                                    try {
                                        return new Date(val).toLocaleDateString();
                                    } catch {
                                        return val;
                                    }
                                }}
                            />
                            <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-bg)',
                                    borderColor: 'var(--color-border)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    color: 'var(--color-text-primary)'
                                }}
                                itemStyle={{ color: 'var(--color-text-primary)' }}
                            />
                            <Legend />
                            {dataKeys.map((item) => (
                                <Line
                                    key={item.key}
                                    type="monotone"
                                    dataKey={item.key}
                                    name={item.label}
                                    stroke={item.color}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {!loading && !widgetData && !error && (
                    <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                        No data available
                    </div>
                )}

                {widgetData && !error && chartData.length === 0 && (
                    <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                        No chart data found. Ensure you selected an array field.
                    </div>
                )}
            </div>
        </div>
    );
}
