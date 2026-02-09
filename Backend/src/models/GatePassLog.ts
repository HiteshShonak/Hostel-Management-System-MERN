// src/models/GatePassLog.ts
// Log model for tracking all gate pass entry/exit events

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGatePassLog extends Document {
    gatePass: Types.ObjectId;
    user: Types.ObjectId;
    action: 'EXIT' | 'ENTRY';
    timestamp: Date;
    markedBy: Types.ObjectId;
    isLate?: boolean; // Track if student returned late
    note?: string;
}

const GatePassLogSchema = new Schema<IGatePassLog>(
    {
        gatePass: {
            type: Schema.Types.ObjectId,
            ref: 'GatePass',
            required: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        action: {
            type: String,
            enum: ['EXIT', 'ENTRY'],
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            required: true,
        },
        markedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isLate: {
            type: Boolean,
            default: false,
        },
        note: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
GatePassLogSchema.index({ timestamp: -1 });
GatePassLogSchema.index({ gatePass: 1, timestamp: -1 });

const GatePassLog = mongoose.model<IGatePassLog>('GatePassLog', GatePassLogSchema);

export default GatePassLog;
