import { useState } from 'react';
import { useStudentsOut } from '@/lib/hooks';
import { GatePass } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/utils';

export interface SoftRedPalette {
    light: { bg: string; text: string; border: string; icon: string };
    dark: { bg: string; text: string; border: string; icon: string };
}

/**
 * Controller state interface for Guard Students Outside screen.
 */
export interface StudentsOutControllerState {
    /** List of students with active passes currently outside the hostel */
    studentsOut: GatePass[];
    /** Whether the students list data is currently loading */
    isLoading: boolean;
    /** Whether pull-to-refresh is active */
    refreshing: boolean;
    /** Trigger manual refresh of the students outside list */
    onRefresh: () => Promise<void>;
    /** Formats timestamp into 12-hour AM/PM format */
    formatTime: (date: Date | string) => string;
    /** Formats timestamp into short localized date string */
    formatDate: (date: Date | string) => string;
    /** Themed soft red palette configuration for alert highlights */
    softRed: SoftRedPalette;
}

/**
 * Controller hook for Guard Students Outside screen.
 * Manages fetching students who currently have an active pass and are outside,
 * pull-to-refresh state, and expected return time calculation.
 * Utilizes centralized date utilities for 12-hour AM/PM formatting.
 */
export function useStudentsOutController(): StudentsOutControllerState {
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useStudentsOut();

    const studentsOut = (data || []) as GatePass[];

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Soft Red Color Palette for Outside alert state
    const softRed: SoftRedPalette = {
        light: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', icon: '#fb7185' },
        dark: { bg: '#2a0a0a', text: '#fca5a5', border: '#4c0519', icon: '#f43f5e' },
    };

    return {
        studentsOut,
        isLoading,
        refreshing,
        onRefresh,
        formatTime,
        formatDate,
        softRed,
    };
}
