import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useParentPendingPasses, useParentApprovePass, useParentRejectPass } from '@/lib/hooks';

export function usePendingPassesController() {
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const {
        data: passes,
        isLoading,
        refetch,
        isRefetching,
    } = useParentPendingPasses();

    const approveMutation = useParentApprovePass();
    const rejectMutation = useParentRejectPass();

    useEffect(() => {
        if (approveMutation.isSuccess) {
            Alert.alert('Approved', 'Gate pass approved. Now waiting for warden approval.');
        }
    }, [approveMutation.isSuccess]);

    useEffect(() => {
        if (approveMutation.isError) {
            Alert.alert('Error', (approveMutation.error as any)?.message || 'Failed to approve pass');
        }
    }, [approveMutation.isError]);

    useEffect(() => {
        if (rejectMutation.isSuccess) {
            setRejectModalVisible(false);
            setRejectReason('');
            setSelectedPassId(null);
            Alert.alert('Rejected', 'Gate pass has been rejected.');
        }
    }, [rejectMutation.isSuccess]);

    useEffect(() => {
        if (rejectMutation.isError) {
            Alert.alert('Error', (rejectMutation.error as any)?.message || 'Failed to reject pass');
        }
    }, [rejectMutation.isError]);

    const handleApprove = (passId: string) => {
        Alert.alert(
            'Approve Gate Pass',
            'Are you sure you want to approve this gate pass?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Approve', onPress: () => approveMutation.mutate(passId) },
            ]
        );
    };

    const handleReject = (passId: string) => {
        setSelectedPassId(passId);
        setRejectModalVisible(true);
    };

    const confirmReject = () => {
        if (selectedPassId) {
            rejectMutation.mutate({ passId: selectedPassId, reason: rejectReason });
        }
    };

    return {
        passes,
        isLoading,
        refetch,
        isRefetching,
        rejectModalVisible,
        setRejectModalVisible,
        rejectReason,
        setRejectReason,
        approveMutation,
        rejectMutation,
        handleApprove,
        handleReject,
        confirmReject,
    };
}
