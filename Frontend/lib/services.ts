import api, { saveToken, removeToken } from './api';
import {
    User,
    LoginData,
    RegisterData,
    GatePass,
    GatePassRequest,
    GatePassValidation,
    Notice,
    NoticeRequest,
    MessMenu,
    MessMenuUpdate,
    MessMenuResponse,
    MessTimings,
    FoodRating,
    FoodRatingRequest,
    FoodRatingAverage,
    Complaint,
    ComplaintRequest,
    Attendance,
    AttendanceStats,
    EmergencyContact,
    EmergencyRequest,
    Emergency,
    SOSResponse,
    AppNotification,
} from './types';

// ==================== AUTH ====================
export const authService = {
    login: async (data: LoginData): Promise<User> => {
        const response = await api.post('/auth/login', data);
        const userData = response.data as User & { token?: string };

        if (userData?.token) {
            await saveToken(userData.token);
        }
        return userData;
    },

    register: async (data: RegisterData): Promise<User> => {
        const response = await api.post('/auth/register', data);
        const userData = response.data as User & { token?: string };

        if (userData?.token) {
            await saveToken(userData.token);
        }
        return userData;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    updateProfile: async (data: { name?: string; phone?: string; room?: string }): Promise<User> => {
        const response = await api.put<User>('/auth/profile', data);
        return response.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.put('/auth/password', { currentPassword, newPassword });
    },

    updatePushToken: async (pushToken: string): Promise<void> => {
        await api.put('/auth/push-token', { pushToken });
    },

    logout: async () => {
        await removeToken();
    },
};

// ==================== GATE PASS ====================
export const gatePassService = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<GatePass>> => {
        const response = await api.get<{ passes: GatePass[]; pagination: any }>(`/gatepass?page=${page}&limit=${limit}`);
        return {
            data: response.data?.passes || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    getCurrent: async (): Promise<GatePass | null> => {
        const response = await api.get<GatePass | null>('/gatepass/current');
        return response.data;
    },

    request: async (data: GatePassRequest): Promise<GatePass> => {
        const response = await api.post<GatePass>('/gatepass', data);
        return response.data;
    },

    // Warden endpoints
    getPending: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/pending');
        return response.data;
    },

    getAllPasses: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/all');
        return response.data;
    },

    // Warden - Get ALL passes with pagination (for pass history screen)
    getAllPassesHistory: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<GatePass>> => {
        const response = await api.get<{ passes: GatePass[]; pagination: any }>(`/gatepass/all?page=${page}&limit=${limit}`);
        return {
            data: response.data?.passes || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 20, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    approve: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/approve`);
        return response.data;
    },

    reject: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/reject`);
        return response.data;
    },

    // Staff endpoint
    validate: async (qrValue: string): Promise<GatePassValidation> => {
        const response = await api.post<GatePassValidation>('/gatepass/validate', { qrValue });
        return response.data;
    },

    // Guard entry/exit tracking
    markExit: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/exit`);
        return response.data;
    },

    markEntry: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/entry`);
        return response.data;
    },
};

