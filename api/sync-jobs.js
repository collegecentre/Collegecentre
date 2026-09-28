import { handleSyncJobs } from '../server/autoJobAdder.js';

export default async function handler(req, res) {
  return handleSyncJobs(req, res);
}

