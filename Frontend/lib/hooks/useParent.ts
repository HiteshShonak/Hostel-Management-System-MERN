// lib/hooks/useParent.ts — Parent hooks
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentService, PendingGatePass } from '../services';
import { queryKeys } from './queryKeys';

export const useParentChildren = () => {
    return useQuery({
        queryKey: queryKeys.parent.children(),
        queryFn: parentService.getChildren,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetchOnMount: 'always',
    });
};

export const useParentPendingPasses = () => {
    return useQuery({
        queryKey: queryKeys.parent.pendingPasses(),
        queryFn: parentService.getPendingPasses,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
        refetchOnMount: 'always',
    });
};

export const useParentAllPasses = (page: number = 1, studentId?: string) => {
    return useQuery({
        queryKey: queryKeys.parent.allPasses(page, studentId),
        queryFn: () => parentService.getAllPasses(page, 20, studentId),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData: any) => previousData,
    });
};

export const useParentApprovePass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (passId: string) => parentService.approvePass(passId),
        onMutate: async (passId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.parent.pendingPasses() });
            const previousPasses = queryClient.getQueryData<PendingGatePass[]>(queryKeys.parent.pendingPasses());
            if (previousPasses) {
                queryClient.setQueryData(
                    queryKeys.parent.pendingPasses(),
                    previousPasses.filter(p => p._id !== passId)
                );
            }
            return { previousPasses };
        },
        onError: (err, passId, context) => {
            if (context?.previousPasses) {
                queryClient.setQueryData(queryKeys.parent.pendingPasses(), context.previousPasses);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.parent.pendingPasses() });
            queryClient.invalidateQueries({ queryKey: queryKeys.parent.allPasses() });
        },
    });
};

export const useParentRejectPass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ passId, reason }: { passId: string; reason?: string }) =>
            parentService.rejectPass(passId, reason),
        onMutate: async ({ passId }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.parent.pendingPasses() });
            const previousPasses = queryClient.getQueryData<PendingGatePass[]>(queryKeys.parent.pendingPasses());
            if (previousPasses) {
                queryClient.setQueryData(
                    queryKeys.parent.pendingPasses(),
                    previousPasses.filter(p => p._id !== passId)
                );
            }
            return { previousPasses };
        },
        onError: (err, variables, context) => {
            if (context?.previousPasses) {
                queryClient.setQueryData(queryKeys.parent.pendingPasses(), context.previousPasses);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.parent.pendingPasses() });
            queryClient.invalidateQueries({ queryKey: queryKeys.parent.allPasses() });
        },
    });
};

export const usePrefetchParentData = () => {
    const queryClient = useQueryClient();
    return useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.parent.children(),
            queryFn: parentService.getChildren,
            staleTime: 1000 * 60 * 10,
        });
        queryClient.prefetchQuery({
            queryKey: queryKeys.parent.pendingPasses(),
            queryFn: parentService.getPendingPasses,
            staleTime: 1000 * 30,
        });
    }, [queryClient]);
};