// Pagination response type
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// ==================== NOTICES ====================
export const noticeService = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Notice>> => {
        const response = await api.get<{ notices: Notice[]; pagination: any }>(`/notices?page=${page}&limit=${limit}`);
        return {
            data: response.data?.notices || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    getOne: async (id: string): Promise<Notice> => {
        const response = await api.get<Notice>(`/notices/${id}`);
        return response.data;
    },

    // Warden endpoints
    create: async (data: NoticeRequest): Promise<Notice> => {
        const response = await api.post<Notice>('/notices', data);
        return response.data;
    },

    update: async (id: string, data: NoticeRequest): Promise<Notice> => {
        const response = await api.put<Notice>(`/notices/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/notices/${id}`);
    },
};

// ==================== MESS MENU ====================
export const messMenuService = {
    getFullMenu: async (): Promise<MessMenuResponse> => {
        const response = await api.get<MessMenuResponse>('/messmenu');
        return response.data;
    },

    getDayMenu: async (day: string) => {
        const response = await api.get(`/messmenu/${day}`);
        return response.data;
    },

    updateDayMenu: async (day: string, data: MessMenuUpdate) => {
        const response = await api.put(`/messmenu/${day}`, data);
        return response.data;
    },

    updateTimings: async (timings: MessTimings) => {
        const response = await api.put('/messmenu/timings', { timings });
        return response.data;
    },
};


// ==================== FOOD RATING ====================
export const foodRatingService = {
    rate: async (data: FoodRatingRequest): Promise<FoodRating> => {
        const response = await api.post<FoodRating>('/food-rating', data);
        return response.data;
    },

    getAverage: async (date?: string): Promise<FoodRatingAverage> => {
        const params = date ? `?date=${date}` : '';
        const response = await api.get<FoodRatingAverage>(`/food-rating/average${params}`);
        return response.data;
    },

    getMyRatings: async (date?: string): Promise<Record<string, { rating: number; comment?: string }>> => {
        const params = date ? `?date=${date}` : '';
        const response = await api.get(`/food-rating/my-ratings${params}`);
        return response.data;
    },
};

// ==================== COMPLAINTS ====================
export const complaintService = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Complaint>> => {
        const response = await api.get<{ complaints: Complaint[]; pagination: any }>(`/complaints?page=${page}&limit=${limit}`);
        return {
            data: response.data?.complaints || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    create: async (data: ComplaintRequest): Promise<Complaint> => {
        const response = await api.post<Complaint>('/complaints', data);
        return response.data;
    },

    // Warden endpoints
    getAllForWarden: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Complaint>> => {
        const response = await api.get<{ complaints: Complaint[]; pagination: any }>(`/complaints/all?page=${page}&limit=${limit}`);
        return {
            data: response.data?.complaints || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 20, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    resolve: async (id: string): Promise<Complaint> => {
        const response = await api.put<Complaint>(`/complaints/${id}/resolve`);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<Complaint> => {
        const response = await api.put<Complaint>(`/complaints/${id}/status`, { status });
        return response.data;
    },
};

// ==================== ATTENDANCE ====================
export interface LocationData {
    latitude: number;
    longitude: number;
}

export interface TodayAttendanceResponse {
    marked: boolean;
    attendance: Attendance | null;
    geofence?: {
        hostelName: string;
        radiusMeters: number;
        attendanceWindow: { start: number; end: number } | null;
    };
}

export const attendanceService = {
    getAll: async (): Promise<Attendance[]> => {
        const response = await api.get<{ attendance: Attendance[]; pagination: any }>('/attendance');
        return response.data?.attendance || [];
    },

    // Mark attendance with geolocation - required for geofence validation
    mark: async (location: LocationData): Promise<Attendance> => {
        const response = await api.post<Attendance>('/attendance/mark', location);
        return response.data;
    },

    getStats: async (): Promise<AttendanceStats> => {
        const response = await api.get<AttendanceStats>('/attendance/stats');
        return response.data;
    },

    checkToday: async (): Promise<TodayAttendanceResponse> => {
        const response = await api.get('/attendance/today');
        return response.data;
    },
};

// ==================== EMERGENCY ====================
export const emergencyService = {
    sendSOS: async (data: EmergencyRequest): Promise<SOSResponse> => {
        const response = await api.post<SOSResponse>('/emergency/sos', data);
        return response.data;
    },

    getContacts: async (): Promise<EmergencyContact[]> => {
        const response = await api.get<EmergencyContact[]>('/emergency/contacts');
        return response.data;
    },

    // Warden endpoints
    getActive: async (): Promise<Emergency[]> => {
        const response = await api.get<Emergency[]>('/emergency/active');
        return response.data;
    },

    getHistory: async (): Promise<Emergency[]> => {
        const response = await api.get<Emergency[]>('/emergency/history');
        return response.data;
    },

    acknowledge: async (id: string): Promise<Emergency> => {
        const response = await api.put<Emergency>(`/emergency/${id}/acknowledge`);
        return response.data;
    },

    resolve: async (id: string): Promise<Emergency> => {
        const response = await api.put<Emergency>(`/emergency/${id}/resolve`);
        return response.data;
    },
};

// ==================== NOTIFICATIONS ====================
export const notificationService = {
    getAll: async (page: number = 1, limit: number = 15): Promise<PaginatedResponse<AppNotification>> => {
        const response = await api.get<{ notifications: AppNotification[]; pagination: any }>(`/notifications?page=${page}&limit=${limit}`);
        return {
            data: response.data?.notifications || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 15, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ count: number }>('/notifications/unread-count');
        return response.data?.count || 0;
    },

    markAsRead: async (id: string): Promise<void> => {
        await api.put(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/read-all');
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    },
};

// ==================== PARENT SERVICES ====================
export interface ParentChild {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    relationship: string;
    linkedAt: string;
}

export interface PendingGatePass {
    _id: string;
    reason: string;
    fromDate: string;
    toDate: string;
    status: string;
    createdAt: string;
    student: {
        _id: string;
        name: string;
        rollNo: string;
        room: string;
        hostel: string;
        phone: string;
    };
}

export interface ChildAttendance {
    student: {
        _id: string;
        name: string;
        rollNo: string;
        room: string;
        hostel: string;
    };
    relationship: string;
    markedToday: boolean;
    attendanceTime?: string;
}

export const parentService = {
    // Get all linked children
    getChildren: async (): Promise<ParentChild[]> => {
        const response = await api.get<ParentChild[]>('/parent/children');
        return response.data || [];
    },

    // Get pending passes awaiting parent approval
    getPendingPasses: async (): Promise<PendingGatePass[]> => {
        const response = await api.get<PendingGatePass[]>('/parent/pending-passes');
        return response.data || [];
    },

    // Get all children's gate pass history with pagination
    getAllPasses: async (page: number = 1, limit: number = 20, studentId?: string): Promise<{ passes: any[]; pagination: any }> => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (studentId) params.append('studentId', studentId);
        const response = await api.get(`/parent/passes?${params.toString()}`);
        return response.data || { passes: [], pagination: {} };
    },

    // Approve a gate pass
    approvePass: async (passId: string): Promise<any> => {
        const response = await api.put(`/parent/passes/${passId}/approve`);
        return response.data;
    },

    // Reject a gate pass
    rejectPass: async (passId: string, reason?: string): Promise<any> => {
        const response = await api.put(`/parent/passes/${passId}/reject`, { reason });
        return response.data;
    },

    // Get today's attendance for all children
    getTodayAttendance: async (): Promise<ChildAttendance[]> => {
        const response = await api.get<ChildAttendance[]>('/parent/today-attendance');
        return response.data || [];
    },

    // Get attendance history for a specific child
    getChildAttendance: async (studentId: string, page: number = 1, limit: number = 30): Promise<{ attendance: any[]; pagination: any; todayMarked: boolean; todayAttendance: any }> => {
        const response = await api.get(`/parent/children/${studentId}/attendance?page=${page}&limit=${limit}`);
        return response.data || { attendance: [], pagination: {}, todayMarked: false, todayAttendance: null };
    },
};

// ==================== ADMIN SERVICES ====================
export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    role: string;
    createdAt: string;
}

export interface ParentStudentLink {
    _id: string;
    parent: {
        _id: string;
        name: string;
        email: string;
    };
    student: {
        _id: string;
        name: string;
        rollNo: string;
        room: string;
        hostel: string;
    };
    relationship: string;
    linkedBy: {
        _id: string;
        name: string;
    };
    status: string;
    createdAt: string;
}

export const adminService = {
    // Get all users with optional filters
    getUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<{ users: AdminUser[]; pagination: any; stats?: any }> => {
        const searchParams = new URLSearchParams();
        if (params?.role) searchParams.append('role', params.role);
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', String(params.page));
        if (params?.limit) searchParams.append('limit', String(params.limit));
        const response = await api.get(`/admin/users?${searchParams.toString()}`);
        return response.data || { users: [], pagination: {} };
    },

    // Get user's parent-student relations
    getUserRelations: async (userId: string): Promise<ParentStudentLink[]> => {
        const response = await api.get<ParentStudentLink[]>(`/admin/user/${userId}/relations`);
        return response.data || [];
    },

    // Update user role
    updateUserRole: async (userId: string, role: string): Promise<AdminUser> => {
        const response = await api.put<AdminUser>(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    // Get all parent-student links
    getParentLinks: async (page: number = 1, limit: number = 50): Promise<{ links: ParentStudentLink[]; pagination: any }> => {
        const response = await api.get(`/admin/parent-links?page=${page}&limit=${limit}`);
        return response.data || { links: [], pagination: {} };
    },

    // Link parent to student
    linkParent: async (data: { parentId: string; studentId: string; relationship: 'Father' | 'Mother' | 'Guardian' }): Promise<ParentStudentLink> => {
        const response = await api.post<ParentStudentLink>('/admin/link-parent', data);
        return response.data;
    },

    // Unlink parent from student
    unlinkParent: async (linkId: string): Promise<void> => {
        await api.delete(`/admin/link-parent/${linkId}`);
    },

    // ==================== WARDEN FUNCTIONS ====================

    // Get warden dashboard stats
    getWardenDashboardStats: async (): Promise<{
        totalStudents: number;
        studentsOut: number;
        studentsInside: number;
        todayAttendance: number;
        attendancePercentage: number;
        pendingPasses: number;
    }> => {
        const response = await api.get('/admin/warden/dashboard-stats');
        return response.data;
    },

    // Get students list for warden
    getWardenStudents: async (page: number = 1, limit: number = 20, search?: string): Promise<{
        students: Array<{
            _id: string;
            name: string;
            email: string;
            rollNo: string;
            room: string;
            hostel: string;
            phone: string;
            avatar: string;
            markedAttendanceToday: boolean;
            isOut: boolean;
        }>;
        pagination: { total: number; page: number; limit: number; pages: number };
    }> => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        if (search) params.append('search', search);
        const response = await api.get(`/admin/warden/students?${params.toString()}`);
        return response.data;
    },

    // Get student detail for warden
    getStudentDetail: async (studentId: string): Promise<{
        student: User;
        attendance: {
            markedToday: boolean;
            todayRecord: Attendance | null;
            monthlyRecords: Attendance[];
            monthlyPercentage: number;
            presentDays: number;
            totalDays: number;
        };
        passes: {
            recent: GatePass[];
            isCurrentlyOut: boolean;
            activePass: GatePass | null;
        };
    }> => {
        const response = await api.get(`/admin/warden/students/${studentId}`);
        return response.data;
    },

    // Warden marks attendance for student
    wardenMarkAttendance: async (studentId: string): Promise<Attendance> => {
        const response = await api.post<Attendance>(`/admin/warden/mark-attendance/${studentId}`);
        return response.data;
    },

    // ==================== SYSTEM CONFIG FUNCTIONS ====================

    // Get system configuration
    getSystemConfig: async (): Promise<{
        _id: string;
        hostelCoords: { latitude: number; longitude: number; name: string };
        geofenceRadiusMeters: number;
        attendanceWindow: { enabled: boolean; startHour: number; endHour: number; timezone: string };
        appConfig: { maxGatePassDays: number; maxPendingPasses: number; attendanceGracePeriod: number };
        updatedAt: string;
    }> => {
        const response = await api.get('/admin/config');
        return response.data;
    },

    // Update system configuration
    updateSystemConfig: async (config: {
        hostelCoords?: { latitude?: number; longitude?: number; name?: string };
        geofenceRadiusMeters?: number;
        attendanceWindow?: { enabled?: boolean; startHour?: number; endHour?: number; timezone?: string };
        appConfig?: { maxGatePassDays?: number; maxPendingPasses?: number; attendanceGracePeriod?: number };
    }): Promise<void> => {
        await api.put('/admin/config', config);
    },

    // Get system statistics
    getSystemStats: async (): Promise<{
        users: {
            total: number;
            students: number;
            byRole: { student: number; warden: number; parent: number; admin: number; guard: number; mess_staff: number }
        };
        gatePasses: { total: number; approved: number; pending: number; rejected: number };
        attendance: { monthlyRecords: number; todayRecords: number; averagePercentage: number; totalStudents: number };
        notices: number;
        pendingComplaints: number;
    }> => {
        const response = await api.get('/admin/system-stats');
        return response.data;
    },

    // Get students currently outside
    getStudentsOut: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/students-out');
        return response.data || [];
    },

    // Get recent entries (students who came in today)
    getRecentEntries: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/recent-entries');
        return response.data || [];
    },

    // Get activity logs (entry/exit history)
    getActivityLogs: async (page = 1, limit = 50): Promise<{
        logs: Array<{
            _id: string;
            gatePass: { _id: string; reason: string; fromDate: string; toDate: string; qrValue: string };
            user: { _id: string; name: string; rollNo: string; room: string; hostel: string; phone: string };
            action: 'EXIT' | 'ENTRY';
            timestamp: string;
            markedBy: { _id: string; name: string; role: string };
        }>;
        pagination: { total: number; page: number; limit: number; hasNext: boolean };
    }> => {
        const response = await api.get(`/gatepass/logs?page=${page}&limit=${limit}`);
        return response.data || { logs: [], pagination: { total: 0, page: 1, limit, hasNext: false } };
    },
};

