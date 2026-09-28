import { describe, it, expect } from 'vitest';
import {
  isFresherJob,
  canonicalJobUrl,
  getJobFingerprint,
  getJobCategory,
  extractSkills,
} from '../server/autoJobAdder.js';

describe('Auto Job Adder � Fresher Filtering & Deduplication', () => {
  it('accepts legitimate entry-level and fresher jobs', () => {
    const jobs = [
      { title: 'Junior Software Engineer', description: 'Looking for a junior engineer with basic React skills.' },
      { title: 'Associate Frontend Developer', description: 'Entry level opportunity for new graduates.' },
      { title: 'Software Engineering Intern', description: 'Summer internship for computer science students.' },
      { title: 'Graduate Trainee - Cloud Ops', description: '0-1 years experience required.' },
      { title: 'Level 1 Support Engineer', description: 'Great opportunity for freshers.' },
      { title: 'Python Developer', description: 'No prior experience required, full training provided.' },
    ];

    jobs.forEach((j) => {
      expect(isFresherJob(j)).toBe(true);
    });
  });

  it('rejects senior, staff, and management roles', () => {
    const jobs = [
      { title: 'Senior Backend Engineer', description: 'Work with Go and Kubernetes.' },
      { title: 'Staff Software Engineer', description: 'Lead architectural design.' },
      { title: 'Engineering Manager', description: 'Manage a team of 10 engineers.' },
      { title: 'Principal Architect', description: 'Design distributed platforms.' },
      { title: 'VP of Engineering', description: 'Oversee technical vision.' },
      { title: 'Senior Director of Product', description: 'Drive roadmap.' },
    ];

    jobs.forEach((j) => {
      expect(isFresherJob(j)).toBe(false);
    });
  });

  it('rejects non-fresher commercial or high-experience roles', () => {
    const commercialJob = {
      title: 'Enterprise Account Executive',
      description: 'Manage Fortune 500 sales accounts.',
    };
    expect(isFresherJob(commercialJob)).toBe(false);

    const highExpJob = {
      title: 'Full Stack Developer',
      description: 'Must have at least 5+ years of experience in Node.js and React.',
    };
    expect(isFresherJob(highExpJob)).toBe(false);
  });

  it('canonicalizes URLs by stripping tracking and UTM parameters', () => {
    const raw = 'https://remotive.com/job/123/?utm_source=twitter&utm_medium=social&ref=partner#apply';
    const clean = canonicalJobUrl(raw);
    expect(clean).toBe('https://remotive.com/job/123');
    expect(clean).not.toContain('utm_source');
    expect(clean).not.toContain('ref');
    expect(clean).not.toContain('#apply');
  });

  it('produces stable fingerprints across varied casing and tracking tags', () => {
    const jobA = {
      title: 'Junior React Developer',
      company: 'Acme Corp',
      url: 'https://example.com/jobs/react?utm_source=rss',
    };
    const jobB = {
      title: 'junior react developer ',
      company: 'ACME CORP',
      url: 'https://example.com/jobs/react',
    };

    expect(getJobFingerprint(jobA)).toBe(getJobFingerprint(jobB));
  });

  it('correctly maps categories based on title and description', () => {
    expect(getJobCategory({ title: 'Junior React Frontend Engineer' })).toBe('Frontend Development');
    expect(getJobCategory({ title: 'Junior Backend Engineer', description: 'Django and PostgreSQL' })).toBe('Backend Development');
    expect(getJobCategory({ title: 'AI Research Intern', description: 'PyTorch deep learning models' })).toBe('Data & AI');
    expect(getJobCategory({ title: 'Flutter Mobile App Trainee' })).toBe('Mobile Development');
    expect(getJobCategory({ title: 'DevOps / Cloud Associate', description: 'AWS and Docker' })).toBe('DevOps & Cloud');
    expect(getJobCategory({ title: 'QA Automation Engineer Intern' })).toBe('QA / Testing');
    expect(getJobCategory({ title: 'UI/UX Design Apprentice', description: 'Figma wireframes' })).toBe('Design / UI / UX');
  });

  it('extracts technical skills accurately from job descriptions', () => {
    const job = {
      title: 'Junior Fullstack Engineer',
      description: 'You will build microservices in Python, TypeScript, and Docker with PostgreSQL database.',
    };
    const skills = extractSkills(job);
    expect(skills).toContain('Python');
    expect(skills).toContain('TypeScript');
    expect(skills).toContain('Docker');
    expect(skills).toContain('PostgreSQL');
  });
});
