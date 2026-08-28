import { useState, useEffect } from 'react';
import { useWardenStudents } from '@/lib/hooks';

export interface WardenStudentItem {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    avatar: string;
    year?: number;
    isOut: boolean;
}

export interface WardenStudentsControllerState {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    students: WardenStudentItem[];
    pagination: { total: number; page: number; pages: number } | undefined;
    isLoading: boolean;
    refreshing: boolean;
    onRefresh: () => Promise<void>;
}

/**
 * Controller hook for Warden Students list management screen.
 * Handles debounced search query, pagination, and pull-to-refresh.
 */
export function useWardenStudentsController(): WardenStudentsControllerState {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const { data, isLoading, refetch } = useWardenStudents(page, 20, debouncedSearch);

    const students = (data?.students || []) as WardenStudentItem[];
    const pagination = data?.pagination;

    // Debounce search input by 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return {
        searchQuery,
        setSearchQuery,
        page,
        setPage,
        students,
        pagination,
        isLoading,
        refreshing,
        onRefresh,
    };
}
