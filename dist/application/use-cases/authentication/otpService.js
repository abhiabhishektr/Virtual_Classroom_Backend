"use strict";
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
exports.otpService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const redisClient_1 = require("../../../main/redisClient");
const transporter = nodemailer_1.default.createTransport({
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
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
});
exports.otpService = {
    sendAndStoreOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = generateOTP();
            try {
                yield sendOTPEmail(email, otp);
                const otpKey = `otp:${email}`;
                yield redisClient_1.redisClient.set(otpKey, otp, { EX: 150 }); // using TTL of 150 seconds ~~ SMALL FLOAT
                console.log('OTP stored successfully in Redis');
                console.log('OTP:', otp);
            }
            catch (error) {
                console.error('Error sending/storing OTP:', error);
                throw new Error('Failed to send/store OTP');
            }
        });
    },
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpKey = `otp:${email}`;
            try {
                const cachedOTP = yield redisClient_1.redisClient.get(otpKey);
                console.log('Cached OTP:', cachedOTP);
                if (cachedOTP === otp) {
                    yield redisClient_1.redisClient.del(otpKey);
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.error('Redis get error:', err);
                return false;
            }
        });
    },
};
