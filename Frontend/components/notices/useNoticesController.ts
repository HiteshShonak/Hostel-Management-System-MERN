import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth';
import { useNotices, useCreateNotice, useDeleteNotice, useRefreshDashboard } from '@/lib/hooks';
import type { Notice } from '@/lib/types';

export function useNoticesController() {
    const { user } = useAuth();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const createNoticeMutation = useCreateNotice();
    const deleteNoticeMutation = useDeleteNotice();

    // Pagination state
    const [page, setPage] = useState(1);
    const [allNotices, setAllNotices] = useState<Notice[]>([]);
    const LIMIT = 10;

    const { data, isLoading, isFetching } = useNotices(page, LIMIT);

    // Accumulate notices when page changes
    useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllNotices(data.data);
            } else {
                setAllNotices((prev) => [...prev, ...data.data]);
            }
        }
    }, [data, page]);

    const handleRefresh = async () => {
        setPage(1);
        setAllNotices([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (data?.pagination?.hasNext && !isFetching) {
            setPage((prev) => prev + 1);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgent, setUrgent] = useState(false);

    const isWarden = user?.role === 'warden' || user?.role === 'admin';
    const isMessStaff = user?.role === 'mess_staff';
    const canCreateNotice = isWarden || isMessStaff;

    const handleCreateNotice = () => {
        if (!title || !description) return;

        if (title.length < 5) {
            alert('Title must be at least 5 characters long');
            return;
        }

        if (description.length < 10) {
            alert('Description must be at least 10 characters long');
            return;
        }

        createNoticeMutation.mutate(
            { title, description, urgent },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setTitle('');
                    setDescription('');
                    setUrgent(false);
                    setPage(1);
                },
                onError: (error: any) => {
                    const message = error?.response?.data?.message || 'Failed to create notice';
                    alert(message);
                },
            }
        );
    };

    return {
        user,
        isWarden,
        canCreateNotice,
        allNotices,
        data,
        page,
        isLoading,
        isFetching,
        refreshing,
        handleRefresh,
        handleLoadMore,
        showModal,
        setShowModal,
        title,
        setTitle,
        description,
        setDescription,
        urgent,
        setUrgent,
        handleCreateNotice,
        createNoticeMutation,
        deleteNoticeMutation,
    };
}
