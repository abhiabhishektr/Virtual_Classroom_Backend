import mongoose, { Schema, Document } from 'mongoose';

export interface IReportIssue extends Document {
  userId:  mongoose.Schema.Types.ObjectId;
  courseId:  mongoose.Schema.Types.ObjectId;
  issueType: string;
  description: string;
  createdAt: Date; 
  updatedAt: Date;
}

const ReportIssueSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true }); 

const ReportIssue = mongoose.model<IReportIssue>('ReportIssue', ReportIssueSchema);

export default ReportIssue; 