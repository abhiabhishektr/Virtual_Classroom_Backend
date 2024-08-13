"use strict";
// src/interfaces/controllers/user/coursePaymentController.ts
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
exports.verifyOrder = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const CourseEnrollmentRepository_1 = require("../../../application/repositories/CourseEnrollmentRepository");
// Initialize Razorpay instance with your credentials
const razorpayInstance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
// Initialize repository and use case
const courseRepository = (0, CourseEnrollmentRepository_1.createUserCourseRepository)();
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { courseId } = req.body;
    const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
    if (!courseId || !userId) {
        res.status(400).json({ message: 'Course ID and User ID are required!' });
        return;
    }
    try {
        const isPurchased = yield courseRepository.isCoursePurchased(userId, courseId);
        if (isPurchased) {
            res.status(400).json({ message: 'You have already purchased this course.' });
            return;
        }
        const amount = yield courseRepository.getCourseAmountById(courseId);
        if (amount === null) {
            res.status(404).json({ message: 'Course not found or amount is not set!' });
            return;
        }
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: crypto_1.default.randomBytes(10).toString('hex'),
        };
        razorpayInstance.orders.create(options, (error, order) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error('Razorpay order creation error:', error);
                res.status(500).json({ message: 'Something went wrong while creating the order!' });
                return;
            }
            try {
                yield courseRepository.enrollCourse(userId, courseId, order.id, amount);
                res.status(200).json({ data: order, courseId });
            }
            catch (dbError) {
                console.error('Database error:', dbError);
                res.status(500).json({ message: 'Error saving order to database!' });
            }
        }));
    }
    catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});
exports.createOrder = createOrder;
// Controller function to verify payment
const verifyOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { paymentId, orderId, signature, courseId } = req.body;
        // console.log(req.body);
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        // Validate input
        if (!paymentId || !orderId || !signature) {
            res.status(400).json({ message: 'Invalid request data!' });
            return;
        }
        // Create the signature string to verify
        const generatedSignature = crypto_1.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '') //Secure Hash Algorithm 256-bit)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        // Compare the generated signature with the one from the request
        if (generatedSignature === signature) {
            // Payment verification successful
            yield courseRepository.getEnrollment(userId, orderId, courseId);
            //  console.log('re',re);
            res.status(200).json({ message: 'Payment verified successfully!', success: true });
        }
        else {
            res.status(400).json({ message: 'Invalid payment signature!' });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});
exports.verifyOrder = verifyOrder;
