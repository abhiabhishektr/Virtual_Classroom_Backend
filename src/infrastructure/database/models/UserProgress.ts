import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedContentIds: mongoose.Types.ObjectId[];
  importantContentIds: mongoose.Types.ObjectId[]; // Added field
  updatedAt: Date;
}

const userProgressSchema: Schema<IUserProgress> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedContentIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }
  ],
  importantContentIds: [ // Added field
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Optional if not all content needs to be flagged
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);

export default UserProgress;
