import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    avatar: string;
    role: 'student' | 'admin' | 'warden' | 'mess_staff' | 'guard' | 'parent';
    parentEmail?: string; // For auto-linking parents during student registration
    createdAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

// Parent-Student Relationship Types
export interface IParentStudent extends Document {
    parent: Types.ObjectId;
    student: Types.ObjectId;
    relationship: 'Father' | 'Mother' | 'Guardian';
    linkedBy: Types.ObjectId;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

// Gate Pass Types
export interface IGatePass extends Document {
    user: Types.ObjectId;
    reason: string;
    fromDate: Date;
    toDate: Date;
    status: 'PENDING_PARENT' | 'PENDING_WARDEN' | 'APPROVED' | 'REJECTED';
    qrValue?: string;
    // Parent approval tracking
    parentApprovedBy?: Types.ObjectId;
    parentApprovedAt?: Date;
    parentRejectionReason?: string;
    // Warden approval tracking
    approvedBy?: Types.ObjectId;
    rejectionReason?: string;
    // Validation tracking
    validatedBy?: Types.ObjectId;
    validatedAt?: Date;
    // Entry/Exit tracking (guard marks when student goes out and comes in)
    exitTime?: Date;
    exitMarkedBy?: Types.ObjectId;
    entryTime?: Date;
    entryMarkedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Notice Types
export interface INotice extends Document {
    title: string;
    description: string;
    urgent: boolean;
    source: 'warden' | 'mess_staff' | 'system';
    createdBy: Types.ObjectId;
    createdAt: Date;
}

// Mess Menu Types
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
export type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface IMessMenu extends Document {
    day: DayType;
    meals: {
        Breakfast: string[];
        Lunch: string[];
        Dinner: string[];
    };
    timings: {
        Breakfast: { start: string; end: string };
        Lunch: { start: string; end: string };
        Dinner: { start: string; end: string };
    };
    updatedBy?: Types.ObjectId;
    updatedAt: Date;
}

// Complaint Types
export interface IComplaint extends Document {
    user: Types.ObjectId;
    category: 'Plumbing' | 'Electricity' | 'WiFi' | 'Other';
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    resolvedAt?: Date;
    createdAt: Date;
}

// Attendance Types
export interface IAttendance extends Document {
    user: Types.ObjectId;
    date: Date;
    markedAt: Date;
    markedByWarden?: Types.ObjectId; // If marked manually by warden
    location?: {
        latitude: number;
        longitude: number;
        distanceFromHostel?: number; // Distance in meters at time of marking
        manualEntry?: boolean; // True if marked by warden
    };
}

// Visitor Types
export interface IVisitor extends Document {
    user: Types.ObjectId;
    name: string;
    relation: string;
    phone: string;
    expectedDate: Date;
    expectedTime: string;
    status: 'Expected' | 'Checked-In' | 'Visited';
    checkInTime?: Date;
    checkOutTime?: Date;
    createdAt: Date;
}

// Payment Types
export interface IPayment extends Document {
    user: Types.ObjectId;
    title: string;
    amount: number;
    type: 'Hostel Fee' | 'Mess Fee' | 'Laundry' | 'Other';
    dueDate: Date;
    status: 'Pending' | 'Paid';
    paidAt?: Date;
    createdAt: Date;
}

// Laundry Types
export interface ILaundry extends Document {
    user: Types.ObjectId;
    items: string;
    scheduledDate: Date;
    status: 'Scheduled' | 'In Progress' | 'Ready' | 'Collected';
    createdAt: Date;
}

// Emergency Types
export interface IEmergency extends Document {
    user: Types.ObjectId;
    type: 'Medical' | 'Ragging' | 'Fire' | 'Other';
    message: string;
    location: string;
    status: 'active' | 'acknowledged' | 'resolved';
    acknowledgedBy?: Types.ObjectId;
    acknowledgedAt?: Date;
    createdAt: Date;
}

// Auth Request with User
export interface AuthRequest extends Request {
    user?: IUser;
}
