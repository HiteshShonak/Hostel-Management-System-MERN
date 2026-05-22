// lib/hooks/useHelper.ts — Helper role hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { helperService } from '../services';

export const useHelperRegisterUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            name: string;
            email: string;
            password: string;
            rollNo: string;
            room: string;
            hostel: string;
            phone: string;
            role: string;
            year?: number;
            parentEmail?: string;
        }) => helperService.registerUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

export const useHelperResetPassword = () => {
    return useMutation({
        mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
            helperService.resetUserPassword(userId, newPassword),
    });
};

export const useHelperSearchUsers = (params?: { search?: string; role?: string; page?: number }) => {
    return useQuery({
        queryKey: ['helper', 'users', params],
        queryFn: () => helperService.searchUsers(params),
        staleTime: 1000 * 60,
        placeholderData: (previousData: any) => previousData,
    });
};
