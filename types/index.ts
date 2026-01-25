// Widget Types
export enum WidgetType {
    CARD = 'card',
    TABLE = 'table',
    CHART = 'chart',
}

export enum DisplayMode {
    CARD = 'card',
    TABLE = 'table',
    CHART = 'chart',
}

export enum ChartType {
    LINE = 'line',
    CANDLESTICK = 'candlestick',
}

export enum ChartInterval {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

// Field Mapping
export interface IFieldMapping {
    path: string;
    label: string;
    type?: 'string' | 'number' | 'currency' | 'percentage' | 'date';
    isArray?: boolean;
}

// Widget Configuration
export interface IWidgetConfig {
    id: string;
    name: string;
    apiUrl: string;
    refreshInterval: number; // in seconds
    displayMode: DisplayMode;
    selectedFields: IFieldMapping[];
    chartType?: ChartType;
    chartInterval?: ChartInterval;
    position: number;
    createdAt: number;
    lastUpdated?: number;
}

// Widget Data
export interface IWidgetData {
    widgetId: string;
    data: any;
    timestamp: number;
    error?: string;
}

// API Response
export interface IAPIResponse {
    success: boolean;
    data?: any;
    error?: string;
    fields?: IFieldNode[];
}

// Field Node for JSON Explorer
export interface IFieldNode {
    path: string;
    label: string;
    value: any;
    type: string;
    children?: IFieldNode[];
    isArray?: boolean;
}

// Dashboard State
export interface IDashboardState {
    widgets: IWidgetConfig[];
    widgetData: Record<string, IWidgetData>;
    loading: Record<string, boolean>;
    errors: Record<string, string>;
}

// Theme State
export interface IThemeState {
    mode: 'light' | 'dark';
}

// Cache Entry
export interface ICacheEntry {
    data: any;
    timestamp: number;
    ttl: number;
}
