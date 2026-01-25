import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export default function Input({
    label,
    error,
    helperText,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-3 py-2 
          bg-card border rounded-lg
          text-text-primary placeholder:text-text-secondary/50
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary-500'}
          focus:outline-none focus:ring-2 focus:ring-primary-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
            )}
        </div>
    );
}
