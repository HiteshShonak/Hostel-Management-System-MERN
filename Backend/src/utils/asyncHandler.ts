// src/utils/asyncHandler.ts
// Removes try-catch blocks from controllers - wraps async functions

import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";

// Overload for regular Request
function asyncHandler(
    requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>
): (req: Request, res: Response, next: NextFunction) => void;

// Overload for AuthRequest (authenticated routes)
function asyncHandler(
    requestHandler: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
): (req: AuthRequest, res: Response, next: NextFunction) => void;

// Implementation
function asyncHandler(
    requestHandler: (req: any, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: any, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
}

export { asyncHandler };
