"use strict";
// backend/src/application/use-cases/profile/viewProfile.ts
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
exports.viewProfile = void 0;
const userRepository_1 = require("../../repositories/userRepository");
const viewProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return userRepository_1.userRepository.findById(user.id);
});
exports.viewProfile = viewProfile;
