import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    instructorId: string;
    duration: number;
    startDate: Date;
    fees: number;
    category: string;
    imageUrl: string;
    isBlocked: boolean;
    enrollmentCount: number;
}

export interface ExtendedCourse extends ICourse {
    isPurchased: boolean;
}

const CourseSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: String, required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    fees: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    enrollmentCount: { type: Number, default: 0 }
    // modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }]
});

export default mongoose.model<ICourse>('Course', CourseSchema);
