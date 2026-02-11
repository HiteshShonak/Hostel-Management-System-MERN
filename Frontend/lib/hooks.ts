import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    authService,
    gatePassService,
    noticeService,
    messMenuService,
    foodRatingService,
    complaintService,
    attendanceService,
    visitorService,
    paymentService,
    laundryService,
    emergencyService,
    notificationService,
} from './services';
import {
    LoginData,
    RegisterData,
    GatePassRequest,
    NoticeRequest,
    MessMenuUpdate,
    FoodRatingRequest,
    ComplaintRequest,
    VisitorRequest,
    LaundryRequest,
    EmergencyRequest,
} from './types';

// ==================== AUTH HOOKS ====================
export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginData) => authService.login(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterData) => authService.register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: authService.getMe,
        retry: false,
        staleTime: 1000 * 60 * 10, // User data rarely changes - 10 min
        gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
        refetchOnMount: false, // Don't refetch on every mount
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name?: string; phone?: string; room?: string }) =>
            authService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
            authService.changePassword(currentPassword, newPassword),
    });
};

// ==================== GATE PASS HOOKS ====================
// Paginated gate passes hook with Load More support
export const useGatePasses = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['gatepasses', page, limit],
        queryFn: () => gatePassService.getAll(page, limit),
        staleTime: 1000 * 60 * 3, // 3 minutes - gate passes change moderately
        placeholderData: (previousData: any) => previousData, // Keep previous while fetching
    });
};

export const useCurrentGatePass = () => {
    return useQuery({
        queryKey: ['gatepass', 'current'],
        queryFn: gatePassService.getCurrent,
        staleTime: 1000 * 60, // 1 minute - current pass is important
        refetchOnMount: 'always', // Always check for current pass
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

// Warden hooks
export const usePendingGatePasses = () => {
    return useQuery({
        queryKey: ['gatepasses', 'pending'],
        queryFn: gatePassService.getPending,
        staleTime: 1000 * 30, // 30 seconds - time sensitive for wardens
        refetchInterval: 1000 * 60, // Auto-refetch every minute
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

// Staff hook
export const useValidateGatePass = () => {
    return useMutation({
        mutationFn: (qrValue: string) => gatePassService.validate(qrValue),
    });
};

// Guard entry/exit tracking hooks
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

// ==================== NOTICES HOOKS ====================
// Paginated notices hook with Load More support
export const useNotices = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['notices', page, limit],
        queryFn: () => noticeService.getAll(page, limit),
        staleTime: 1000 * 60 * 5, // 5 minutes - notices don't change often
        placeholderData: (previousData: any) => previousData,
    });
};

export const useCreateNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: NoticeRequest) => noticeService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });
};

export const useDeleteNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => noticeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });
};

// ==================== MESS MENU HOOKS ====================
export const useMessMenu = () => {
    return useQuery({
        queryKey: ['messmenu'],
        queryFn: messMenuService.getFullMenu,
        staleTime: 1000 * 60 * 30, // 30 minutes - menu changes rarely
        gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    });
};

export const useUpdateMessMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ day, data }: { day: string; data: MessMenuUpdate }) =>
            messMenuService.updateDayMenu(day, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messmenu'] });
        },
    });
};

export const useUpdateTimings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (timings: any) => messMenuService.updateTimings(timings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messmenu'] });
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });
};

// ==================== FOOD RATING HOOKS ====================
export const useFoodRatingAverage = (date?: string) => {
    return useQuery({
        queryKey: ['food-rating', 'average', date],
        queryFn: () => foodRatingService.getAverage(date),
    });
};

export const useMyFoodRatings = (date?: string) => {
    return useQuery({
        queryKey: ['food-rating', 'my', date],
        queryFn: () => foodRatingService.getMyRatings(date),
    });
};

export const useRateMeal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FoodRatingRequest) => foodRatingService.rate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['food-rating'] });
        },
    });
};

// ==================== COMPLAINTS HOOKS ====================
// Paginated complaints hook with Load More support
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

// ==================== ATTENDANCE HOOKS ====================
export const useAttendance = () => {
    return useQuery({
        queryKey: ['attendance'],
        queryFn: attendanceService.getAll,
        staleTime: 1000 * 60 * 10, // 10 minutes - historical data
    });
};

export const useAttendanceHistory = () => {
    return useQuery({
        queryKey: ['attendance', 'history'],
        queryFn: attendanceService.getAll,
        staleTime: 1000 * 60 * 10, // 10 minutes - historical data
    });
};

