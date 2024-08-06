import razorpay from "../../utils/razorpayClient";

interface CreateOrderOptions {
  amount: number;
  currency: string;
  receipt: string;
}

export const createOrder = async (options: CreateOrderOptions) => {
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Failed to create order');
  }
};
