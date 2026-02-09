import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    rollNo: { type: String, required: true, unique: true },
    room: { type: String, required: true },
    hostel: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['student', 'admin', 'warden', 'mess_staff', 'guard', 'parent'], default: 'student' },
    // Optional parent email for auto-linking during student registration
    parentEmail: { type: String, lowercase: true },
    createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
