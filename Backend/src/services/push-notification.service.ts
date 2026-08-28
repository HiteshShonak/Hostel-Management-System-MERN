// src/services/push-notification.service.ts
// Push notification resolution and high-level dispatching service for users and roles

import { Types } from 'mongoose';
import User from '../models/User';
import { logger } from '../utils/logger';
import { PushMessage, dispatchExpoMessage, dispatchExpoBatches } from './expo-push.service';

export { PushMessage, PushTicket } from './expo-push.service';

// Send a single push notification by raw Expo token
export const sendPushNotification = async (
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<boolean> => {
    try {
        if (!pushToken) {
            logger.warn('No push token provided');
            return false;
        }

        const message: PushMessage = {
            to: pushToken,
            sound: 'default',
            title,
            body,
            data: data || {},
            priority: 'high',
        };

        const success = await dispatchExpoMessage(message);
        if (success) {
            logger.info('Push notification sent successfully', { title });
        }
        return success;
    } catch (error) {
        logger.error('Failed to send push notification', {
            error: error instanceof Error ? error.message : String(error),
            title,
        });
        return false;
    }
};

// Send a push notification to a specific user ID
export const sendPushToUser = async (
    userId: Types.ObjectId | string,
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<boolean> => {
    try {
        const user = await User.findById(userId).select('pushToken');

        if (!user || !user.pushToken) {
            logger.debug('User has no push token', { userId });
            return false;
        }

        return await sendPushNotification(user.pushToken, title, body, data);
    } catch (error) {
        logger.error('Failed to send push to user', {
            error: error instanceof Error ? error.message : String(error),
            userId,
        });
        return false;
    }
};

// Send push notifications to multiple user IDs in batches
export const sendPushToMultipleUsers = async (
    userIds: (Types.ObjectId | string)[],
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<{ sent: number; failed: number }> => {
    try {
        const users = await User.find({ _id: { $in: userIds }, pushToken: { $exists: true, $ne: null } })
            .select('pushToken')
            .exec();

        if (!users || users.length === 0) {
            logger.debug('No users with push tokens found', { userCount: userIds.length });
            return { sent: 0, failed: 0 };
        }

        const tokens = users.map(user => user.pushToken!);
        const messages: PushMessage[] = tokens.map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            data: data || {},
            priority: 'high',
        }));

        const result = await dispatchExpoBatches(messages, 100);
        logger.info('Batch push notifications sent', { sent: result.sent, failed: result.failed, total: tokens.length });
        return result;
    } catch (error) {
        logger.error('Failed to send batch push notifications', {
            error: error instanceof Error ? error.message : String(error),
            userCount: userIds.length,
        });
        return { sent: 0, failed: userIds.length };
    }
};

// Broadcast a push notification to all users having a specific role
export const sendPushToRole = async (
    role: string,
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<{ sent: number; failed: number }> => {
    try {
        const users = await User.find({ role, pushToken: { $exists: true, $ne: null } })
            .select('_id')
            .exec();

        const userIds = users.map(user => user._id);
        return await sendPushToMultipleUsers(userIds, title, body, data);
    } catch (error) {
        logger.error('Failed to send push to role', {
            error: error instanceof Error ? error.message : String(error),
            role,
        });
        return { sent: 0, failed: 0 };
    }
};
