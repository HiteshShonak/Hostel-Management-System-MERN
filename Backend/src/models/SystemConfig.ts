// SystemConfig model - Singleton document for dynamic system settings
// Allows admin to update hostel coordinates, attendance windows, etc.

import mongoose, { Schema } from 'mongoose';

export interface ISystemConfig {
    _id: string;
    hostelCoords: {
        latitude: number;
        longitude: number;
        name: string;
    };
    geofenceRadiusMeters: number;
    attendanceWindow: {
        enabled: boolean;
        startHour: number;
        endHour: number;
        timezone: string;
    };
    appConfig: {
        maxGatePassDays: number;
        maxPendingPasses: number;
        attendanceGracePeriod: number;
    };
    updatedAt: Date;
    updatedBy?: mongoose.Types.ObjectId;
}

const systemConfigSchema = new Schema<ISystemConfig>({
    _id: { type: String, default: 'system-config' },
    hostelCoords: {
        latitude: { type: Number, default: 28.986701 },
        longitude: { type: Number, default: 77.152050 },
        name: { type: String, default: 'Main Hostel Building' },
    },
    geofenceRadiusMeters: { type: Number, default: 50 },
    attendanceWindow: {
        enabled: { type: Boolean, default: true },
        startHour: { type: Number, default: 19 },
        endHour: { type: Number, default: 22 },
        timezone: { type: String, default: 'Asia/Kolkata' },
    },
    appConfig: {
        maxGatePassDays: { type: Number, default: 14 },
        maxPendingPasses: { type: Number, default: 3 },
        attendanceGracePeriod: { type: Number, default: 5 },
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

// Get or create the singleton config document
systemConfigSchema.statics.getConfig = async function (): Promise<ISystemConfig> {
    let config = await this.findById('system-config');
    if (!config) {
        config = await this.create({ _id: 'system-config' });
    }
    return config;
};

export default mongoose.model<ISystemConfig>('SystemConfig', systemConfigSchema);
