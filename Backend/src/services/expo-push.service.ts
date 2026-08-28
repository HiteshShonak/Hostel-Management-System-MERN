// src/services/expo-push.service.ts
// Low-level HTTP transport and chunked batch dispatching client for Expo Push API

import { logger } from '../utils/logger';

export interface PushMessage {
    to: string;
    sound?: 'default' | null;
    title: string;
    body: string;
    data?: Record<string, any>;
    priority?: 'default' | 'normal' | 'high';
    badge?: number;
}

export interface PushTicket {
    status: 'ok' | 'error';
    id?: string;
    message?: string;
    details?: any;
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const EXPO_HEADERS = {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    'Content-Type': 'application/json',
};

// Dispatch a single push message to Expo Push API
export const dispatchExpoMessage = async (message: PushMessage): Promise<boolean> => {
    const response = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: EXPO_HEADERS,
        body: JSON.stringify(message),
    });

    const result = (await response.json()) as { data?: PushTicket[] };
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

    return true;
};

// Dispatch messages in chunks of 100 (Expo API batch limit)
export const dispatchExpoBatches = async (
    messages: PushMessage[],
    batchSize = 100
): Promise<{ sent: number; failed: number }> => {
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);

        try {
            const response = await fetch(EXPO_PUSH_URL, {
                method: 'POST',
                headers: EXPO_HEADERS,
                body: JSON.stringify(batch),
            });

            const result = (await response.json()) as { data?: PushTicket[] };
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

    return { sent: totalSent, failed: totalFailed };
};
