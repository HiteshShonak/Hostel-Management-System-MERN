import mongoose, { Schema } from 'mongoose';
import { ILaundry } from '../types';

const laundrySchema = new Schema<ILaundry>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Ready', 'Collected'], default: 'Scheduled' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILaundry>('Laundry', laundrySchema);
