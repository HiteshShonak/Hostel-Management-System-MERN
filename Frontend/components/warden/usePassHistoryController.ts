import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gatePassService } from '@/lib/services';
import { GatePass } from '@/lib/types';
import { useTheme } from '@/lib/contexts/theme';

export interface StatusStyle {
    bg: string;
    text: string;
}

/**
 * Controller hook for Warden Gate Pass History screen.
 * Manages fetching paginated history of all hostel gate passes,
 * pagination controls, pull-to-refresh, and status color styling.
 */
export function usePassHistoryController() {
    const { isDark } = useTheme();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    // Use warden-specific endpoint that shows ALL passes
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['warden-all-passes', page],
        queryFn: () => gatePassService.getAllPassesHistory(page, 20),
    });

    const passes = (data?.data || []) as GatePass[];
    const pagination = data?.pagination;

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    const getStatusColor = (status: string): StatusStyle => {
        switch (status) {
            case 'APPROVED':
                return { bg: isDark ? '#052e16' : '#f0fdf4', text: isDark ? '#86efac' : '#16a34a' };
            case 'REJECTED':
                return { bg: isDark ? '#451a03' : '#fef2f2', text: isDark ? '#fca5a5' : '#dc2626' };
            default:
                return { bg: isDark ? '#422006' : '#fef3c7', text: isDark ? '#fcd34d' : '#f59e0b' };
        }
    };

    return {
        page,
        setPage,
        passes,
        pagination,
        isLoading,
        refreshing,
        onRefresh,
        formatDate,
        getStatusColor,
    };
}
