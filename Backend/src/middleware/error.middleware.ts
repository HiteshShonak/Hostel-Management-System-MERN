// src/middleware/error.middleware.ts
// Global error handler - catches all errors and sends standardized response

import { Request, Response, NextFunction } from "express";
import { ApiError, ValidationError } from "../utils/ApiError";
import { logger } from "../utils/logger";

// Interface for MongoDB validation error
interface MongooseValidationError {
    path: string;
    message: string;
}

// Interface for MongoDB duplicate key error
interface MongoDBError extends Error {
    code?: number;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, MongooseValidationError>;
    statusCode?: number;
}

const errorHandler = (
    err: Error | ApiError | MongoDBError,
    req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    let error: ApiError;

    // Convert non-ApiError errors to ApiError
    if (!(err instanceof ApiError)) {
        const mongoErr = err as MongoDBError;
        const statusCode = mongoErr.statusCode || 500;
        const message = err.message || "Something went wrong";
        error = new ApiError(statusCode, message, [], err.stack);
    } else {
        error = err;
    }

    // Handle MongoDB duplicate key error
    const mongoErr = err as MongoDBError;
    if (mongoErr.code === 11000 && mongoErr.keyValue) {
        const field = Object.keys(mongoErr.keyValue)[0];
        error = new ApiError(409, `${field} already exists`);
    }

    // Handle MongoDB validation error
    if (err.name === 'ValidationError' && mongoErr.errors) {
        const validationErrors: ValidationError[] = Object.values(mongoErr.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        error = new ApiError(400, "Validation Error", validationErrors);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new ApiError(401, "Invalid token");
    }

    if (err.name === 'TokenExpiredError') {
        error = new ApiError(401, "Token expired");
    }

    // Log error in production
    if (process.env.NODE_ENV === 'production') {
        logger.error('API Error', {
            statusCode: error.statusCode,
            message: error.message,
            path: req.path,
            method: req.method
        });
    }

    const response = {
        success: false,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode).json(response);
};

export { errorHandler };

