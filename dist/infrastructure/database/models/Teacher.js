"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
// src/infrastructure/database/models/Teacher.ts
const mongoose_1 = require("mongoose");
const teacherSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    // Add other fields as needed
});
const Teacher = (0, mongoose_1.model)('Teacher', teacherSchema);
exports.Teacher = Teacher;
