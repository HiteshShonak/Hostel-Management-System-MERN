import mongoose, { Schema } from 'mongoose';
import { IPayment } from '../types';

const paymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Hostel Fee', 'Mess Fee', 'Laundry', 'Other'], required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    paidAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>('Payment', paymentSchema);
