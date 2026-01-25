import { DisplayMode, ChartType, ChartInterval } from '@/types';

// Widget Types
export const WIDGET_TYPES = {
    CARD: 'card',
    TABLE: 'table',
    CHART: 'chart',
} as const;

// Display Modes
export const DISPLAY_MODES: { value: DisplayMode; label: string }[] = [
    { value: DisplayMode.CARD, label: 'Card' },
    { value: DisplayMode.TABLE, label: 'Table' },
    { value: DisplayMode.CHART, label: 'Chart' },
];

// Chart Types
export const CHART_TYPES: { value: ChartType; label: string }[] = [
    { value: ChartType.LINE, label: 'Line Chart' },
    { value: ChartType.CANDLESTICK, label: 'Candlestick Chart' },
];

// Chart Intervals
export const CHART_INTERVALS: { value: ChartInterval; label: string }[] = [
    { value: ChartInterval.DAILY, label: 'Daily' },
    { value: ChartInterval.WEEKLY, label: 'Weekly' },
    { value: ChartInterval.MONTHLY, label: 'Monthly' },
];

// Default Refresh Intervals (in seconds)
export const REFRESH_INTERVALS = [30, 60, 300, 600, 1800, 3600];

// Default Widget Configuration
export const DEFAULT_WIDGET_CONFIG = {
    refreshInterval: 30,
    displayMode: DisplayMode.CARD,
    selectedFields: [],
    position: 0,
};

// Cache TTL (in milliseconds)
export const CACHE_TTL = 30000; // 30 seconds

// LocalStorage Keys
export const STORAGE_KEYS = {
    DASHBOARD: 'finboard_dashboard',
    THEME: 'finboard_theme',
    API_CACHE: 'finboard_api_cache',
};

// Sample API Endpoints for Demo
export const SAMPLE_APIS = [
    {
        name: 'Bitcoin Price (Coinbase)',
        url: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
    },
    {
        name: 'Stock Market Gainers',
        url: 'https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=demo',
    },
];
