/**
 * Format value as currency
 */
export function formatCurrency(value: any, currency: string = 'USD'): string {
    const num = parseFloat(value);
    if (isNaN(num)) return String(value);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format value as percentage
 */
export function formatPercentage(value: any, decimals: number = 2): string {
    const num = parseFloat(value);
    if (isNaN(num)) return String(value);

    return `${num.toFixed(decimals)}%`;
}

/**
 * Format date string
 */
export function formatDate(value: any, format: 'short' | 'long' = 'short'): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);

    if (format === 'long') {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

/**
 * Format number with commas
 */
export function formatNumber(value: any, decimals?: number): string {
    const num = parseFloat(value);
    if (isNaN(num)) return String(value);

    if (decimals !== undefined) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num);
    }

    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format value based on detected type
 */
export function formatValue(value: any, type?: string): string {
    if (value === null || value === undefined) return '-';

    switch (type) {
        case 'currency':
            return formatCurrency(value);
        case 'percentage':
            return formatPercentage(value);
        case 'date':
            return formatDate(value);
        case 'number':
            return formatNumber(value);
        default:
            return String(value);
    }
}

/**
 * Format timestamp to relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}
