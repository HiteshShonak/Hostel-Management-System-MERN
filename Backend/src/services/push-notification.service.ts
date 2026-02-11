// src/services/push-notification.service.ts
// Push notification service with support for both Expo and Firebase

import { logger } from '../utils/logger';
import User from '../models/User';
import { Types } from 'mongoose';
import { sendFirebaseMessage, sendFirebaseMulticast, isFirebaseInitialized } from './firebase-admin.service';

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
 * Determine if token is Expo or Firebase format
 */
const isExpoToken = (token: string): boolean => {
    return token.startsWith('ExponentPushToken[');
};

/**
 * Send push notification to a single device (auto-detects Expo vs Firebase)
 */
export const sendPushNotification = async (
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<boolean> => {
    try {
        // Validate token exists
        if (!pushToken) {
            logger.warn('No push token provided');
            return false;
        }

        // Auto-detect token type and use appropriate service
        if (isExpoToken(pushToken)) {
            // Use Expo Push API
            return await sendExpoPushNotification(pushToken, title, body, data);
        } else if (isFirebaseInitialized()) {
            // Use Firebase Admin SDK
            const dataStrings = data ? Object.fromEntries(
                Object.entries(data).map(([k, v]) => [k, String(v)])
            ) : undefined;
            return await sendFirebaseMessage(pushToken, title, body, dataStrings);
        } else {
            logger.warn('Firebase not initialized, cannot send FCM notification', { token: pushToken });
            return false;
        }
    } catch (error) {
        logger.error('Failed to send push notification', {
            error: error instanceof Error ? error.message : String(error),
            title,
        });
        return false;
    }
};

/**
 * Send push notification using Expo Push API
 */
const sendExpoPushNotification = async (
    expoPushToken: string,
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<boolean> => {
    try {

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
 * Send push notifications to multiple users (batched, auto-detects Expo vs Firebase)
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

        // Separate Expo and Firebase tokens
        const expoTokens: string[] = [];
        const firebaseTokens: string[] = [];

        users.forEach(user => {
            if (user.pushToken) {
                if (isExpoToken(user.pushToken)) {
                    expoTokens.push(user.pushToken);
                } else {
                    firebaseTokens.push(user.pushToken);
                }
            }
        });

        let totalSent = 0;
        let totalFailed = 0;

        // Send Expo notifications
        if (expoTokens.length > 0) {
            const messages: PushMessage[] = expoTokens.map(token => ({
                to: token,
                sound: 'default',
                title,
                body,
                data: data || {},
                priority: 'high',
            }));

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

        }

        // Send Firebase notifications
        if (firebaseTokens.length > 0 && isFirebaseInitialized()) {
            const dataStrings = data ? Object.fromEntries(
                Object.entries(data).map(([k, v]) => [k, String(v)])
            ) : undefined;
            const firebaseResult = await sendFirebaseMulticast(firebaseTokens, title, body, dataStrings);
            totalSent += firebaseResult.successCount;
            totalFailed += firebaseResult.failureCount;
        }

        logger.info('Batch push notifications sent', { sent: totalSent, failed: totalFailed, expo: expoTokens.length, firebase: firebaseTokens.length });
        return { sent: totalSent, failed: totalFailed };
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
