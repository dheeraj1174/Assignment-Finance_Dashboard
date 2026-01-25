import { ICacheEntry } from '@/types';
import { CACHE_TTL } from '@/lib/constants';

/**
 * Get cached data if valid
 */
export function getCachedData(key: string): any | null {
    if (typeof window === 'undefined') return null;

    try {
        const cached = sessionStorage.getItem(`cache_${key}`);
        if (!cached) return null;

        const entry: ICacheEntry = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - entry.timestamp < entry.ttl) {
            return entry.data;
        }

        // Cache expired, remove it
        sessionStorage.removeItem(`cache_${key}`);
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

/**
 * Set cached data with TTL
 */
export function setCachedData(key: string, data: any, ttl: number = CACHE_TTL): void {
    if (typeof window === 'undefined') return;

    try {
        const entry: ICacheEntry = {
            data,
            timestamp: Date.now(),
            ttl,
        };

        sessionStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
        console.error('Error writing cache:', error);
    }
}

/**
 * Invalidate specific cache entry
 */
export function invalidateCache(key: string): void {
    if (typeof window === 'undefined') return;

    try {
        sessionStorage.removeItem(`cache_${key}`);
    } catch (error) {
        console.error('Error invalidating cache:', error);
    }
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
    if (typeof window === 'undefined') return;

    try {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
            if (key.startsWith('cache_')) {
                sessionStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

/**
 * Get cache key for widget
 */
export function getWidgetCacheKey(widgetId: string, url: string): string {
    return `widget_${widgetId}_${btoa(url).slice(0, 20)}`;
}
