// src/services/push-notification.service.ts
// helper for expo push notifications

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

// send one push notification
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

// send push to a user id
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

// send push to many users (batches of 100)
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

        // expo limit is 100
        const batchSize = 100;
        let totalSent = 0;
        let totalFailed = 0;

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
                            totalSent++;
                        } else {
                            totalFailed++;
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
                totalFailed += batch.length;
            }
        }

        logger.info('Batch push notifications sent', { sent: totalSent, failed: totalFailed, total: tokens.length });
        return { sent: totalSent, failed: totalFailed };
    } catch (error) {
        logger.error('Failed to send batch push notifications', {
            error: error instanceof Error ? error.message : String(error),
            userCount: userIds.length,
        });
        return { sent: 0, failed: userIds.length };
    }
};

// notify everyone with a role
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
