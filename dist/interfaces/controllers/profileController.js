"use strict";
// backend/src/interfaces/controllers/profileController.ts
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
exports.changePassword = exports.editProfile = exports.viewProfile = void 0;
const viewProfile_1 = require("../../application/use-cases/profile/viewProfile");
const editProfile_1 = require("../../application/use-cases/profile/editProfile");
const viewProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const profile = yield (0, viewProfile_1.viewProfile)(req.user);
        const profileDTO = {
            name: (_a = profile === null || profile === void 0 ? void 0 : profile.name) !== null && _a !== void 0 ? _a : '',
            email: (_b = profile === null || profile === void 0 ? void 0 : profile.email) !== null && _b !== void 0 ? _b : '',
            // phone: profile?.phone ?? '',
        };
        res.status(200).json(profileDTO);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.viewProfile = viewProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProfile = yield (0, editProfile_1.editProfile)(req.user, req.body);
        // const EditProfileDTO: EditProfileDTO = {
        //   name: updatedProfile.name,
        //   username: updatedProfile.username,
        //   email: updatedProfile.email,
        //   phone: updatedProfile.phone,
        // };
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.editProfile = editProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.changePassword = changePassword;