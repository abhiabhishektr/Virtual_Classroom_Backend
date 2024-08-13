// import cron from 'node-cron';
// import { User } from './models/User'; 

// // Schedule the cron job to run daily at midnight
// cron.schedule('0 0 * * *', async () => {
//   try {
//     const result = await User.deleteMany({ isVerified: false, otpExpiry: { $lt: new Date() } });
//     console.log(`Cleaned up expired unverified users: ${result.deletedCount} users removed`);
//   } catch (error) {
//     console.error('Error cleaning up expired unverified users:', error);
//   }
// });


