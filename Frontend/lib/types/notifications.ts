// lib/types/notifications.ts — Push notification types
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
