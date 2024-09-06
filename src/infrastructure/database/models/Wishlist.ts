import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId; 
    courses: mongoose.Types.ObjectId[]; 
}

const WishlistSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
}, { timestamps: true });

WishlistSchema.index({ userId: 1, courses: 1 }, { unique: true });

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);