import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../types';

const attendanceSchema = new Schema<IAttendance>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    markedAt: { type: Date, default: Date.now },
    markedByWarden: { type: Schema.Types.ObjectId, ref: 'User' }, // If marked manually by warden
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
        distanceFromHostel: { type: Number }, // Distance in meters for audit
        manualEntry: { type: Boolean, default: false }, // True if marked by warden
    },
});

// Compound index to ensure one attendance per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);

