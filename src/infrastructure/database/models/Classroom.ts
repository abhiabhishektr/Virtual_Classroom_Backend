// src/infrastructure/database/models/Classroom.ts
import { Schema, model, Document } from 'mongoose';

export interface IClassroom extends Document {
  title: string;
  teacher: Schema.Types.ObjectId; // Reference to a teacher
  // Add other properties as needed
}

const classroomSchema = new Schema<IClassroom>({
  title: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  // Add other fields as needed
});

const Classroom = model<IClassroom>('Classroom', classroomSchema);

export { Classroom };
