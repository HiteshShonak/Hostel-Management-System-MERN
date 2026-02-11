// User Types
export type UserRole = 'student' | 'admin' | 'warden' | 'mess_staff' | 'guard' | 'parent';

export interface User {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    avatar: string;
    role: UserRole;
    token?: string;
}

// Auth Types
export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    role?: UserRole; // For testing different roles
    parentEmail?: string; // For student-parent auto-linking
}

// Gate Pass Types
export interface GatePass {
    _id: string;
    user: string | User;
    reason: string;
    fromDate: string;
    toDate: string;
    status: 'PENDING_PARENT' | 'PENDING_WARDEN' | 'PENDING' | 'APPROVED' | 'REJECTED';
    qrValue: string;
    approvedBy?: string;
    parentApprovedBy?: string;
    validatedBy?: string;
    validatedAt?: string;
    rejectionReason?: string;
    // Entry/Exit tracking
    exitTime?: string;
    exitMarkedBy?: string;
    entryTime?: string;
    entryMarkedBy?: string;
    createdAt: string;
    isLate?: boolean;
    lateNote?: string;
}

export interface GatePassRequest {
    reason: string;
    fromDate: string;
    toDate: string;
}

export interface GatePassValidation {
    valid: boolean;
    error?: string;
    status?: string;
    isStudentOutside?: boolean;
    pass?: GatePass;
}

// Notice Types
export type NoticeSource = 'warden' | 'mess_staff' | 'system';

export interface Notice {
    _id: string;
    title: string;
    description: string;
    urgent: boolean;
    source?: NoticeSource;
    createdBy?: string | { _id: string; name: string };
    createdAt: string;
}

export interface NoticeRequest {
    title: string;
    description: string;
    urgent?: boolean;
}

// Mess Menu Types
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
export type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface MealTiming {
    start: string;
    end: string;
}

export interface MessTimings {
    Breakfast: MealTiming;
    Lunch: MealTiming;
    Dinner: MealTiming;
}

export interface MessMenu {
    [day: string]: {
        Breakfast: string[];
        Lunch: string[];
        Dinner: string[];
    };
}

export interface MessMenuResponse {
    menu: MessMenu;
    timings: MessTimings;
}

export interface MessMenuUpdate {
    meals: {
        Breakfast: string[];
        Lunch: string[];
        Dinner: string[];
    };
}

// Food Rating Types
export interface FoodRating {
    _id: string;
    mealType: MealType;
    rating: number;
    comment?: string;
    date: string;
}

export interface FoodRatingRequest {
    mealType: MealType;
    rating: number;
    comment?: string;
}

export interface FoodRatingAverage {
    [mealType: string]: {
        average: number;
        count: number;
    };
}

// Complaint Types
export interface Complaint {
    _id: string;
    user: string | User;
    category: 'Plumbing' | 'Electricity' | 'WiFi' | 'Other';
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    isUrgent?: boolean;
    createdAt: string;
}

export interface ComplaintRequest {
    category: string;
    title: string;
    description: string;
    isUrgent?: boolean;
}

// Attendance Types
export interface Attendance {
    _id: string;
    user: string;
    date: string;
    markedAt: string;
    location?: {
        distanceFromHostel?: number;
    };
}

export interface AttendanceStats {
    present: number;
    absent: number;
    total: number;
    percentage: number;
    month: string;
}

// Visitor Types
export interface Visitor {
    _id: string;
    name: string;
    relation: string;
    phone: string;
    purpose?: string;
    expectedDate: string;
    expectedTime: string;
    status: 'Expected' | 'Checked-In' | 'Visited';
    checkInTime?: string;
    checkOutTime?: string;
    createdAt: string;
}

export interface VisitorRequest {
    name: string;
    relation: string;
    phone: string;
    purpose?: string;
    expectedDate: string;
    expectedTime: string;
}

// Payment Types
export interface Payment {
    _id: string;
    title: string;
    amount: number;
    type: string;
    dueDate: string;
    status: 'Pending' | 'Paid';
    paidAt?: string;
    createdAt: string;
}

export interface PaymentDues {
    totalDue: number;
    payments: Payment[];
}

// Laundry Types
export interface Laundry {
    _id: string;
    items: string;
    clothesCount?: number;
    scheduledDate: string;
    droppedAt?: string;
    status: 'Scheduled' | 'In Progress' | 'Ready' | 'Collected';
    createdAt: string;
}

export interface LaundryRequest {
    items: string;
    clothesCount?: number;
    scheduledDate: string;
}

// Emergency Types
export interface EmergencyContact {
    name: string;
    phone: string;
    role?: string;
}

export interface Emergency {
    _id: string;
    user: string | User;
    type: 'Medical' | 'Ragging' | 'Fire' | 'Other';
    message: string;
    location: string;
    status: 'active' | 'acknowledged' | 'resolved';
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    createdAt: string;
}

export interface EmergencyRequest {
    type: 'Medical' | 'Ragging' | 'Fire' | 'Other';
    message?: string;
    location?: string;
}

export interface SOSResponse {
    success: boolean;
    message: string;
    emergency: Emergency;
    alertedContacts: EmergencyContact[];
}

// Notification Types
export type NotificationType = 'notice' | 'gatepass' | 'complaint' | 'system';

export interface AppNotification {
    _id: string;
    user: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: string;
}
