import mongoose, { Schema } from 'mongoose';
import { IFoodRating } from '../types';

const foodRatingSchema = new Schema<IFoodRating>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Ensure one rating per user per meal per day
foodRatingSchema.index({ user: 1, date: 1, mealType: 1 }, { unique: true });

export default mongoose.model<IFoodRating>('FoodRating', foodRatingSchema);
