import { User, IUser } from '../../infrastructure/database/models/User';

interface UserDTO {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  blocked: boolean;
  profilePicture?: string;
}

const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email }).exec();
};

const create = async (userData: Partial<IUser>): Promise<IUser> => {
  // Check if email is already registered
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = new User(userData);
  return await user.save();
};

const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).exec();
};

const update = async (id: string, changes: Partial<IUser>): Promise<IUser | null> => {
  // Update updatedAt field
  changes.updatedAt = new Date();

  return await User.findByIdAndUpdate(id, changes, { new: true }).exec();
};

const getAllUsers = async (): Promise<UserDTO[]> => {
  const users = await User.find({}, '_id email name isAdmin blocked profilePicture').exec();
  return users.map((user) => ({
    _id: user._id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    blocked: user.blocked,
    profilePicture: user.profilePicture,
  }));
};

const blockUser = async (email: string): Promise<void> => {
  await User.findOneAndUpdate({ email }, { blocked: true }, { new: true }).exec();
};

const unblockUser = async (email: string): Promise<void> => {
  await User.findOneAndUpdate({ email }, { blocked: false }, { new: true }).exec();
};

export const userRepository = {
  findByEmail,
  create,
  findById,
  update,
  getAllUsers,
  blockUser,
  unblockUser,
  // Add other repository methods as needed
};
