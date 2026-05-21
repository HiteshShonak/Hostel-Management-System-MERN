// lib/types/complaints.ts — Complaint types
import { User } from './user';

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
