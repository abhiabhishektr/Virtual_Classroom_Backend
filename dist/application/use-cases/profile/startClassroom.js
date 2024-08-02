"use strict";
// backend/src/application/use-cases/classroom/startClassroom.ts
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
exports.startClassroom = void 0;
const classroomRepository_1 = require("../../repositories/classroomRepository");
const startClassroom = (user, classroomDetails) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the user has permission to start a classroom
    return classroomRepository_1.classroomRepository.create(Object.assign(Object.assign({}, classroomDetails), { teacherId: user.id }));
});
exports.startClassroom = startClassroom;
