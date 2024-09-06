// src/infrastructure/database/models/User.ts

import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  blocked: boolean;
  // isVerified: boolean;
  profilePicture?: string; // Optional field for profile picture URL
  createdAt: Date; // Date of user creation
  updatedAt: Date; // Date of last update
  role: 'user' | 'teacher' | 'admin';
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  // isVerified: { type: Boolean, default: false },
  profilePicture: { type: String }, // Optional field for profile picture URL
  createdAt: { type: Date, default: Date.now }, // Default to current date/time
  updatedAt: { type: Date, default: Date.now }, // Default to current date/time
  role: { type: String, enum: ['user', 'teacher', 'admin'], default: 'user' },
  // Add other fields as needed
});

const User = model<IUser>('User', userSchema);

export { User };


