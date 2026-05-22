// lib/hooks/useComplaints.ts — Complaint hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '../services';
import { ComplaintRequest } from '../types';

export const useComplaints = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['complaints', page, limit],
        queryFn: () => complaintService.getAll(page, limit),
    });
};

export const useAllComplaints = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['complaints', 'all', page, limit],
        queryFn: () => complaintService.getAllForWarden(page, limit),
    });
};

export const useCreateComplaint = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ComplaintRequest) => complaintService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
        },
    });
};

export const useResolveComplaint = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => complaintService.resolve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
        },
    });
};
