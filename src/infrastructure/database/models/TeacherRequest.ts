import mongoose, { Document, Schema } from 'mongoose';

// Define the ITeacherRequest interface
export interface ITeacherRequest extends Document {
    userId: string; // Use string
    highestQualification: string;
    yearsOfTeachingExperience: number;
    subjects: string[];
    bio: string;
    status: 'pending' | 'approved' | 'rejected';
}

// Define the TeacherRequest schema
const TeacherRequestSchema: Schema = new Schema({
    userId: { type: String, required: true }, // Use String
    highestQualification: { type: String, required: true },
    yearsOfTeachingExperience: { type: Number, required: true },
    subjects: [{ type: String, required: true }],
    bio: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Create the TeacherRequest model
const TeacherRequest = mongoose.model<ITeacherRequest>('TeacherRequest', TeacherRequestSchema);

export default TeacherRequest;
