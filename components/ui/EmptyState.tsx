import React from 'react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    title = 'Build Your Finance Dashboard',
    description = 'Create custom widgets by connecting to any finance API. Track stocks, crypto, forex, or economic indicators - all in real-time.',
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            {/* Icon */}
            <div className="w-20 h-20 mb-6 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                <svg
                    className="w-10 h-10 text-primary-500"
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

            {/* Text */}
            <h3 className="text-2xl font-semibold text-text-primary mb-2">{title}</h3>
            <p className="text-text-secondary max-w-md mb-8">{description}</p>

            {/* Action */}
            {action}
        </div>
    );
}
