import { handleRegisterUser } from '../server/authHandlers.js';

export default async function handler(req, res) {
  return handleRegisterUser(req, res);
}
