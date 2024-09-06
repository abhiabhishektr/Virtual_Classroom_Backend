// src/application/repositories/WishlistRepository.ts
import mongoose from 'mongoose';
import { Wishlist, IWishlist } from '../../infrastructure/database/models/Wishlist';

export interface IWishlistRepository {
    saveCourseToWishlist(userId: string, courseId: string): Promise<IWishlist | null>;
    unsaveCourseFromWishlist(userId: string, courseId: string): Promise<IWishlist | null>;
    getAllWishlistItems(userId: string): Promise<IWishlist | null>;
    clearPurchasedItems(userId: string): Promise<IWishlist | null>;
}

export const createWishlistRepository = (): IWishlistRepository => ({
    saveCourseToWishlist: async (userId: string, courseId: string): Promise<IWishlist | null> => {
        let wishlist = await Wishlist.findOne({ userId:  mongoose.Types.ObjectId(userId) });

        const courseObjectId = mongoose.Types.ObjectId(courseId); // Convert courseId to ObjectId

        if (!wishlist) {
            wishlist = new Wishlist({ userId: mongoose.Types.ObjectId(userId), courses: [courseObjectId] });
        } else if (!wishlist.courses.includes(courseObjectId)) {
            wishlist.courses.push(courseObjectId);
        }

        await wishlist.save();
        return wishlist;
    },

    unsaveCourseFromWishlist: async (userId: string, courseId: string): Promise<IWishlist | null> => {
        const result = await Wishlist.updateOne(
            { userId: mongoose.Types.ObjectId(userId) },
            { $pull: { courses: mongoose.Types.ObjectId(courseId) } }
        );
    
        if (result.nModified === 0) {  
            return null; 
        } else {
            const updatedWishlist = await Wishlist.findOne({ userId: mongoose.Types.ObjectId(userId) }); 
            return updatedWishlist;
        }
    },
    getAllWishlistItems: async (userId: string): Promise<IWishlist | null> => {
        const wishlist = await Wishlist.findOne({ userId: mongoose.Types.ObjectId(userId) }).populate('courses'); // Populate courses
        return wishlist;
    },

    clearPurchasedItems: async (userId: string): Promise<IWishlist | null> => {
        const wishlist = await Wishlist.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!wishlist) {
            return null;
        }

        wishlist.courses = wishlist.courses.filter(courseId => {
            // Assuming you have a way to determine if a course is purchased (e.g., isPurchased flag in the course document)
            const course = await // Fetch the course document by courseId
              // ... your logic to fetch the course ...
            return !course.isPurchased; 
        });

        await wishlist.save();
        return wishlist;
    }
});
