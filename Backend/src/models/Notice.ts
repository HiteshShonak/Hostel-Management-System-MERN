import mongoose, { Schema } from 'mongoose';
import { INotice } from '../types';

const noticeSchema = new Schema<INotice>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    urgent: { type: Boolean, default: false },
    source: { type: String, enum: ['warden', 'mess_staff', 'system'], default: 'warden' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotice>('Notice', noticeSchema);

