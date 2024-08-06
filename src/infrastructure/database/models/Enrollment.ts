import { Schema, model, Document } from 'mongoose';
import { ICourse } from './Course'; // Import ICourse interface if needed
import { IUser } from './User'; // Import IUser interface if needed

// Define TypeScript interface for CourseDetail
interface ICourseDetail extends Document {
    courseId: Schema.Types.ObjectId;
    purchaseDate: Date;
    price: number;
    status: 'paid' | 'pending' | 'refunded';
    enrollmentDetails: string;
    paymentId?: string; // Optional field for payment ID
}

// Define TypeScript interface for Enrollment
export interface IEnrollment extends Document {
    userId: Schema.Types.ObjectId;
    courses: ICourseDetail[];
}

// Define schema for CourseDetail
const courseDetailSchema = new Schema<ICourseDetail>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'refunded'],
        default: 'pending'
    },
    enrollmentDetails: {
        type: String, // Additional details if needed
        default: ''
    },
    paymentId: {
        type: String, // Store payment ID as a string
        default: '' // Default to an empty string if not provided
    }
});

// Define schema for Enrollment
const enrollmentSchema = new Schema<IEnrollment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [courseDetailSchema]
});

// Create and export the model
const Enrollment = model<IEnrollment>('Enrollment', enrollmentSchema);

export default Enrollment;
