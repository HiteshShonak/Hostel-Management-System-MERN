// lib/hooks/useAdmin.ts — Admin hooks
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, ParentStudentLink } from '../services';
import { queryKeys } from './queryKeys';

export const useAdminUsers = (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: queryKeys.admin.users(params),
        queryFn: () => adminService.getUsers(params),
        staleTime: 1000 * 60 * 2,
        placeholderData: (previousData: any) => previousData,
    });
};

export const useAdminUserRelations = (userId: string) => {
    return useQuery({
        queryKey: queryKeys.admin.userRelations(userId),
        queryFn: () => adminService.getUserRelations(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useAdminUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            adminService.updateUserRole(userId, role),
        onMutate: async ({ userId, role }) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'users'] });
            return {};
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

export const useAdminParentLinks = (page: number = 1) => {
    return useQuery({
        queryKey: queryKeys.admin.parentLinks(page),
        queryFn: () => adminService.getParentLinks(page),
        staleTime: 1000 * 60 * 5,
    });
};

export const useAdminLinkParent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { parentId: string; studentId: string; relationship: 'Father' | 'Mother' | 'Guardian' }) =>
            adminService.linkParent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'parent-links'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'relations'] });
        },
    });
};

export const useAdminUnlinkParent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (linkId: string) => adminService.unlinkParent(linkId),
        onMutate: async (linkId) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'parent-links'] });
            const allData = queryClient.getQueriesData({ queryKey: ['admin', 'parent-links'] });
            allData.forEach(([queryKey, data]: [any, any]) => {
                if (data?.links) {
                    queryClient.setQueryData(queryKey, {
                        ...data,
                        links: data.links.filter((l: ParentStudentLink) => l._id !== linkId),
                    });
                }
            });
            return { allData };
        },
        onError: (err, linkId, context) => {
            context?.allData?.forEach(([queryKey, data]: [any, any]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'parent-links'] });
        },
    });
};

export const usePrefetchAdminData = () => {
    const queryClient = useQueryClient();
    return useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.admin.users({}),
            queryFn: () => adminService.getUsers({}),
            staleTime: 1000 * 60 * 2,
        });
        queryClient.prefetchQuery({
            queryKey: queryKeys.admin.parentLinks(1),
            queryFn: () => adminService.getParentLinks(1),
            staleTime: 1000 * 60 * 5,
        });
    }, [queryClient]);
};
