// src/interfaces/controllers/user/coursePaymentController.ts

import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createUserCourseRepository } from '../../../application/repositories/CourseEnrollmentRepository';
import { User } from '../../../types/user';

// Initialize Razorpay instance with your credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Initialize repository and use case
const courseRepository = createUserCourseRepository();


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.body;
  const userId = (req.user as User)?.id ?? null;

  if (!courseId || !userId) {
    res.status(400).json({ message: 'Course ID and User ID are required!' });
    return;
  }


  try {
    const isPurchased = await courseRepository.isCoursePurchased(userId, courseId);
    if (isPurchased) {
      res.status(400).json({ message: 'You have already purchased this course.' });
      return;
    }


    const amount = await courseRepository.getCourseAmountById(courseId);
    if (amount === null) {
      res.status(404).json({ message: 'Course not found or amount is not set!' });
      return;
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    razorpayInstance.orders.create(options, async (error, order) => {
      if (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ message: 'Something went wrong while creating the order!' });
        return;
      }

      try {
        await courseRepository.enrollCourse(userId, courseId, order.id, amount);


        res.status(200).json({ data: order, courseId  });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ message: 'Error saving order to database!' });
      }
    });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal Server Error!' });
  }
};
 



// Controller function to verify payment

export const verifyOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId, orderId, signature,courseId } = req.body;
    // console.log(req.body);

    const userId = (req.user as User)?.id ?? null;
    // Validate input
    if (!paymentId || !orderId || !signature) {
      res.status(400).json({ message: 'Invalid request data!' });
      return;
    }

    // Create the signature string to verify
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '') //Secure Hash Algorithm 256-bit)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Compare the generated signature with the one from the request
    if (generatedSignature === signature) {
      // Payment verification successful

      await courseRepository.getEnrollment(userId, orderId,courseId);
      
      //  console.log('re',re);

      res.status(200).json({ message: 'Payment verified successfully!', success: true });
    } else {
      res.status(400).json({ message: 'Invalid payment signature!' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal Server Error!' });
  }
};