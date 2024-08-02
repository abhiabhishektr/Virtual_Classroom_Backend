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
}

const CourseSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: String, required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    fees: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

export default mongoose.model<ICourse>('Course', CourseSchema);
