// src/models/ParentStudent.ts
// Parent-Student relationship model for linking parents to students

import mongoose, { Schema } from 'mongoose';
import { IParentStudent } from '../types';

const parentStudentSchema = new Schema<IParentStudent>({
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    relationship: {
        type: String,
        enum: ['Father', 'Mother', 'Guardian'],
        required: true
    },
    linkedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
}, { timestamps: true });

// Compound unique index to prevent duplicate relationships
parentStudentSchema.index({ parent: 1, student: 1 }, { unique: true });

export default mongoose.model<IParentStudent>('ParentStudent', parentStudentSchema);
