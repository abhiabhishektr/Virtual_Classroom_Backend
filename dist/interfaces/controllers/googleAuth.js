"use strict";
// src/interfaces/controllers/googleAuth.ts
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
exports.setupSession = exports.googleCallback = exports.googleAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const loginUser_1 = require("../../application/use-cases/authentication/loginUser");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "localhost:5000/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract necessary information from the Google API response
        const { id: googleId, displayName: name } = profile;
        const email = (_a = profile._json.email) !== null && _a !== void 0 ? _a : '';
        // Call your login function
        const { user, tokens } = yield (0, loginUser_1.googleLoginUser)({ email, profile });
        // Return the user to be serialized and stored in the session
        return done(null, user);
    }
    catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error, undefined);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, "user.id");
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = await User.findById(id);
        done(null, { "user": "user" });
    }
    catch (error) {
        done(error, null);
    }
}));
exports.googleAuth = passport_1.default.authenticate("google", { scope: ["profile", "email"] });
exports.googleCallback = passport_1.default.authenticate("google", {
    failureRedirect: "http://localhost:5173/auth",
    // Do not provide successRedirect here
});
// Handle the session setup after successful authentication
const setupSession = (req, res, next) => {
    // Check if the user is authenticated
    // if (req.isAuthenticated()) {
    // }
    // // Redirect to the appropriate route after session setup
    // res.redirect("/");
};
exports.setupSession = setupSession;
// let user = await User.findOne({ email });
// if (!user) {
//     // If the user doesn't exist, create a new user with the extracted information
//     user = await User.create({
//         googleId,
//         email,
//         name,
//         otp: profile._json.email_verified,
//         googleImage: profile._json.picture,
//     });
// }
