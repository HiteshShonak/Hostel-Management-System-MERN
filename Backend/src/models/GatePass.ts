import mongoose, { Schema } from 'mongoose';
import { IGatePass } from '../types';

const gatePassSchema = new Schema<IGatePass>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    // Updated status flow: PENDING_PARENT → PENDING_WARDEN → APPROVED/REJECTED
    status: {
        type: String,
        enum: ['PENDING_PARENT', 'PENDING_WARDEN', 'APPROVED', 'REJECTED'],
        default: 'PENDING_PARENT'
    },
    qrValue: { type: String, unique: true, sparse: true },
    // Parent approval tracking
    parentApprovedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    parentApprovedAt: { type: Date },
    parentRejectionReason: { type: String },
    // Warden approval tracking
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String },
    // Validation tracking
    validatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    validatedAt: { type: Date },
    // Entry/Exit tracking (guard marks when student goes out and comes in)
    exitTime: { type: Date },         // When student exited
    exitMarkedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    entryTime: { type: Date },        // When student returned
    entryMarkedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<IGatePass>('GatePass', gatePassSchema);
