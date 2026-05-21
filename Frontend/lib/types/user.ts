// lib/types/user.ts — User and authentication types
export type UserRole = 'student' | 'admin' | 'warden' | 'mess_staff' | 'guard' | 'parent' | 'helper';

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
    year?: number; // Academic year (1-4) — only for students
    token?: string;
}

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
    role?: UserRole;
    year?: number; // Academic year (1-4) — only for students
    parentEmail?: string; // For student-parent auto-linking
}
