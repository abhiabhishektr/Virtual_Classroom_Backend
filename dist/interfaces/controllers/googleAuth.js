"use strict";
// src/controllers/googleAuth.ts
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
exports.googleAuthCallback = void 0;
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const registerUser_1 = require("../../application/use-cases/authentication/registerUser");
const oauth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:5173');
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { code } = req.body; // Authorization code should be in query parameters
    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }
    try {
        // Exchange the authorization code for tokens
        const { tokens } = yield oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // Get user info from Google People API
        const people = googleapis_1.google.people({ version: 'v1', auth: oauth2Client });
        const response = yield people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses,photos',
        });
        const userInfo = response.data;
        // Extract user details
        const email = ((_b = (_a = userInfo.emailAddresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || '';
        const name = ((_d = (_c = userInfo.names) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.displayName) || 'No name';
        const googleId = (_f = (_e = userInfo.resourceName) === null || _e === void 0 ? void 0 : _e.split('/')[1]) !== null && _f !== void 0 ? _f : ''; // Extract googleId from resourceName
        console.log("google id", googleId);
        const profilePicture = ((_h = (_g = userInfo.photos) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.url) || 'No profile picture';
        const googleTokens = yield (0, registerUser_1.googleLogin)({ email, name, googleId, profilePicture });
        res.json({
            success: true,
            token: googleTokens,
            user: {
                name,
                email,
                profilePicture,
            }
        });
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
exports.googleAuthCallback = googleAuthCallback;
