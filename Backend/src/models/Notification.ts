// src/models/Notification.ts
// In-app notification model

import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types';

const NotificationSchema = new Schema<INotification>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        type: { type: String, enum: ['notice', 'gatepass', 'complaint', 'system'], required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String },
        read: { type: Boolean, default: false },
        relatedId: { type: Schema.Types.ObjectId },
    },
    { timestamps: true }
);

// Index for efficient queries
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
