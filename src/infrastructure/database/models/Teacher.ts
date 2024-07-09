// src/infrastructure/database/models/Teacher.ts
import { Schema, model, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  subject: string;
  // Add other properties as needed
}

const teacherSchema = new Schema<ITeacher>({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  // Add other fields as needed
});

const Teacher = model<ITeacher>('Teacher', teacherSchema);

export { Teacher };
