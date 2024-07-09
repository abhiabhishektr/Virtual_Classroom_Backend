// src/repositories/userRepository.ts
import { User, IUser } from '../../infrastructure/database/models/User';

const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email }).exec();
};

const create = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).exec();
};

const update = async (id: string, changes: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, changes, { new: true }).exec();
};

export const userRepository = {
  findByEmail,
  create,
  findById,
  update,
  // Add other repository methods as needed
};
