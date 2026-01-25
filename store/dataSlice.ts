import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWidgetData } from '@/types';

interface DataState {
    widgetData: Record<string, IWidgetData>;
}

const initialState: DataState = {
    widgetData: {},
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setWidgetData: (state, action: PayloadAction<IWidgetData>) => {
            state.widgetData[action.payload.widgetId] = action.payload;
        },
        clearWidgetData: (state, action: PayloadAction<string>) => {
            delete state.widgetData[action.payload];
        },
        updateTimestamp: (state, action: PayloadAction<{ widgetId: string; timestamp: number }>) => {
            if (state.widgetData[action.payload.widgetId]) {
                state.widgetData[action.payload.widgetId].timestamp = action.payload.timestamp;
            }
        },
        clearAllData: (state) => {
            state.widgetData = {};
        },
    },
});

export const { setWidgetData, clearWidgetData, updateTimestamp, clearAllData } = dataSlice.actions;

export default dataSlice.reducer;
