// lib/types/gatepass.ts — Gate pass types
import { User } from './user';

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
    parentRejectionReason?: string;
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
