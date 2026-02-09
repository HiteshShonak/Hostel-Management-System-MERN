// src/services/notification.service.ts
// Service for creating notifications automatically

import Notification from '../models/Notification';
import User from '../models/User';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export type NotificationType = 'notice' | 'gatepass' | 'complaint' | 'system' | 'visitor';

interface CreateNotificationParams {
    userId: string | mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    relatedId?: string | mongoose.Types.ObjectId;
}

// Create a notification for a single user
export const createNotification = async (params: CreateNotificationParams) => {
    try {
        await Notification.create({
            user: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            link: params.link,
            relatedId: params.relatedId,
        });
    } catch (error: any) {
        logger.error('Failed to create notification', { error: error.message });
    }
};

// Create notifications for multiple users
export const createNotificationsForUsers = async (
    userIds: (string | mongoose.Types.ObjectId)[],
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    relatedId?: string | mongoose.Types.ObjectId
) => {
    try {
        const notifications = userIds.map((userId) => ({
            user: userId,
            type,
            title,
            message,
            link,
            relatedId,
        }));
        await Notification.insertMany(notifications);
    } catch (error: any) {
        logger.error('Failed to create bulk notifications', { error: error.message });
    }
};

// Notify all students (for notices)
export const notifyAllStudents = async (
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    relatedId?: string | mongoose.Types.ObjectId
) => {
    try {
        const students = await User.find({ role: 'student' }).select('_id');
        const studentIds = students.map((s) => s._id);
        await createNotificationsForUsers(studentIds, type, title, message, link, relatedId);
    } catch (error: any) {
        logger.error('Failed to notify all students', { error: error.message });
    }
};

// Notify all users except the creator
export const notifyAllUsersExcept = async (
    excludeUserId: string | mongoose.Types.ObjectId,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
) => {
    try {
        const users = await User.find({ _id: { $ne: excludeUserId } }).select('_id');
        const userIds = users.map((u) => u._id);
        await createNotificationsForUsers(userIds, type, title, message, link);
    } catch (error: any) {
        logger.error('Failed to notify users', { error: error.message });
    }
};
