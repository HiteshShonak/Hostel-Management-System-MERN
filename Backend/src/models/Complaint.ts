import mongoose, { Schema } from 'mongoose';
import { IComplaint } from '../types';

const complaintSchema = new Schema<IComplaint>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['Plumbing', 'Electricity', 'WiFi', 'Other'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    resolvedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IComplaint>('Complaint', complaintSchema);
