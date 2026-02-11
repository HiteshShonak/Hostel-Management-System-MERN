// src/services/firebase-admin.service.ts
// Firebase Admin SDK initialization and management

import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs';

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 * Uses service account JSON file from project root
 */
export const initializeFirebaseAdmin = (): boolean => {
    try {
        // Check if already initialized
        if (firebaseInitialized) {
            logger.info('Firebase Admin already initialized');
            return true;
        }

        // Path to service account key
        const serviceAccountPath = path.join(__dirname, '..', '..', 'firebase-admin-key.json');

        // Check if file exists
        if (!fs.existsSync(serviceAccountPath)) {
            logger.warn('Firebase service account key not found, Firebase push notifications disabled');
            logger.warn(`Expected path: ${serviceAccountPath}`);
            return false;
        }

        // Read and parse service account
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

        // Initialize Firebase Admin
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id,
        });

        firebaseInitialized = true;
        logger.info('Firebase Admin SDK initialized successfully');
        return true;
    } catch (error) {
        logger.error('Failed to initialize Firebase Admin', {
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
};

/**
 * Get Firebase Messaging instance
 * Returns null if Firebase is not initialized
 */
export const getFirebaseMessaging = (): admin.messaging.Messaging | null => {
    if (!firebaseInitialized) {
        logger.warn('Firebase Admin not initialized, cannot send Firebase messages');
        return null;
    }
    return admin.messaging();
};

/**
 * Check if Firebase Admin is initialized
 */
export const isFirebaseInitialized = (): boolean => {
    return firebaseInitialized;
};

/**
 * Send a single Firebase Cloud Message
 */
export const sendFirebaseMessage = async (
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
): Promise<boolean> => {
    try {
        const messaging = getFirebaseMessaging();
        if (!messaging) {
            return false;
        }

        const message: admin.messaging.Message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            token,
            android: {
                priority: 'high',
                notification: {
                    channelId: 'hms-notifications',
                    sound: 'default',
                    priority: 'high',
                },
            },
        };

        await messaging.send(message);
        logger.info('Firebase message sent successfully', { title });
        return true;
    } catch (error) {
        logger.error('Failed to send Firebase message', {
            error: error instanceof Error ? error.message : String(error),
            title,
        });
        return false;
    }
};

/**
 * Send multiple Firebase Cloud Messages in batch
 */
export const sendFirebaseMulticast = async (
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>
): Promise<{ successCount: number; failureCount: number }> => {
    try {
        const messaging = getFirebaseMessaging();
        if (!messaging) {
            return { successCount: 0, failureCount: tokens.length };
        }

        const message: admin.messaging.MulticastMessage = {
            notification: {
                title,
                body,
            },
            data: data || {},
            tokens,
            android: {
                priority: 'high',
                notification: {
                    channelId: 'hms-notifications',
                    sound: 'default',
                    priority: 'high',
                },
            },
        };

        const response = await messaging.sendEachForMulticast(message);

        logger.info('Firebase multicast sent', {
            success: response.successCount,
            failure: response.failureCount,
            total: tokens.length,
        });

        return {
            successCount: response.successCount,
            failureCount: response.failureCount,
        };
    } catch (error) {
        logger.error('Failed to send Firebase multicast', {
            error: error instanceof Error ? error.message : String(error),
            tokenCount: tokens.length,
        });
        return { successCount: 0, failureCount: tokens.length };
    }
};
