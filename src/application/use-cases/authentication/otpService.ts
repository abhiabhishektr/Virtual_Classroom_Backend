import nodemailer from 'nodemailer';
import { redisClient } from '../../../main/redisClient';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification OTP for Virtual Classroom',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Virtual Classroom Verification OTP</h2>
        <p style="font-size: 16px;">Dear Student,</p>
        <p style="font-size: 16px;">Your OTP for verification is: <strong>${otp}</strong></p>
        <p style="font-size: 16px;">Please use this OTP to verify your identity and proceed with accessing the virtual classroom.</p>
        <p style="font-size: 16px;">If you did not request this OTP, please ignore this email.</p>
        <p style="font-size: 16px;">Thank you,</p>
        <p style="font-size: 16px;">Virtual Classroom Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP sent successfully to ${email}`);
};

export const otpService = {
  async sendAndStoreOTP(email: string) {
    const otp = generateOTP();

    try {
      await sendOTPEmail(email, otp);

      const otpKey = `otp:${email}`;
      await redisClient.set(otpKey, otp, { EX: 150 }); // using TTL of 150 seconds ~~ SMALL FLOAT
      console.log('OTP stored successfully in Redis');
      console.log('OTP:', otp);
    } catch (error) {
      console.error('Error sending/storing OTP:', error);
      throw new Error('Failed to send/store OTP');
    }
  },

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const otpKey = `otp:${email}`;
    try {
      const cachedOTP = await redisClient.get(otpKey);
      console.log('Cached OTP:', cachedOTP);

      if (cachedOTP === otp) {
        await redisClient.del(otpKey);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Redis get error:', err);
      return false;
    }
  },
};
