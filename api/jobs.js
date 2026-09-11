import { getProtectedJobs } from '../server/jobsHandler.js';

export default async function handler(req, res) {
  return getProtectedJobs(req, res);
}
