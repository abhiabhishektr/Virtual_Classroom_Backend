// src/application/use-cases/admin/users.ts

import { IUser, User } from '../../../infrastructure/database/models/User'; // Adjust path based on your project structure
// import { adminUsers } from '../../../types/user';

// Example function to fetch all users
export const getUsers = async (): Promise<IUser[]> => {
  try {
    // Replace with your actual logic to fetch users from the database or any other source
    const users: IUser[] = await User.find(); // Assuming Mongoose or any other ORM used
    return users;
  } catch (error) {
    throw new Error('Failed to fetch users'); // Handle errors appropriately
  }
};

// Example function to block a user
export const blockUser = async (userId: string): Promise<void> => {
  try {
    // Replace with your actual logic to update user status to blocked
    const user = await User.findById(userId); // Example of fetching user by ID
    if (!user) {
      throw new Error('User not found');
    }
    user.blocked = true; // Example of setting user's blocked status
    await user.save(); // Example of saving updated user data
  } catch (error) {
    throw new Error('Failed to block user'); // Handle errors appropriately
  }
};

// Example function to unblock a user
export const unblockUser = async (userId: string): Promise<void> => {
  try {
    // Replace with your actual logic to update user status to unblocked
    const user = await User.findById(userId); // Example of fetching user by ID
    if (!user) {
      throw new Error('User not found');
    }
    user.blocked = false; // Example of setting user's blocked status
    await user.save(); // Example of saving updated user data
  } catch (error) {
    throw new Error('Failed to unblock user'); // Handle errors appropriately
  }
};
