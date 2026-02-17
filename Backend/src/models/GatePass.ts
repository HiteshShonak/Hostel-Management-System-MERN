import mongoose, { Schema } from 'mongoose';
import { IGatePass } from '../types';

const gatePassSchema = new Schema<IGatePass>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    // how status changes: PENDING_PARENT -> PENDING_WARDEN -> APPROVED/REJECTED
    status: {
        type: String,
        enum: ['PENDING_PARENT', 'PENDING_WARDEN', 'APPROVED', 'REJECTED'],
        default: 'PENDING_PARENT'
    },
    qrValue: { type: String, unique: true, sparse: true },
    // parent stuff
    parentApprovedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    parentApprovedAt: { type: Date },
    parentRejectionReason: { type: String },
    // warden stuff
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String },
    // who checked it
    validatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    validatedAt: { type: Date },
    // when they left/returned
    exitTime: { type: Date },         // When student exited
    exitMarkedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    entryTime: { type: Date },        // When student returned
    entryMarkedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<IGatePass>('GatePass', gatePassSchema);
