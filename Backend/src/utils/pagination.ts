// src/utils/pagination.ts
// Pagination utility for list endpoints

import { Request } from 'express';

export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

/**
 * Parse pagination params from request query
 * @param req - Express request
 * @param defaultLimit - Default items per page (default: 20)
 * @param maxLimit - Maximum items per page (default: 100)
 */
export const getPaginationParams = (
    req: Request,
    defaultLimit: number = 20,
    maxLimit: number = 100
): PaginationParams => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit as string) || defaultLimit));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Generate pagination metadata
 * @param total - Total number of items
 * @param page - Current page
 * @param limit - Items per page
 */
export const getPaginationMeta = (
    total: number,
    page: number,
    limit: number
): PaginationMeta => {
    const pages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
    };
};
