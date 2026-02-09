import mongoose, { Schema } from 'mongoose';
import { IMessMenu } from '../types';

const messMenuSchema = new Schema<IMessMenu>({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
        unique: true
    },
    meals: {
        Breakfast: [{ type: String }],
        Lunch: [{ type: String }],
        Dinner: [{ type: String }],
    },
    timings: {
        Breakfast: { start: { type: String, default: '07:30' }, end: { type: String, default: '09:30' } },
        Lunch: { start: { type: String, default: '12:00' }, end: { type: String, default: '14:00' } },
        Dinner: { start: { type: String, default: '19:00' }, end: { type: String, default: '21:00' } },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessMenu>('MessMenu', messMenuSchema);

