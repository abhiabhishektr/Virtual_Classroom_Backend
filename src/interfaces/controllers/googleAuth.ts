// // src/interfaces/controllers/googleAuth.ts

// import passport from "passport";
// import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
// import { Request, Response, NextFunction } from "express";
// import { googleLoginUser } from "../../application/use-cases/authentication/loginUser";


// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.clientID!,
//             clientSecret: process.env.clientSecret!,
//             callbackURL: "https://4196-103-170-228-58.ngrok-free.app/auth/google/callback",
//         },
//         async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
//             try {
//                 // Extract necessary information from the Google API response
//                 const { id: googleId, displayName: name } = profile;
//                 const email  = profile._json.email ?? '';
//                 const { user, tokens } = await googleLoginUser({ email, profile });

//                 // Return the user to be serialized and stored in the session
//                 return done(null);
//             } catch (error) {
//                 console.error("Error during Google authentication:", error);
//                 return done(error as Error, undefined);
//             }
//         }
//     )
// );

// passport.serializeUser((user: Express.User, done) => {
//     done(null, (user as IUser).id);
// });

// passport.deserializeUser(async (id: string, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error as Error, null);
//     }
// });

// export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// export const googleCallback = passport.authenticate("google", {
//     failureRedirect: "/auth/login",
//     // Do not provide successRedirect here
// });

// // Handle the session setup after successful authentication
// export const setupSession = (req: Request, res: Response, next: NextFunction) => {
//     // Check if the user is authenticated
//     if (req.isAuthenticated()) {


//     }
//     // Redirect to the appropriate route after session setup
//     res.redirect("/");
// };

// // let user = await User.findOne({ email });
// // if (!user) {
// //     // If the user doesn't exist, create a new user with the extracted information
// //     user = await User.create({
// //         googleId,
// //         email,
// //         name,
// //         otp: profile._json.email_verified,
// //         googleImage: profile._json.picture,
// //     });
// // }