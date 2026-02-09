import mongoose, { Schema } from 'mongoose';
import { IEmergency } from '../types';

const emergencySchema = new Schema<IEmergency>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Medical', 'Ragging', 'Fire', 'Other'], required: true },
    message: { type: String },
    location: { type: String },
    status: { type: String, enum: ['active', 'acknowledged', 'resolved'], default: 'active' },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    acknowledgedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IEmergency>('Emergency', emergencySchema);
