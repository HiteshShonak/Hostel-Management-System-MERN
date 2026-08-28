import api from '../api';
import { User, GatePass } from '../types';

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    role: string;
    year?: number;
    createdAt: string;
}

export interface ParentStudentLink {
    _id: string;
    parent: { _id: string; name: string; email: string };
    student: { _id: string; name: string; rollNo: string; room: string; hostel: string };
    relationship: string;
    linkedBy: { _id: string; name: string };
    status: string;
    createdAt: string;
}

export const adminService = {
    getUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.role) searchParams.append('role', params.role);
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', String(params.page));
        if (params?.limit) searchParams.append('limit', String(params.limit));
        const response = await api.get<{ users: AdminUser[]; pagination: any; stats?: any }>(
            `/admin/users?${searchParams.toString()}`
        );
        return response.data || { users: [], pagination: {} };
    },

    getUserRelations: async (userId: string): Promise<ParentStudentLink[]> => {
        const response = await api.get<ParentStudentLink[]>(`/admin/user/${userId}/relations`);
        return response.data || [];
    },

    updateUserRole: async (userId: string, role: string): Promise<AdminUser> => {
        const response = await api.put<AdminUser>(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    getParentLinks: async (page = 1, limit = 50) => {
        const response = await api.get<{ links: ParentStudentLink[]; pagination: any }>(
            `/admin/parent-links?page=${page}&limit=${limit}`
        );
        return response.data || { links: [], pagination: {} };
    },

    linkParent: async (data: { parentId: string; studentId: string; relationship: 'Father' | 'Mother' | 'Guardian' }) => {
        const response = await api.post<ParentStudentLink>('/admin/link-parent', data);
        return response.data;
    },

    unlinkParent: async (linkId: string): Promise<void> => {
        await api.delete(`/admin/link-parent/${linkId}`);
    },

    getWardenDashboardStats: async () => {
        const response = await api.get<{
            totalStudents: number;
            studentsOut: number;
            studentsInside: number;
            pendingPasses: number;
        }>('/admin/warden/dashboard-stats');
        return response.data;
    },

    getWardenStudents: async (page = 1, limit = 20, search?: string) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) params.append('search', search);
        const response = await api.get<{
            students: Array<{
                _id: string;
                name: string;
                email: string;
                rollNo: string;
                room: string;
                hostel: string;
                phone: string;
                avatar: string;
                year?: number;
                isOut: boolean;
            }>;
            pagination: { total: number; page: number; limit: number; pages: number };
        }>(`/admin/warden/students?${params.toString()}`);
        return response.data;
    },

    getStudentDetail: async (studentId: string) => {
        const response = await api.get<{
            student: User;
            passes: { recent: GatePass[]; isCurrentlyOut: boolean; activePass: GatePass | null };
        }>(`/admin/warden/students/${studentId}`);
        return response.data;
    },

    getSystemConfig: async () => {
        const response = await api.get<{
            _id: string;
            hostelCoords: { latitude: number; longitude: number; name: string };
            geofenceRadiusMeters: number;
            appConfig: { maxGatePassDays: number; maxPendingPasses: number };
            updatedAt: string;
        }>('/admin/config');
        return response.data;
    },

    updateSystemConfig: async (config: {
        appConfig?: { maxGatePassDays?: number; maxPendingPasses?: number };
    }): Promise<void> => {
        await api.put('/admin/config', config);
    },

    getSystemStats: async () => {
        const response = await api.get<{
            users: {
                total: number;
                students: number;
                byRole: { student: number; warden: number; parent: number; admin: number; guard: number; mess_staff: number; helper: number };
            };
            gatePasses: { total: number; approved: number; pending: number; rejected: number };
            notices: number;
            pendingComplaints: number;
        }>('/admin/system-stats');
        return response.data;
    },

    getStudentsOut: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/students-out');
        return response.data || [];
    },

    getRecentEntries: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/recent-entries');
        return response.data || [];
    },

    getActivityLogs: async (page = 1, limit = 50) => {
        const response = await api.get<{
            logs: Array<{
                _id: string;
                gatePass: { _id: string; reason: string; fromDate: string; toDate: string; qrValue: string };
                user: { _id: string; name: string; rollNo: string; room: string; hostel: string; phone: string };
                action: 'EXIT' | 'ENTRY';
                timestamp: string;
                markedBy: { _id: string; name: string; role: string };
            }>;
            pagination: { total: number; page: number; limit: number; hasNext: boolean };
        }>(`/gatepass/logs?page=${page}&limit=${limit}`);
        return response.data || { logs: [], pagination: { total: 0, page: 1, limit, hasNext: false } };
    },
};
