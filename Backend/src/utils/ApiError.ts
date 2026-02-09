// src/utils/ApiError.ts
// Standardizes error handling across the application

interface ValidationError {
    field: string;
    message: string;
}

class ApiError extends Error {
    statusCode: number;
    data: null;
    success: boolean;
    errors: ValidationError[];

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors: ValidationError[] = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError, ValidationError };