export const useAttendanceStats = () => {
    return useQuery({
        queryKey: ['attendance', 'stats'],
        queryFn: attendanceService.getStats,
        staleTime: 1000 * 60 * 10, // 10 minutes - stats don't change quickly
    });
};

export const useTodayAttendance = () => {
    return useQuery({
        queryKey: ['attendance', 'today'],
        queryFn: attendanceService.checkToday,
        staleTime: 1000 * 60, // 1 minute - today's status is time-sensitive
        refetchOnMount: 'always', // Always check current status
    });
};

export const useMarkAttendance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (location: { latitude: number; longitude: number }) =>
            attendanceService.mark(location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
    });
};

// ==================== VISITORS HOOKS ====================
export const useVisitors = () => {
    return useQuery({
        queryKey: ['visitors'],
        queryFn: visitorService.getAll,
    });
};

export const useRegisterVisitor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VisitorRequest) => visitorService.register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visitors'] });
        },
    });
};

// ==================== PAYMENTS HOOKS ====================
export const usePayments = () => {
    return useQuery({
        queryKey: ['payments'],
        queryFn: paymentService.getAll,
    });
};

export const usePaymentDues = () => {
    return useQuery({
        queryKey: ['payments', 'dues'],
        queryFn: paymentService.getDues,
    });
};

export const usePayPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => paymentService.pay(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });
};

// ==================== LAUNDRY HOOKS ====================
export const useLaundry = () => {
    return useQuery({
        queryKey: ['laundry'],
        queryFn: laundryService.getAll,
    });
};

export const useScheduleLaundry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LaundryRequest) => laundryService.schedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['laundry'] });
        },
    });
};

export const useCollectLaundry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => laundryService.markCollected(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['laundry'] });
        },
    });
};

// ==================== EMERGENCY HOOKS ====================
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

// Warden hooks
export const useActiveAlerts = () => {
    return useQuery({
        queryKey: ['emergency', 'active'],
        queryFn: emergencyService.getActive,
        refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
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
        // Refetch all active queries
        await queryClient.refetchQueries();
        setRefreshing(false);
    }, [queryClient]);

    return { refreshing, onRefresh };
};

// ==================== NOTIFICATION HOOKS ====================
// Paginated notifications hook with Load More support
export const useNotifications = (page: number = 1, limit: number = 15) => {
    return useQuery({
        queryKey: ['notifications', page, limit],
        queryFn: () => notificationService.getAll(page, limit),
    });
};

export const useUnreadNotificationCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: notificationService.getUnreadCount,
        refetchInterval: 30000, // Refresh every 30 seconds
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

// ==================== QUERY KEY FACTORY ====================
// Centralized query key factory for consistency and better cache management
export const queryKeys = {
    // Parent keys
    parent: {
        all: ['parent'] as const,
        children: () => [...queryKeys.parent.all, 'children'] as const,
        pendingPasses: () => [...queryKeys.parent.all, 'pending-passes'] as const,
        allPasses: (page?: number, studentId?: string) => [...queryKeys.parent.all, 'passes', { page, studentId }] as const,
        todayAttendance: () => [...queryKeys.parent.all, 'today-attendance'] as const,
        childAttendance: (studentId: string, page: number) => [...queryKeys.parent.all, 'attendance', studentId, page] as const,
    },
    // Admin keys
    admin: {
        all: ['admin'] as const,
        users: (params?: any) => [...queryKeys.admin.all, 'users', params] as const,
        userRelations: (userId: string) => [...queryKeys.admin.all, 'relations', userId] as const,
        parentLinks: (page?: number) => [...queryKeys.admin.all, 'parent-links', page] as const,
    },
};

// ==================== PARENT HOOKS ====================
// Parent hooks with smart caching to reduce unnecessary requests

import { parentService, adminService, ParentChild, PendingGatePass, ChildAttendance, AdminUser, ParentStudentLink } from './services';

/**
 * Get all children linked to parent
 * - Long staleTime (10 min) as children list rarely changes
 * - Refetch on mount only if stale
 */
export const useParentChildren = () => {
    return useQuery({
        queryKey: queryKeys.parent.children(),
        queryFn: parentService.getChildren,
        staleTime: 1000 * 60 * 10, // 10 minutes - rarely changes
        gcTime: 1000 * 60 * 60, // 1 hour
        refetchOnMount: 'always', // Always ensure fresh data on screen mount
    });
};

