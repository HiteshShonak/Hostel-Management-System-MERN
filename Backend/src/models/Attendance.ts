import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../types';

const attendanceSchema = new Schema<IAttendance>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    markedAt: { type: Date, default: Date.now },
    markedByWarden: { type: Schema.Types.ObjectId, ref: 'User' }, // if warden did it
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
        distanceFromHostel: { type: Number }, // how far they were
        manualEntry: { type: Boolean, default: false }, // true if marked by warden
    },
});

// only one attendance per day per user
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);

