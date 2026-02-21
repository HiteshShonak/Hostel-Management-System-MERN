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
    emergencyContacts: Array<{
        name: string;
        phone: string;
        type: 'warden' | 'security' | 'medical' | 'police' | 'other';
    }>;
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
    emergencyContacts: {
        type: [{
            name: { type: String, required: true },
            phone: { type: String, required: true },
            type: { type: String, enum: ['warden', 'security', 'medical', 'police', 'other'], required: true },
        }],
        default: [
            { name: 'Warden Office', phone: '+91 1234567890', type: 'warden' },
            { name: 'Campus Security', phone: '+91 9876543210', type: 'security' },
            { name: 'Medical Center', phone: '+91 1122334455', type: 'medical' },
            { name: 'Emergency Helpline', phone: '112', type: 'police' },
        ],
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

// Interface for static methods
interface ISystemConfigModel extends mongoose.Model<ISystemConfig> {
    getConfig(): Promise<ISystemConfig>;
}

export default mongoose.model<ISystemConfig, ISystemConfigModel>('SystemConfig', systemConfigSchema);
