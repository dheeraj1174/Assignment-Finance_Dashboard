'use client';

import React, { useState } from 'react';
import { DisplayMode, IFieldMapping, IFieldNode } from '@/types';
import { DISPLAY_MODES } from '@/lib/constants';
import { flattenFields, filterFields } from '@/utils/fieldParser';
import Button from './ui/Button';
import Input from './ui/Input';

interface FieldSelectorProps {
    availableFields: IFieldNode[];
    selectedFields: IFieldMapping[];
    onFieldsChange: (fields: IFieldMapping[]) => void;
    displayMode: DisplayMode;
    onDisplayModeChange: (mode: DisplayMode) => void;
}

export default function FieldSelector({
    availableFields,
    selectedFields,
    onFieldsChange,
    displayMode,
    onDisplayModeChange,
}: FieldSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showArraysOnly, setShowArraysOnly] = useState(false);

    // Flatten and filter fields
    const allFields = flattenFields(availableFields);
    const filteredFields = filterFields(allFields, searchQuery).filter((field) =>
        showArraysOnly ? field.isArray : true
    );

    const handleAddField = (field: IFieldNode) => {
        if (selectedFields.find((f) => f.path === field.path)) return;

        const newField: IFieldMapping = {
            path: field.path,
            label: field.label,
            type: field.type as any,
            isArray: field.isArray,
        };

        onFieldsChange([...selectedFields, newField]);
    };

    const handleRemoveField = (path: string) => {
        onFieldsChange(selectedFields.filter((f) => f.path !== path));
    };

    const handleUpdateLabel = (path: string, newLabel: string) => {
        onFieldsChange(
            selectedFields.map((f) => (f.path === path ? { ...f, label: newLabel } : f))
        );
    };

    return (
        <div className="space-y-4">
            {/* Display Mode Selector */}
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                    Display Mode
                </label>
                <div className="flex gap-2">
                    {DISPLAY_MODES.map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => onDisplayModeChange(mode.value)}
                            className={`
                                flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium
                                ${displayMode === mode.value
                                    ? 'bg-primary-500 text-white border-primary-500'
                                    : 'bg-card text-text-secondary border-border hover:border-primary-500'
                                }
                            `}
                        >
                            {mode.value === DisplayMode.CARD && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            )}
                            {mode.value === DisplayMode.TABLE && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                            {mode.value === DisplayMode.CHART && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            )}
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Fields */}
            <Input
                placeholder="Search for fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Show Arrays Only Checkbox */}
            {displayMode === DisplayMode.TABLE && (
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showArraysOnly}
                        onChange={(e) => setShowArraysOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary-500 focus:ring-primary-500"
                    />
                    Show arrays only (for table view)
                </label>
            )}

            {/* Available Fields */}
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                    Available Fields
                </label>
                <div className="max-h-48 overflow-y-auto bg-background border border-border rounded-lg">
                    {filteredFields.length === 0 ? (
                        <div className="p-4 text-center text-text-secondary text-sm">
                            No fields found
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {filteredFields.map((field) => (
                                <div
                                    key={field.path}
                                    className="flex items-center justify-between p-3 hover:bg-card transition-colors bg-card/50"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-mono text-text-primary truncate">
                                            {field.path}
                                        </div>
                                        <div className="text-xs text-text-secondary truncate">
                                            {field.type} | {typeof field.value === 'object' ? JSON.stringify(field.value) : String(field.value)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddField(field)}
                                        disabled={selectedFields.some((f) => f.path === field.path)}
                                        className={`p-1 transition-colors ${selectedFields.some((f) => f.path === field.path)
                                            ? 'text-gray-600'
                                            : 'text-text-secondary hover:text-primary-500'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Fields */}
            <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                    Selected Fields
                </label>
                <div className="bg-background border border-border rounded-lg min-h-[100px]">
                    {selectedFields.length === 0 ? (
                        <div className="p-4 text-center text-text-secondary text-sm">
                            No fields selected
                        </div>
                    ) : (
                        <div className="p-3 space-y-3">
                            {selectedFields.map((field) => (
                                <div
                                    key={field.path}
                                    className="p-3 bg-card rounded-lg border border-border space-y-2 relative group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-mono text-text-secondary truncate pr-8">
                                            {field.path}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveField(field.path)}
                                            className="absolute top-2 right-2 p-1 text-text-secondary hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <Input
                                        value={field.label}
                                        onChange={(e) => handleUpdateLabel(field.path, e.target.value)}
                                        placeholder="Enter field label..."
                                        className="h-9 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
