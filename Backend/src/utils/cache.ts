// src/utils/cache.ts
// Redis caching utility for HMS Backend
// Caches static/infrequently updated data like mess menu, notices, system config

import Redis from 'ioredis';
import { logger } from './logger';

// Redis configuration
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Cache TTL (Time-To-Live) in seconds
export const CACHE_TTL = {
    MESS_MENU: 60 * 60 * 24,      // 24 hours - rarely changes
    NOTICES: 60 * 5,               // 5 minutes - moderately updated
    SYSTEM_CONFIG: 60 * 60,        // 1 hour - rarely changes  
    SYSTEM_STATS: 60 * 2,          // 2 minutes - dashboard stats
    USER_COUNT: 60 * 10,           // 10 minutes - user counts
};

// Cache key prefixes
export const CACHE_KEYS = {
    MESS_MENU: 'mess:menu',
    MESS_MENU_DATE: (date: string) => `mess:menu:${date}`,
    NOTICES: 'notices:all',
    NOTICES_URGENT: 'notices:urgent',
    SYSTEM_CONFIG: 'system:config',
    SYSTEM_STATS: 'system:stats',
    USER_COUNT: 'users:count',
};

let redis: Redis | null = null;
let isConnected = false;

/**
 * Initialize Redis connection
 * Gracefully falls back to no-cache if Redis is unavailable
 */
export const initRedis = async (): Promise<void> => {
    try {
        redis = new Redis(REDIS_URL, {
            maxRetriesPerRequest: 3,
            enableOfflineQueue: false,
            lazyConnect: true,
        });

        await redis.connect();
        isConnected = true;
        logger.info('Redis connected', { url: REDIS_URL.replace(/\/\/.*@/, '//*****@') });
    } catch (error: any) {
        logger.warn('Redis connection failed, caching disabled', { error: error.message });
        redis = null;
        isConnected = false;
    }
};

/**
 * Get value from cache
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
    if (!redis || !isConnected) return null;

    try {
        const data = await redis.get(key);
        if (data) {
            logger.debug('Cache hit', { key });
            return JSON.parse(data) as T;
        }
        logger.debug('Cache miss', { key });
        return null;
    } catch (error: any) {
        logger.warn('Cache get error', { key, error: error.message });
        return null;
    }
};

/**
 * Set value in cache with TTL
 */
export const setCache = async (key: string, data: any, ttlSeconds: number): Promise<void> => {
    if (!redis || !isConnected) return;

    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
        logger.debug('Cache set', { key, ttl: ttlSeconds });
    } catch (error: any) {
        logger.warn('Cache set error', { key, error: error.message });
    }
};

/**
 * Delete cache key (use after updates)
 */
export const deleteCache = async (key: string): Promise<void> => {
    if (!redis || !isConnected) return;

    try {
        await redis.del(key);
        logger.debug('Cache deleted', { key });
    } catch (error: any) {
        logger.warn('Cache delete error', { key, error: error.message });
    }
};

/**
 * Delete all keys matching pattern
 */
export const deleteCachePattern = async (pattern: string): Promise<void> => {
    if (!redis || !isConnected) return;

    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
            logger.debug('Cache pattern deleted', { pattern, count: keys.length });
        }
    } catch (error: any) {
        logger.warn('Cache pattern delete error', { pattern, error: error.message });
    }
};

/**
 * Check if Redis is connected
 */
export const isCacheConnected = (): boolean => isConnected;

/**
 * Close Redis connection gracefully
 */
export const closeRedis = async (): Promise<void> => {
    if (redis) {
        await redis.quit();
        isConnected = false;
        logger.info('Redis connection closed');
    }
};

export default {
    init: initRedis,
    get: getCache,
    set: setCache,
    delete: deleteCache,
    deletePattern: deleteCachePattern,
    isConnected: isCacheConnected,
    close: closeRedis,
    KEYS: CACHE_KEYS,
    TTL: CACHE_TTL,
};
