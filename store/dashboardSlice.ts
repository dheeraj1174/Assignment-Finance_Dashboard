import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWidgetConfig } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface DashboardState {
    widgets: IWidgetConfig[];
    loading: Record<string, boolean>;
    errors: Record<string, string>;
}

const loadInitialState = (): DashboardState => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    widgets: parsed.widgets || [],
                    loading: {},
                    errors: {},
                };
            }
        } catch (error) {
            console.error('Failed to load dashboard state:', error);
        }
    }
    return {
        widgets: [],
        loading: {},
        errors: {},
    };
};

const initialState: DashboardState = loadInitialState();

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        addWidget: (state, action: PayloadAction<IWidgetConfig>) => {
            state.widgets.push(action.payload);
            saveToBrowser(state);
        },
        removeWidget: (state, action: PayloadAction<string>) => {
            state.widgets = state.widgets.filter((w) => w.id !== action.payload);
            delete state.loading[action.payload];
            delete state.errors[action.payload];
            saveToBrowser(state);
        },
        updateWidget: (state, action: PayloadAction<IWidgetConfig>) => {
            const index = state.widgets.findIndex((w) => w.id === action.payload.id);
            if (index !== -1) {
                state.widgets[index] = action.payload;
                saveToBrowser(state);
            }
        },
        reorderWidgets: (state, action: PayloadAction<IWidgetConfig[]>) => {
            state.widgets = action.payload;
            saveToBrowser(state);
        },
        setWidgetLoading: (state, action: PayloadAction<{ id: string; loading: boolean }>) => {
            state.loading[action.payload.id] = action.payload.loading;
        },
        setWidgetError: (state, action: PayloadAction<{ id: string; error: string }>) => {
            state.errors[action.payload.id] = action.payload.error;
        },
        clearWidgetError: (state, action: PayloadAction<string>) => {
            delete state.errors[action.payload];
        },
        importDashboard: (state, action: PayloadAction<IWidgetConfig[]>) => {
            state.widgets = action.payload;
            state.loading = {};
            state.errors = {};
            saveToBrowser(state);
        },
    },
});

// Helper function to save to localStorage
function saveToBrowser(state: DashboardState) {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(
                STORAGE_KEYS.DASHBOARD,
                JSON.stringify({ widgets: state.widgets })
            );
        } catch (error) {
            console.error('Failed to save dashboard state:', error);
        }
    }
}

export const {
    addWidget,
    removeWidget,
    updateWidget,
    reorderWidgets,
    setWidgetLoading,
    setWidgetError,
    clearWidgetError,
    importDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
