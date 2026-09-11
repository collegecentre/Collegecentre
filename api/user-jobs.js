import { getUserSavedAndAppliedJobs } from '../server/jobsHandler.js';

export default async function handler(req, res) {
  return getUserSavedAndAppliedJobs(req, res);
}
