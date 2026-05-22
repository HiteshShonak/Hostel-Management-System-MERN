// lib/services/shared.types.ts — Shared service-layer types
// (Pagination response is used by multiple services)
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
