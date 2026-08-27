// lib/hooks/queryKeys.ts — Centralized query key factory
export const queryKeys = {
    parent: {
        all: ['parent'] as const,
        children: () => [...queryKeys.parent.all, 'children'] as const,
        pendingPasses: () => [...queryKeys.parent.all, 'pending-passes'] as const,
        allPasses: (page?: number, studentId?: string) => [...queryKeys.parent.all, 'passes', { page, studentId }] as const,
    },
    admin: {
        all: ['admin'] as const,
        users: (params?: any) => [...queryKeys.admin.all, 'users', params] as const,
        userRelations: (userId: string) => [...queryKeys.admin.all, 'relations', userId] as const,
        parentLinks: (page?: number) => [...queryKeys.admin.all, 'parent-links', page] as const,
    },
};
