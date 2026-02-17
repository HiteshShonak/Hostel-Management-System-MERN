// src/services/notification.service.ts
// handles automatic notifications

import Notification from '../models/Notification';
import User from '../models/User';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { sendPushToUser } from './push-notification.service';

export type NotificationType = 'notice' | 'gatepass' | 'complaint' | 'system' | 'visitor';

interface CreateNotificationParams {
    userId: string | mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    relatedId?: string | mongoose.Types.ObjectId;
}

// notify one person
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

        // send push
        sendPushToUser(params.userId, params.title, params.message, {
            type: params.type,
            link: params.link,
            relatedId: params.relatedId?.toString(),
        }).catch(err => {
            // ignore push errors
            logger.debug('Push notification failed for user', { userId: params.userId, error: err });
        });
    } catch (error: any) {
        logger.error('Failed to create notification', { error: error.message });
    }
};

// notify a bunch of people
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

        // blast push notifications
        const { sendPushToMultipleUsers } = await import('./push-notification.service');
        sendPushToMultipleUsers(userIds, title, message, {
            type,
            link,
            relatedId: relatedId?.toString(),
        }).catch(err => {
            logger.debug('Batch push notifications partially failed', { error: err });
        });
    } catch (error: any) {
        logger.error('Failed to create bulk notifications', { error: error.message });
    }
};

// tell all students
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

// tell everyone else
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
