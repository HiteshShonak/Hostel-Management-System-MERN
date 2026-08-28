import { useState } from 'react';
import { useParentAllPasses } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';

export const PASS_STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
    PENDING_PARENT: { bg: '#fef3c7', text: '#b45309', icon: 'time' },
    PENDING_WARDEN: { bg: '#eff6ff', text: '#1d4ed8', icon: 'hourglass' },
    APPROVED: { bg: '#dcfce7', text: '#16a34a', icon: 'checkmark-circle' },
    REJECTED: { bg: '#fef2f2', text: '#dc2626', icon: 'close-circle' },
};

export function usePassHistoryController() {
    const { isDark } = useTheme();
    const [page, setPage] = useState(1);
    const { data, isLoading, refetch, isRefetching } = useParentAllPasses(page);

    const passes = data?.passes || [];
    const pagination = data?.pagination;

    const getStatusStyle = (status: string) => {
        const base = PASS_STATUS_STYLES[status] || PASS_STATUS_STYLES.PENDING_PARENT;
        if (!isDark) return base;

        switch (status) {
            case 'PENDING_PARENT': return { bg: '#422006', text: '#fcd34d', icon: base.icon };
            case 'PENDING_WARDEN': return { bg: '#172554', text: '#60a5fa', icon: base.icon };
            case 'APPROVED': return { bg: '#052e16', text: '#86efac', icon: base.icon };
            case 'REJECTED': return { bg: '#450a0a', text: '#fca5a5', icon: base.icon };
            default: return { bg: '#422006', text: '#fcd34d', icon: base.icon };
        }
    };

    return {
        page,
        setPage,
        passes,
        pagination,
        isLoading,
        refetch,
        isRefetching,
        getStatusStyle,
    };
}
