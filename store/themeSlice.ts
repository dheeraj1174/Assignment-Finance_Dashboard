import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IThemeState } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

const loadInitialTheme = (): IThemeState => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.THEME);
            if (saved) {
                return JSON.parse(saved);
            }
            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return { mode: 'dark' };
            }
        } catch (error) {
            console.error('Failed to load theme state:', error);
        }
    }
    return { mode: 'dark' }; // Default to dark mode
};

const initialState: IThemeState = loadInitialTheme();

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            saveTheme(state);
            applyTheme(state.mode);
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.mode = action.payload;
            saveTheme(state);
            applyTheme(state.mode);
        },
    },
});

function saveTheme(state: IThemeState) {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save theme state:', error);
        }
    }
}

function applyTheme(mode: 'light' | 'dark') {
    if (typeof window !== 'undefined') {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
