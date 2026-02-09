// src/models/Notification.ts
// In-app notification model

import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: 'notice' | 'gatepass' | 'complaint' | 'system';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    relatedId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

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