/**
 * Get pending passes awaiting parent approval
 * - Short staleTime (30 sec) as this is time-sensitive
 * - Auto-refetch every 60 seconds for near real-time updates
 */
export const useParentPendingPasses = () => {
    return useQuery({
        queryKey: queryKeys.parent.pendingPasses(),
        queryFn: parentService.getPendingPasses,
        staleTime: 1000 * 30, // 30 seconds - time sensitive
        refetchInterval: 1000 * 60, // Refetch every minute
        refetchOnMount: 'always',
    });
};

/**
 * Get all children's gate pass history
 * - Medium staleTime (5 min) - history doesn't change often
 * - Paginated for performance
 */
export const useParentAllPasses = (page: number = 1, studentId?: string) => {
    return useQuery({
        queryKey: queryKeys.parent.allPasses(page, studentId),
        queryFn: () => parentService.getAllPasses(page, 20, studentId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        placeholderData: (previousData: any) => previousData, // Keep showing old data while fetching
    });
};

/**
 * Approve a gate pass - with optimistic update
 */
export const useParentApprovePass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (passId: string) => parentService.approvePass(passId),
        // Optimistic update - remove from pending list immediately
        onMutate: async (passId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.parent.pendingPasses() });

            // Snapshot previous value
            const previousPasses = queryClient.getQueryData<PendingGatePass[]>(queryKeys.parent.pendingPasses());

            // Optimistically remove the pass
            if (previousPasses) {
                queryClient.setQueryData(
                    queryKeys.parent.pendingPasses(),
                    previousPasses.filter(p => p._id !== passId)
                );
            }

            return { previousPasses };
        },
        onError: (err, passId, context) => {
            // Rollback on error
            if (context?.previousPasses) {
                queryClient.setQueryData(queryKeys.parent.pendingPasses(), context.previousPasses);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: queryKeys.parent.pendingPasses() });
            queryClient.invalidateQueries({ queryKey: queryKeys.parent.allPasses() });
        },
    });
};

/**
 * Reject a gate pass - with optimistic update
 */
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

/**
 * Get today's attendance for all children
 * - Very short staleTime (1 min) - real-time important
 * - Auto-refetch every 2 minutes
 */
export const useParentTodayAttendance = () => {
    return useQuery({
        queryKey: queryKeys.parent.todayAttendance(),
        queryFn: parentService.getTodayAttendance,
        staleTime: 1000 * 60, // 1 minute
        refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
        refetchOnMount: 'always',
    });
};

/**
 * Get attendance history for a specific child
 * - Medium staleTime (10 min) - historical data
 */
export const useParentChildAttendance = (studentId: string, page: number = 1) => {
    return useQuery({
        queryKey: queryKeys.parent.childAttendance(studentId, page),
        queryFn: () => parentService.getChildAttendance(studentId, page),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!studentId, // Only run if studentId exists
    });
};

// ==================== ADMIN HOOKS ====================
// Admin hooks with caching and optimistic updates for better UX

/**
 * Get users with filters
 * - Short staleTime (2 min) - admin may see recent changes
 */
export const useAdminUsers = (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: queryKeys.admin.users(params),
        queryFn: () => adminService.getUsers(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
        placeholderData: (previousData: any) => previousData,
    });
};

/**
 * Get user's relations
 */
export const useAdminUserRelations = (userId: string) => {
    return useQuery({
        queryKey: queryKeys.admin.userRelations(userId),
        queryFn: () => adminService.getUserRelations(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Update user role - with optimistic update
 */
export const useAdminUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            adminService.updateUserRole(userId, role),
        onMutate: async ({ userId, role }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['admin', 'users'] });

            // We can't easily do optimistic update here due to filters
            // Just show loading state
            return {};
        },
        onSuccess: () => {
            // Invalidate all user queries to refresh
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

/**
 * Get all parent-student links
 */
export const useAdminParentLinks = (page: number = 1) => {
    return useQuery({
        queryKey: queryKeys.admin.parentLinks(page),
        queryFn: () => adminService.getParentLinks(page),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Link parent to student
 */
export const useAdminLinkParent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { parentId: string; studentId: string; relationship: 'Father' | 'Mother' | 'Guardian' }) =>
            adminService.linkParent(data),
        onSuccess: () => {
            // Invalidate parent links
            queryClient.invalidateQueries({ queryKey: ['admin', 'parent-links'] });
            // Also invalidate user relations
            queryClient.invalidateQueries({ queryKey: ['admin', 'relations'] });
        },
    });
};

/**
 * Unlink parent from student - with optimistic update
 */
export const useAdminUnlinkParent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (linkId: string) => adminService.unlinkParent(linkId),
        onMutate: async (linkId) => {
            await queryClient.cancelQueries({ queryKey: ['admin', 'parent-links'] });

            // Get current links data (could be paginated)
            const allData = queryClient.getQueriesData({ queryKey: ['admin', 'parent-links'] });

            // Optimistically remove from all cached pages
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
            // Rollback
            context?.allData?.forEach(([queryKey, data]: [any, any]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'parent-links'] });
        },
    });
};

