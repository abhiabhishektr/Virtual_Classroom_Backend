"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classroom = void 0;
// src/infrastructure/database/models/Classroom.ts
const mongoose_1 = require("mongoose");
const classroomSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    teacher: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    // Add other fields as needed
});
const Classroom = (0, mongoose_1.model)('Classroom', classroomSchema);
exports.Classroom = Classroom;
