import { useState } from 'react';
import { useRecentEntries } from '@/lib/hooks';
import { GatePass } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/utils';

export type RecentEntryItem = GatePass & {
    isLate?: boolean;
    lateDuration?: string;
};

/**
 * Controller state interface for Guard Recent Entries screen.
 */
export interface RecentEntriesControllerState {
    /** List of students who entered today with late duration calculations */
    entries: RecentEntryItem[];
    /** Whether the recent entries data is currently loading */
    isLoading: boolean;
    /** Whether pull-to-refresh is currently active */
    refreshing: boolean;
    /** Trigger manual refresh of the entries list */
    onRefresh: () => Promise<void>;
    /** Formats date string into 12-hour AM/PM time format */
    formatTime: (date: Date | string) => string;
    /** Formats date string into localized short date format */
    formatDate: (date: Date | string) => string;
    /** Calculates difference between entry and exit timestamps */
    getTimeDiff: (entryTime: string, exitTime: string) => string;
}

/**
 * Controller hook for Guard Recent Entries screen.
 * Handles fetching students who entered the hostel today,
 * calculating time spent outside, and formatting entry timestamps.
 * Utilizes centralized date utilities for 12-hour AM/PM formatting.
 */
export function useRecentEntriesController(): RecentEntriesControllerState {
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useRecentEntries();

    const entries = (data || []) as RecentEntryItem[];

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const getTimeDiff = (entryTime: string, exitTime: string) => {
        const diff = new Date(entryTime).getTime() - new Date(exitTime).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    return {
        entries,
        isLoading,
        refreshing,
        onRefresh,
        formatTime,
        formatDate,
        getTimeDiff,
    };
}
