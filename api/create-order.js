import { createOrder } from '../server/razorpayHandlers.js';

export default async function handler(req, res) {
  return createOrder(req, res);
}
