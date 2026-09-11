import { verifyPassStatus } from '../server/razorpayHandlers.js';

export default async function handler(req, res) {
  return verifyPassStatus(req, res);
}
