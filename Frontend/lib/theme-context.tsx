import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
    // Core colors
    primary: string;
    primaryLight: string;
    background: string;
    backgroundSecondary: string;
    card: string;
    cardBorder: string;

    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;

    // Status colors
    success: string;
    warning: string;
    danger: string;
    dangerLight: string;

    // Input colors
    inputBackground: string;
    inputBorder: string;
}

interface ThemeContextType {
    mode: ThemeMode;
    colors: ThemeColors;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
    primary: '#1d4ed8',
    primaryLight: '#eff6ff',
    background: '#f5f5f5',
    backgroundSecondary: '#ffffff',
    card: '#ffffff',
    cardBorder: '#e5e5e5',

    text: '#0a0a0a',
    textSecondary: '#737373',
    textTertiary: '#a3a3a3',

    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#ef4444',
    dangerLight: '#fef2f2',

    inputBackground: '#ffffff',
    inputBorder: '#e5e5e5',
};

const darkColors: ThemeColors = {
    primary: '#3b82f6',
    primaryLight: '#1e3a5f',
    background: '#0a0a0a',
    backgroundSecondary: '#141414',
    card: '#1a1a1a',
    cardBorder: '#2a2a2a',

    text: '#f5f5f5',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',

    success: '#22c55e',
    warning: '#fbbf24',
    danger: '#f87171',
    dangerLight: '#3a1a1a',

    inputBackground: '#1a1a1a',
    inputBorder: '#2a2a2a',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme-mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('system');

    // Load saved theme on mount
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedMode = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
            if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
                setModeState(savedMode as ThemeMode);
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const setMode = async (newMode: ThemeMode) => {
        try {
            await SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode);
            setModeState(newMode);
        } catch (error) {
            console.error('Failed to save theme:', error);
            setModeState(newMode); // Still update state even if save fails
        }
    };

    const effectiveTheme = mode === 'system' ? (systemColorScheme || 'light') : mode;
    const isDark = effectiveTheme === 'dark';
    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ mode, colors, isDark, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