// ==================== PREFETCH HELPERS ====================
// For prefetching data before navigation

export const usePrefetchParentData = () => {
    const queryClient = useQueryClient();

    return useCallback(() => {
        // Prefetch children data
        queryClient.prefetchQuery({
            queryKey: queryKeys.parent.children(),
            queryFn: parentService.getChildren,
            staleTime: 1000 * 60 * 10,
        });

        // Prefetch pending passes
        queryClient.prefetchQuery({
            queryKey: queryKeys.parent.pendingPasses(),
            queryFn: parentService.getPendingPasses,
            staleTime: 1000 * 30,
        });
    }, [queryClient]);
};

export const usePrefetchAdminData = () => {
    const queryClient = useQueryClient();

    return useCallback(() => {
        // Prefetch users
        queryClient.prefetchQuery({
            queryKey: queryKeys.admin.users({}),
            queryFn: () => adminService.getUsers({}),
            staleTime: 1000 * 60 * 2,
        });

        // Prefetch parent links
        queryClient.prefetchQuery({
            queryKey: queryKeys.admin.parentLinks(1),
            queryFn: () => adminService.getParentLinks(1),
            staleTime: 1000 * 60 * 5,
        });
    }, [queryClient]);
};

// ==================== WARDEN HOOKS ====================

export const useWardenDashboardStats = () => {
    return useQuery({
        queryKey: ['warden', 'dashboard-stats'],
        queryFn: adminService.getWardenDashboardStats,
        staleTime: 1000 * 30, // 30 seconds - stats change frequently
        refetchInterval: 60000, // Refresh every minute
    });
};

export const useWardenStudents = (page: number = 1, limit: number = 20, search?: string) => {
    return useQuery({
        queryKey: ['warden', 'students', page, limit, search],
        queryFn: () => adminService.getWardenStudents(page, limit, search),
        staleTime: 1000 * 60, // 1 minute
    });
};

export const useStudentDetail = (studentId: string) => {
    return useQuery({
        queryKey: ['warden', 'student', studentId],
        queryFn: () => adminService.getStudentDetail(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60, // 1 minute
    });
};

export const useWardenMarkAttendance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (studentId: string) => adminService.wardenMarkAttendance(studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warden'] });
        },
    });
};

// ==================== ADMIN CONFIG HOOKS ====================

export const useSystemConfig = () => {
    return useQuery({
        queryKey: ['admin', 'config'],
        queryFn: adminService.getSystemConfig,
        staleTime: 1000 * 60 * 5, // 5 minutes - config rarely changes
    });
};

export const useUpdateSystemConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.updateSystemConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'config'] });
        },
    });
};

export const useSystemStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: adminService.getSystemStats,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

// ==================== ENTRY/EXIT TRACKING HOOKS ====================

export const useStudentsOut = () => {
    return useQuery({
        queryKey: ['gatepass', 'students-out'],
        queryFn: adminService.getStudentsOut,
        staleTime: 1000 * 30, // 30 seconds - real-time tracking
        refetchInterval: 1000 * 60, // Auto-refresh every minute
    });
};

export const useRecentEntries = () => {
    return useQuery({
        queryKey: ['gatepass', 'recent-entries'],
        queryFn: adminService.getRecentEntries,
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 60, // Auto-refresh every minute
    });
};

export const useActivityLogs = (page = 1, limit = 50) => {
    return useQuery({
        queryKey: ['gatepass', 'logs', page, limit],
        queryFn: () => adminService.getActivityLogs(page, limit),
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 60, // Auto-refresh every minute
    });
};

