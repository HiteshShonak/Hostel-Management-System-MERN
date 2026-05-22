// lib/hooks/useEmergency.ts — Emergency hooks
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emergencyService } from '../services';
import { EmergencyRequest } from '../types';

export const useEmergencyContacts = () => {
    return useQuery({
        queryKey: ['emergency', 'contacts'],
        queryFn: emergencyService.getContacts,
    });
};

export const useSOS = () => {
    return useMutation({
        mutationFn: (data: EmergencyRequest) => emergencyService.sendSOS(data),
    });
};

export const useActiveAlerts = () => {
    return useQuery({
        queryKey: ['emergency', 'active'],
        queryFn: emergencyService.getActive,
        refetchInterval: 5000,
    });
};

export const useEmergencyHistory = () => {
    return useQuery({
        queryKey: ['emergency', 'history'],
        queryFn: emergencyService.getHistory,
    });
};

export const useAcknowledgeAlert = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => emergencyService.acknowledge(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emergency'] });
        },
    });
};

export const useResolveAlert = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => emergencyService.resolve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emergency'] });
        },
    });
};

export const useRefreshDashboard = () => {
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.refetchQueries();
        setRefreshing(false);
    }, [queryClient]);

    return { refreshing, onRefresh };
};
