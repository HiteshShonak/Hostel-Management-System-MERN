import mongoose, { Schema } from 'mongoose';
import { IVisitor } from '../types';

const visitorSchema = new Schema<IVisitor>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
    expectedDate: { type: Date, required: true },
    expectedTime: { type: String, required: true },
    status: { type: String, enum: ['Expected', 'Checked-In', 'Visited'], default: 'Expected' },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IVisitor>('Visitor', visitorSchema);
