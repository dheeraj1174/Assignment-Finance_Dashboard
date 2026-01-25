'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import FieldSelector from './FieldSelector';
import { testApiEndpoint } from '@/utils/apiClient';
import { extractFields } from '@/utils/fieldParser';
import { IWidgetConfig, IFieldMapping, DisplayMode, IFieldNode } from '@/types';
import { DEFAULT_WIDGET_CONFIG, REFRESH_INTERVALS } from '@/lib/constants';

interface AddWidgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (widget: IWidgetConfig) => void;
    initialWidget?: IWidgetConfig | null;
}

export default function AddWidgetModal({ isOpen, onClose, onSave, initialWidget }: AddWidgetModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1 fields
    const [widgetName, setWidgetName] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [refreshInterval, setRefreshInterval] = useState(30);

    // Step 2 fields
    const [availableFields, setAvailableFields] = useState<IFieldNode[]>([]);
    const [selectedFields, setSelectedFields] = useState<IFieldMapping[]>([]);
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.CARD);
    const [apiData, setApiData] = useState<any>(null);

    React.useEffect(() => {
        if (initialWidget && isOpen) {
            setWidgetName(initialWidget.name);
            setApiUrl(initialWidget.apiUrl);
            setRefreshInterval(initialWidget.refreshInterval);
            setSelectedFields(initialWidget.selectedFields);
            setDisplayMode(initialWidget.displayMode);
            // If editing, we skip testing API if we already have fields, 
            // but for safety let's just pre-fill step 1 first.
            // Actually, usually users want to see fields when editing.
            // Let's force a re-test or allow jumping to step 2 if we can fetch fields.
        }
    }, [initialWidget, isOpen]);

    const handleTestApi = async () => {
        if (!apiUrl) {
            setError('Please enter an API URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await testApiEndpoint(apiUrl);

            if (response.success && response.data) {
                const fields = extractFields(response.data);
                setAvailableFields(fields);
                setApiData(response.data);
                setStep(2);
            } else {
                setError(response.error || 'Failed to fetch data from API');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (!widgetName || !apiUrl || selectedFields.length === 0) {
            setError('Please complete all required fields');
            return;
        }

        const widget: IWidgetConfig = {
            id: initialWidget?.id || uuidv4(),
            name: widgetName,
            apiUrl,
            refreshInterval,
            displayMode,
            selectedFields,
            position: initialWidget?.position || Date.now(),
            createdAt: initialWidget?.createdAt || Date.now(),
            lastUpdated: Date.now(),
        };

        onSave(widget);
        handleClose();
    };

    const handleClose = () => {
        // Reset all fields
        setStep(1);
        setWidgetName('');
        setApiUrl('');
        setRefreshInterval(30);
        setAvailableFields([]);
        setSelectedFields([]);
        setDisplayMode(DisplayMode.CARD);
        setApiData(null);
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={initialWidget ? "Edit Widget" : "Add New Widget"} size="lg">
            {step === 1 ? (
                <div className="space-y-4">
                    <Input
                        label="Widget Name"
                        placeholder="e.g., Bitcoin Price Tracker"
                        value={widgetName}
                        onChange={(e) => setWidgetName(e.target.value)}
                    />

                    <Input
                        label="API URL"
                        placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        helperText="Enter the full API endpoint URL"
                    />

                    <Select
                        label="Refresh Interval (seconds)"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        options={REFRESH_INTERVALS.map((interval) => ({
                            value: interval,
                            label: `${interval}s (${interval / 60} min)`,
                        }))}
                    />

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleTestApi} loading={loading}>
                            {initialWidget ? "Re-test API" : "Test API"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Success message */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        API connection successful! {availableFields.length} fields found.
                    </div>

                    <FieldSelector
                        availableFields={availableFields}
                        selectedFields={selectedFields}
                        onFieldsChange={setSelectedFields}
                        displayMode={displayMode}
                        onDisplayModeChange={setDisplayMode}
                    />

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={selectedFields.length === 0}
                        >
                            {initialWidget ? "Update Widget" : "Add Widget"}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
