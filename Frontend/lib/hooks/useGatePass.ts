// lib/hooks/useGatePass.ts — Gate pass hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatePassService } from '../services';
import { GatePassRequest } from '../types';

export const useGatePasses = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['gatepasses', page, limit],
        queryFn: () => gatePassService.getAll(page, limit),
        staleTime: 1000 * 60 * 3,
        placeholderData: (previousData: any) => previousData,
    });
};

export const useCurrentGatePass = () => {
    return useQuery({
        queryKey: ['gatepass', 'current'],
        queryFn: gatePassService.getCurrent,
        staleTime: 1000 * 60,
        refetchOnMount: 'always',
    });
};

export const useRequestGatePass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: GatePassRequest) => gatePassService.request(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatepasses'] });
            queryClient.invalidateQueries({ queryKey: ['gatepass', 'current'] });
        },
    });
};

export const usePendingGatePasses = () => {
    return useQuery({
        queryKey: ['gatepasses', 'pending'],
        queryFn: gatePassService.getPending,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
        refetchOnMount: 'always',
    });
};

export const useApproveGatePass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => gatePassService.approve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatepasses'] });
            queryClient.invalidateQueries({ queryKey: ['gatepasses', 'pending'] });
        },
    });
};

export const useRejectGatePass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => gatePassService.reject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatepasses'] });
            queryClient.invalidateQueries({ queryKey: ['gatepasses', 'pending'] });
        },
    });
};

export const useValidateGatePass = () => {
    return useMutation({
        mutationFn: (qrValue: string) => gatePassService.validate(qrValue),
    });
};

export const useMarkExit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => gatePassService.markExit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatepasses'] });
        },
    });
};

export const useMarkEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => gatePassService.markEntry(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatepasses'] });
        },
    });
};
