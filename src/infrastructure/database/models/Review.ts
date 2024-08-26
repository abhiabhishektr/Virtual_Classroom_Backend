import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Review model
export interface IReview extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
}

// Define the Review schema
const ReviewSchema: Schema = new Schema({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, // Minimum rating value
        max: 5  // Maximum rating value
    },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Create an index for courseId and userId if needed
ReviewSchema.index({ courseId: 1 });
ReviewSchema.index({ userId: 1 });

// Create and export the Review model
export default mongoose.model<IReview>('Review', ReviewSchema);
