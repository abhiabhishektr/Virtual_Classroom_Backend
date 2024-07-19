import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS
  },
});

// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otpService = {
  async sendOTP(email: string) {
    try { 
      // email="abhishekabtr@gmail.com"
      const otp = generateOTP();

      const mailOptions = {
        from: 'abhishekabtr@gmail.com',
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

      return otp; // Return OTP for verification if needed
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  },


  // Currently not in use,  same function in  src/application/use-cases/authentication/registerUser.ts

  // async verifyOTP(email: string, otpProvided: string) {
  //   const otpKey = `otp:${email}`;
  //   try {
  //     // Retrieve the stored OTP from Redis
  //     const storedOTP = await redisClient.get(otpKey);

  //     if (!storedOTP) {
  //       throw new Error('OTP expired or not found'); // Handle case where OTP has expired or not found
  //     }

  //     // Compare the provided OTP with the stored OTP
  //     if (storedOTP === otpProvided) {
  //       // OTP is valid, delete it from Redis to prevent reuse
  //       await redisClient.del(otpKey);
  //       return true; // Return true indicating OTP verification success
  //     } else {
  //       return false; // Return false indicating OTP verification failure
  //     }
  //   } catch (error) {
  //     console.error('Error verifying OTP:', error.message);
  //     throw new Error('Failed to verify OTP');
  //   }
  // },
};
