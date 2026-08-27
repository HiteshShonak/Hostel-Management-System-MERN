import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth';
import {
    useComplaints,
    useAllComplaints,
    useCreateComplaint,
    useResolveComplaint,
    useRefreshDashboard,
} from '@/lib/hooks';
import type { Complaint } from '@/lib/types';

export const COMPLAINT_CATEGORIES = ['Plumbing', 'Electricity', 'WiFi', 'Other'] as const;
export type ComplaintCategory = typeof COMPLAINT_CATEGORIES[number];

export function useComplaintsController() {
    const { user } = useAuth();
    const isWarden = user?.role === 'warden' || user?.role === 'admin';
    const { refreshing, onRefresh } = useRefreshDashboard();

    // Pagination state
    const [page, setPage] = useState(1);
    const [allItems, setAllItems] = useState<Complaint[]>([]);
    const LIMIT = 10;

    const { data: myData, isLoading: loadingMy, isFetching: fetchingMy } = useComplaints(page, LIMIT);
    const { data: wardenData, isLoading: loadingAll, isFetching: fetchingAll } = useAllComplaints(page, isWarden ? 20 : 1);

    const createMutation = useCreateComplaint();
    const resolveMutation = useResolveComplaint();

    const data = isWarden ? wardenData : myData;
    const isFetching = isWarden ? fetchingAll : fetchingMy;
    const isLoading = isWarden ? loadingAll : loadingMy;

    // Accumulate complaints when page changes
    useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllItems(data.data);
            } else {
                setAllItems((prev) => [...prev, ...data.data]);
            }
        }
    }, [data, page]);

    const handleRefresh = async () => {
        setPage(1);
        setAllItems([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (data?.pagination?.hasNext && !isFetching) {
            setPage((prev) => prev + 1);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState<ComplaintCategory>('Other');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!title || title.length < 5) {
            alert('Title must be at least 5 characters');
            return;
        }
        if (!description || description.length < 10) {
            alert('Description must be at least 10 characters');
            return;
        }
        createMutation.mutate(
            { category, title, description },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setTitle('');
                    setDescription('');
                    setCategory('Other');
                    setPage(1);
                },
            }
        );
    };

    return {
        user,
        isWarden,
        allItems,
        data,
        page,
        isLoading,
        isFetching,
        refreshing,
        handleRefresh,
        handleLoadMore,
        showModal,
        setShowModal,
        category,
        setCategory,
        title,
        setTitle,
        description,
        setDescription,
        handleSubmit,
        createMutation,
        resolveMutation,
    };
}
