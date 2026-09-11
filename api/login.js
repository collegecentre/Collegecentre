import { handleLoginUser } from '../server/authHandlers.js';

export default async function handler(req, res) {
  return handleLoginUser(req, res);
}
