// src/services/push-notification.service.ts
// Push notification service using Expo Push API

import { logger } from '../utils/logger';
import User from '../models/User';
import { Types } from 'mongoose';

interface PushMessage {
    to: string;
    sound?: 'default' | null;
    title: string;
    body: string;
    data?: Record<string, any>;
    priority?: 'default' | 'normal' | 'high';
    badge?: number;
}

interface PushTicket {
    status: 'ok' | 'error';
    id?: string;
    message?: string;
    details?: any;
}

interface PushReceipt {
    status: 'ok' | 'error';
    message?: string;
    details?: any;
}

/**
 * Send push notification to a single device using Expo Push API
 */
export const sendPushNotification = async (
    expoPushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<boolean> => {
    try {
        // Validate token format
        if (!expoPushToken || !expoPushToken.startsWith('ExponentPushToken[')) {
            logger.warn('Invalid push token format', { token: expoPushToken });
            return false;
        }

        const message: PushMessage = {
            to: expoPushToken,
            sound: 'default',
            title,
            body,
            data: data || {},
            priority: 'high',
        };

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json() as { data?: PushTicket[] };

        if (result.data && Array.isArray(result.data)) {
            const ticket = result.data[0] as PushTicket;
            if (ticket.status === 'error') {
                logger.error('Push notification failed', {
                    error: ticket.message,
                    details: ticket.details,
                });
                return false;
            }
        }

        logger.info('Push notification sent successfully', { title });
        return true;
    } catch (error) {
        logger.error('Failed to send push notification', {
            error: error instanceof Error ? error.message : String(error),
            title,
        });
        return false;
    }
};

/**
 * Send push notification to a user by their userId
 */
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

/**
 * Send push notifications to multiple users (batched)
 */
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

        const messages: PushMessage[] = users
            .filter(user => user.pushToken)
            .map(user => ({
                to: user.pushToken!,
                sound: 'default',
                title,
                body,
                data: data || {},
                priority: 'high',
            }));

        if (messages.length === 0) {
            return { sent: 0, failed: 0 };
        }

        // Send in batches of 100 (Expo limit)
        const batchSize = 100;
        let sent = 0;
        let failed = 0;

        for (let i = 0; i < messages.length; i += batchSize) {
            const batch = messages.slice(i, i + batchSize);

            try {
                const response = await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(batch),
                });

                const result = await response.json() as { data?: PushTicket[] };

                if (result.data && Array.isArray(result.data)) {
                    result.data.forEach((ticket: PushTicket) => {
                        if (ticket.status === 'ok') {
                            sent++;
                        } else {
                            failed++;
                            logger.warn('Push ticket failed', {
                                error: ticket.message,
                                details: ticket.details,
                            });
                        }
                    });
                }
            } catch (batchError) {
                logger.error('Batch push failed', {
                    error: batchError instanceof Error ? batchError.message : String(batchError),
                    batchSize: batch.length,
                });
                failed += batch.length;
            }
        }

        logger.info('Batch push notifications sent', { sent, failed, total: messages.length });
        return { sent, failed };
    } catch (error) {
        logger.error('Failed to send batch push notifications', {
            error: error instanceof Error ? error.message : String(error),
            userCount: userIds.length,
        });
        return { sent: 0, failed: userIds.length };
    }
};

/**
 * Send push notification to all users with a specific role
 */
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
