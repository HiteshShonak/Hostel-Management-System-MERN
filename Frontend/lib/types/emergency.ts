// lib/types/emergency.ts — Emergency and SOS types
import { User } from './user';

export interface EmergencyContact {
    name: string;
    phone: string;
    type?: 'warden' | 'security' | 'medical' | 'police' | 'other';
    role?: string;
}

export interface Emergency {
    _id: string;
    user: string | User;
    type: 'Medical' | 'Ragging' | 'Fire' | 'Other';
    message?: string;
    location?: string;
    status: 'active' | 'acknowledged' | 'resolved';
    acknowledgedBy?: string | User;
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
