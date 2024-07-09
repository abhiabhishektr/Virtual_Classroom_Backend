// src/infrastructure/database/models/User.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string; // Ensure name is included in the IUser interface
  // Add other properties as needed
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }, // Ensure name is included in the schema
  // Add other fields as needed
});

const User = model<IUser>('User', userSchema);

export { User };
