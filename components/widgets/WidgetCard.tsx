'use client';

import React from 'react';
import { IWidgetConfig } from '@/types';
import { useAppSelector } from '@/store';
import { formatValue, formatRelativeTime } from '@/utils/formatters';
import { getFieldValue } from '@/utils/fieldParser';
import LoadingSpinner from '../ui/LoadingSpinner';

interface WidgetCardProps {
    widget: IWidgetConfig;
    onRefresh: () => void;
    onConfigure: () => void;
    onDelete: () => void;
}

export default function WidgetCard({
    widget,
    onRefresh,
    onConfigure,
    onDelete,
}: WidgetCardProps) {
    const widgetData = useAppSelector((state) => state.data.widgetData[widget.id]);
    const loading = useAppSelector((state) => state.dashboard.loading[widget.id]);
    const error = useAppSelector((state) => state.dashboard.errors[widget.id]);

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
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
            <div className="space-y-3">
                {loading && !widgetData && (
                    <div className="py-8">
                        <LoadingSpinner size="md" />
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm font-medium">
                        {error}
                    </div>
                )}

                {widgetData && !error && (
                    <>
                        {widget.selectedFields.map((field) => {
                            const value = getFieldValue(widgetData.data, field.path);
                            return (
                                <div key={field.path} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                                    <span className="text-sm text-text-secondary">{field.label}</span>
                                    <span className="text-sm font-medium text-text-primary text-right ml-4">
                                        {formatValue(value, field.type)}
                                    </span>
                                </div>
                            );
                        })}
                    </>
                )}

                {!loading && !widgetData && !error && (
                    <div className="py-4 text-center text-text-secondary text-sm">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
}
