export function isFresherJob(job: any): boolean;
export function canonicalJobUrl(value: string): string;
export function getJobFingerprint(job: any): string;
export function getJobCategory(job: any): string;
export function extractSkills(job: any): string[];
export function harvestFresherJobs(): Promise<any>;
export function runAutoJobAdder(options?: any): Promise<any>;
export function handleSyncJobs(req: any, res: any): Promise<any>;
