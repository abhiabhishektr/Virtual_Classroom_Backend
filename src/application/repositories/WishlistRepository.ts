// src/application/repositories/WishlistRepository.ts
import mongoose from 'mongoose';
import { Wishlist, IWishlist } from '../../infrastructure/database/models/Wishlist';
import Enrollment from '../../infrastructure/database/models/Enrollment';

export interface IWishlistRepository {
    saveCourseToWishlist(userId: string, courseId: string): Promise<IWishlist | null>;
    unsaveCourseFromWishlist(userId: string, courseId: string): Promise<IWishlist | null>;
    getAllWishlistItems(userId: string): Promise<IWishlist | null>;
    clearPurchasedItems(userId: string): Promise<IWishlist | null>;
}

export const createWishlistRepository = (): IWishlistRepository => ({
    saveCourseToWishlist: async (userId: string, courseId: string): Promise<IWishlist | null> => {
        let wishlist = await Wishlist.findOne({ userId: mongoose.Types.ObjectId(userId) });

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
    getAllWishlistItems: async (userId: string): Promise<any | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const wishlist = await Wishlist.aggregate([
            {
                $match: { userId:userIdObj}
            },
            {
                $unwind: '$courses'
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courses',
                    foreignField: '_id',
                    as: 'courseDetails'
                }
            },
            {
                $unwind: '$courseDetails'
            },
            {
                $lookup: {
                    from: 'enrollments',
                    let: { userId: '$userId', courseId: '$courseDetails._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$userId', '$$userId'] },
                                        { $eq: ['$courses.courseId', '$$courseId'] },
                                        { $eq: ['$courses.status', 'paid'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'enrollment'
                }
            },
            {
                $project: {
                    id: '$courseDetails._id',
                    title: '$courseDetails.title',
                    description: '$courseDetails.description',
                    imageUrl: '$courseDetails.imageUrl',
                    fees: '$courseDetails.fees',
                    isPurchased: {
                        $cond: {
                            if: { $gt: [{ $size: '$enrollment' }, 0] },
                            then: true,
                            else: false
                        }
                    },
                    isBookmarked: { $literal: true }
                }
            }
        ]);
        console.log("wishlist: ", wishlist);
        return wishlist;
    },

    clearPurchasedItems:  async (userId: string): Promise<IWishlist | null> => {
        const wishlist = await Wishlist.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!wishlist) {
            return null;
        }
    
        // Fetch the user's enrollment details
        const enrollment = await Enrollment.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!enrollment) {
            return wishlist; // If there's no enrollment, return the wishlist as it is
        }
    
        // Extract the purchased course IDs
        const purchasedCourseIds = enrollment.courses
            .filter(courseDetail => courseDetail.status === 'paid')
            .map(courseDetail => courseDetail.courseId.toString());
    
        // Filter out purchased courses from the wishlist
        wishlist.courses = wishlist.courses.filter(courseId => {
            return !purchasedCourseIds.includes(courseId.toString());
        });
    
        await wishlist.save();
        return wishlist;
    }
});
