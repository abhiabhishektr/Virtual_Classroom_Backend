// src/application/use-cases/user/WishlistUseCase.ts
import { IWishlistRepository } from "../../repositories/WishlistRepository";
import { IWishlist } from '../../../infrastructure/database/models/Wishlist';

export const createWishlistUseCase = (repository: IWishlistRepository) => ({
    saveCourseToWishlist: async (userId: string, courseId: string): Promise<IWishlist | null> => {
        return repository.saveCourseToWishlist(userId, courseId);
    },

    unsaveCourseFromWishlist: async (userId: string, courseId: string): Promise<IWishlist | null> => {
        return repository.unsaveCourseFromWishlist(userId, courseId);
    },
    getAllWishlistItems: async (userId: string): Promise<IWishlist | null> => {
        return repository.getAllWishlistItems(userId);
    },

    clearPurchasedItems: async (userId: string): Promise<IWishlist | null> => {
        return repository.clearPurchasedItems(userId);
    }
});
