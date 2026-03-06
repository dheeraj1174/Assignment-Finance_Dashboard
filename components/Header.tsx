'use client';

import React, { useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { toggleTheme } from '@/store/themeSlice';
import { importDashboard } from '@/store/dashboardSlice';
import { exportConfig, importConfig } from '@/utils/storage';
import Button from './ui/Button';

interface HeaderProps {
    onAddWidget: () => void;
}

console.log("added header");


export default function Header({ onAddWidget }: HeaderProps) {
    const dispatch = useAppDispatch();
    const widgets = useAppSelector((state) => state.dashboard.widgets);
    const theme = useAppSelector((state) => state.theme.mode);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        exportConfig(widgets);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const importedWidgets = await importConfig(file);
            dispatch(importDashboard(importedWidgets));
            alert('Dashboard imported successfully!');
        } catch (error) {
            alert('Failed to import dashboard: ' + (error as Error).message);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-text-primary">Finance Dashboard</h1>
                            <p className="text-sm text-text-secondary">
                                {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} • Real-time data
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Export */}
                        {widgets.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleExport} title="Export Dashboard">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                            </Button>
                        )}

                        {/* Import */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            title="Import Dashboard"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12"
                                />
                            </svg>
                        </Button>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dispatch(toggleTheme())}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </Button>

                        {/* Add Widget */}
                        <Button variant="primary" size="md" onClick={onAddWidget}>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Widget
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
