import { handleParseResume } from '../server/resumeParserHandler.js';

export default async function handler(req, res) {
  return handleParseResume(req, res);
}
