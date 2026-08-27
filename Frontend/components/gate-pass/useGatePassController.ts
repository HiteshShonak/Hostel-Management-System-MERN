import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { useAuth } from '@/lib/contexts/auth';
import {
    useGatePasses,
    usePendingGatePasses,
    useRequestGatePass,
    useApproveGatePass,
    useRejectGatePass,
    useRefreshDashboard,
} from '@/lib/hooks';
import { GatePass } from '@/lib/types';
import { getErrorMessage, getErrorTitle } from '@/lib/utils/error';

export function useGatePassController() {
    const { user } = useAuth();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const isWarden = user?.role === 'warden' || user?.role === 'admin';

    // Pagination state for student view
    const [page, setPage] = useState(1);
    const [allPasses, setAllPasses] = useState<GatePass[]>([]);
    const LIMIT = 10;

    // Student hooks with pagination
    const { data: myData, isLoading: loadingMy, isFetching: fetchingMy } = useGatePasses(page, LIMIT);
    const requestMutation = useRequestGatePass();

    // Warden hooks
    const { data: pendingPasses, isLoading: loadingPending } = usePendingGatePasses();
    const approveMutation = useApproveGatePass();
    const rejectMutation = useRejectGatePass();

    // Add new passes to the list when scrolling
    useEffect(() => {
        if (!isWarden && myData?.data) {
            if (page === 1) {
                setAllPasses(myData.data);
            } else {
                setAllPasses((prev) => [...prev, ...myData.data]);
            }
        }
    }, [myData, page, isWarden]);

    const handleRefresh = async () => {
        setPage(1);
        setAllPasses([]);
        await onRefresh();
    };

    const handleLoadMore = () => {
        if (myData?.pagination?.hasNext && !fetchingMy) {
            setPage((prev) => prev + 1);
        }
    };

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    // DateTime Picker State
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [showPicker, setShowPicker] = useState(false);
    const [activeField, setActiveField] = useState<'from' | 'to'>('from');

    const onChangePicker = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || (activeField === 'from' ? fromDate : toDate);
        setShowPicker(Platform.OS === 'ios');
        if (activeField === 'from') {
            setFromDate(currentDate);
        } else {
            setToDate(currentDate);
        }
    };

    const showMode = (currentMode: 'date' | 'time', field: 'from' | 'to') => {
        setShowPicker(true);
        setMode(currentMode);
        setActiveField(field);
    };

    const handleRequest = () => {
        if (!reason || reason.length < 5) {
            alert('Reason must be at least 5 characters');
            return;
        }

        if (fromDate >= toDate) {
            alert('End time must be after start time');
            return;
        }

        if (fromDate < new Date()) {
            alert('Start time cannot be in the past');
            return;
        }

        requestMutation.mutate(
            { reason, fromDate: fromDate.toISOString(), toDate: toDate.toISOString() },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setReason('');
                    setFromDate(new Date());
                    setToDate(new Date());
                    setPage(1);
                },
                onError: (error: unknown) => {
                    Alert.alert(getErrorTitle(error), getErrorMessage(error));
                },
            }
        );
    };

    const isLoading = isWarden ? loadingPending : loadingMy && page === 1;
    const passes = isWarden ? pendingPasses : allPasses;

    return {
        user,
        isWarden,
        isLoading,
        passes,
        refreshing,
        handleRefresh,
        handleLoadMore,
        fetchingMy,
        page,
        myData,
        allPasses,
        approveMutation,
        rejectMutation,
        requestMutation,
        showModal,
        setShowModal,
        reason,
        setReason,
        fromDate,
        toDate,
        mode,
        showPicker,
        activeField,
        onChangePicker,
        showMode,
        handleRequest,
    };
}
