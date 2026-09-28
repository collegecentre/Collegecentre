#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { runAutoJobAdder } from '../server/autoJobAdder.js';

// Auto-load .env or .env.local if present
const envFiles = ['.env.local', '.env'];
for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    try {
      process.loadEnvFile(envPath);
      break;
    } catch {
      // Ignore if cannot parse
    }
  }
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-d');

console.log('----------------------------------------------------');
console.log('  CollegeCentre � Automated Fresher Job Adder');
console.log('----------------------------------------------------');
console.log(`Execution Mode: ${dryRun ? 'DRY RUN (No database changes)' : 'LIVE SYNC'}`);
console.log(`Target: cc_jobs in Supabase (${process.env.SUPABASE_URL ? 'Connected' : 'Offline / Mock'})`);
console.log('Harvesting jobs across 7 remote job networks...\n');

async function main() {
  try {
    const summary = await runAutoJobAdder({ dryRun });

    console.log('\n--- Sync Pipeline Summary ---');
    console.log(`?  Duration: ${summary.durationMs}ms`);
    console.log(`?? Raw Jobs Fetched: ${summary.totalRawFetched}`);
    console.log(`?? Fresher Eligible: ${summary.fresherEligible}`);
    console.log(`? New Jobs Inserted: ${summary.newInserted}`);
    console.log(`?? Already in DB: ${summary.alreadyExisting}`);
    console.log(`?? Stale Jobs Cleaned: ${summary.staleRemoved}`);
    console.log(`?? Telegram Alert: ${summary.telegramNotified ? 'Sent' : 'Skipped/Disabled'}`);
    console.log('----------------------------------------------------\n');

    if (summary.jobs && summary.jobs.length > 0) {
      console.log('Top Fresher Roles Sample:');
      summary.jobs.slice(0, 5).forEach((j, i) => {
        console.log(`  ${i + 1}. [${j.category}] ${j.title} @ ${j.company} (${j.source})`);
        console.log(`     Link: ${j.application_url}`);
      });
      console.log('\n');
    }

    process.exit(0);
  } catch (err) {
    console.error('Fatal error running auto job adder:', err);
    process.exit(1);
  }
}

main();
