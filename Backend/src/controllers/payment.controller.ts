// src/controllers/payment.controller.ts
// Payment controller for hostel fee management

import { Response } from 'express';
import Payment from '../models/Payment';
import { AuthRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

// @desc    Get user's payments
// @route   GET /api/payments
export const getPayments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const payments = await Payment.find({ user: req.user?._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, payments, 'Payments retrieved'));
});

// @desc    Create payment due (Warden)
// @route   POST /api/payments
export const createPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId, title, amount, type, dueDate } = req.body;

    if (!userId || !title || !amount || !type || !dueDate) {
        throw new ApiError(400, 'User ID, title, amount, type, and due date are required');
    }

    const payment = await Payment.create({
        user: userId,
        title,
        amount,
        type,
        dueDate: new Date(dueDate),
    });

    return res.status(201).json(new ApiResponse(201, payment, 'Payment due created'));
});

// @desc    Pay a payment
// @route   PUT /api/payments/:id/pay
export const payPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
        throw new ApiError(404, 'Payment not found');
    }

    // Verify ownership
    if (payment.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, 'Not authorized to pay this payment');
    }

    payment.status = 'Paid';
    payment.paidAt = new Date();
    await payment.save();

    return res.status(200).json(new ApiResponse(200, payment, 'Payment completed'));
});
