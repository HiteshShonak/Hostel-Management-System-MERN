import { useState } from 'react';
import { useActivityLogs } from '@/lib/hooks';
import { formatTime } from '@/lib/utils';

export interface LogEntry {
    _id: string;
    action: 'EXIT' | 'ENTRY';
    timestamp: string;
    isLate?: boolean;
    note?: string;
    user: {
        name: string;
        rollNo: string;
        room: string;
        hostel: string;
        phone: string;
    };
    gatePass: {
        reason: string;
        qrValue: string;
    };
    markedBy: {
        name: string;
        role: string;
    };
}

/**
 * Controller hook for Guard Activity Logs screen.
 * Handles fetching activity logs, pull-to-refresh state,
 * formatting timestamp displays, and calculating daily statistics.
 */
export function useActivityLogsController() {
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useActivityLogs(1, 100);

    const logs = (data?.logs || []) as LogEntry[];

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const getTimeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        const hours = Math.floor(diff / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    // Count today's exits and entries
    const exitCount = logs.filter((l) => l.action === 'EXIT').length;
    const entryCount = logs.filter((l) => l.action === 'ENTRY').length;

    return {
        logs,
        isLoading,
        refreshing,
        onRefresh,
        formatTime,
        getTimeAgo,
        exitCount,
        entryCount,
    };
}
