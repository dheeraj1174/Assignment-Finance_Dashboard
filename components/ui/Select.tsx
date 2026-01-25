import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
}

export default function Select({
    label,
    error,
    options,
    className = '',
    ...props
}: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {label}
                </label>
            )}
            <select
                className={`
          w-full px-3 py-2 
          bg-card border rounded-lg
          text-text-primary
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary-500'}
          focus:outline-none focus:ring-2 focus:ring-primary-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
