"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const User_1 = require("../../infrastructure/database/models/User");
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.findOne({ email }).exec();
});
const create = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email is already registered
    const existingUser = yield User_1.User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    // if (existingUser && !existingUser.isVerified) {
    //   return existingUser;
    // }
    const user = new User_1.User(userData);
    return yield user.save();
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.findById(id).exec();
});
// const update = async (id: string, changes: Partial<IUser>): Promise<IUser | null> => {
//   // Update updatedAt field
//   changes.updatedAt = new Date();
//   return await User.findByIdAndUpdate(id, changes, { new: true }).exec();
// };
const update = (id, changes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update `updatedAt` field to the current date
        const updatedUser = yield User_1.User.findByIdAndUpdate(id, Object.assign(Object.assign({}, changes), { updatedAt: new Date() }), { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` validates the update
        ).exec();
        return updatedUser;
    }
    catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw new Error('Failed to update user');
    }
});
const updateViaEmail = (email, changes) => __awaiter(void 0, void 0, void 0, function* () {
    changes.updatedAt = new Date();
    return yield User_1.User.findOneAndUpdate({ email }, changes, { new: true }).exec();
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.User.find({}, '_id email name isAdmin blocked profilePicture').exec();
    return users.map((user) => ({
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        blocked: user.blocked,
        profilePicture: user.profilePicture,
    }));
});
const blockUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.User.findOneAndUpdate({ email }, { blocked: true }, { new: true }).exec();
});
const unblockUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.User.findOneAndUpdate({ email }, { blocked: false }, { new: true }).exec();
});
exports.userRepository = {
    findByEmail,
    create,
    findById,
    update,
    getAllUsers,
    blockUser,
    unblockUser,
    updateViaEmail
    // Add other repository methods as needed
};
