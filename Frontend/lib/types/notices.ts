// lib/types/notices.ts — Notice types
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
