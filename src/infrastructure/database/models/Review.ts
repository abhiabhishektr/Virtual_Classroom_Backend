import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
}

const ReviewSchema: Schema = new Schema({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>('Review', ReviewSchema);
