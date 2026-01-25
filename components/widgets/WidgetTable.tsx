'use client';

import React, { useState, useMemo } from 'react';
import { IWidgetConfig } from '@/types';
import { useAppSelector } from '@/store';
import { formatValue, formatRelativeTime } from '@/utils/formatters';
import { getFieldValue } from '@/utils/fieldParser';
import LoadingSpinner from '../ui/LoadingSpinner';
import Input from '../ui/Input';

interface WidgetTableProps {
    widget: IWidgetConfig;
    onRefresh: () => void;
    onConfigure: () => void;
    onDelete: () => void;
}

export default function WidgetTable({
    widget,
    onRefresh,
    onConfigure,
    onDelete,
}: WidgetTableProps) {
    const widgetData = useAppSelector((state) => state.data.widgetData[widget.id]);
    const loading = useAppSelector((state) => state.dashboard.loading[widget.id]);
    const error = useAppSelector((state) => state.dashboard.errors[widget.id]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const itemsPerPage = 6;

    // Find the primary array field
    const arrayField = useMemo(() => {
        if (!widgetData?.data) return null;
        if (Array.isArray(widgetData.data)) return null;

        return widget.selectedFields.find((f) => {
            const value = getFieldValue(widgetData.data, f.path);
            return Array.isArray(value);
        });
    }, [widgetData, widget.selectedFields]);

    // Extract table data from widget data
    const tableData = useMemo(() => {
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

        // 3. Fallback: If no array is found, treat the current data as a single-row array
        return [widgetData.data];
    }, [widgetData, widget.selectedFields, arrayField]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let filtered = tableData;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter((row: any) =>
                widget.selectedFields.some((field) => {
                    const value = getFieldValue(row, field.path.split('.').pop() || '');
                    return String(value).toLowerCase().includes(searchQuery.toLowerCase());
                })
            );
        }

        // Sort
        if (sortField) {
            filtered = [...filtered].sort((a: any, b: any) => {
                const aVal = getFieldValue(a, sortField.split('.').pop() || '');
                const bVal = getFieldValue(b, sortField.split('.').pop() || '');

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [tableData, searchQuery, sortField, sortDirection, widget.selectedFields]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (fieldPath: string) => {
        if (sortField === fieldPath) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(fieldPath);
            setSortDirection('asc');
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
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

            {/* Search */}
            {!loading && !error && tableData.length > 0 && (
                <div className="p-4 border-b border-border">
                    <Input
                        placeholder="Search table..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            )}

            {/* Content */}
            <div className="p-5">
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

                {widgetData && !error && tableData.length > 0 && (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        {widget.selectedFields.map((field) => (
                                            <th
                                                key={field.path}
                                                className="text-left py-3 px-4 text-sm font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                                                onClick={() => handleSort(field.path)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {field.label}
                                                    {sortField === field.path && (
                                                        <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((row: any, index: number) => (
                                        <tr key={index} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                                            {widget.selectedFields.map((field) => {
                                                const relativePath = arrayField ? field.path.replace(arrayField.path + '.', '') : field.path;
                                                const value = getFieldValue(row, relativePath);
                                                return (
                                                    <td key={field.path} className="py-3 px-4 text-sm text-text-primary">
                                                        {formatValue(value, field.type)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-text-secondary">
                                {filteredData.length} of {tableData.length} items
                            </p>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-text-secondary">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {!loading && !widgetData && !error && (
                    <div className="py-4 text-center text-text-secondary text-sm">
                        No data available
                    </div>
                )}

                {widgetData && !error && tableData.length === 0 && (
                    <div className="py-4 text-center text-text-secondary text-sm">
                        No table data found. Make sure to select array fields.
                    </div>
                )}
            </div>
        </div>
    );
}
