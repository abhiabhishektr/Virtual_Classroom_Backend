"use strict";
// backend/src/infrastructure/database/mongoDB.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = process.env.MONGO_USER;
        const password = process.env.MONGO_PASSWORD;
        const mongoURI = `mongodb://${username}:${password}@localhost:27017/Classroom`;
        const conn = yield mongoose_1.default.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false, // version warnings
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
// import mongoose from 'mongoose';
// export const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Classroom';
//     const conn = await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error : any) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     process.exit(1); // to terminate the Node.js process with an optional exit code.
//   }
// };
// conn.connection.host is the hostname or IP address of the MongoDB server
// useNewUrlParser: true: Ensures Mongoose uses the new URL parser.
// useUnifiedTopology: true: Enables the new server discovery and monitoring engine in MongoDB.
// useCreateIndex: true: Ensures Mongoose uses createIndex() instead of ensureIndex() for index building.
// `useUnifiedTopology: true` in MongoDB enables the use of a new server monitoring engine that improves scalability and reliability for database operations.
