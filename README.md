# CollegeCentre — Student Job-Finding Platform

A focused, 100% free job-finding platform designed specifically for college students and freshers, built with **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## Core Product Principle
> *"100% free job discovery for college freshers with zero paywalls, direct employer portal links, deterministic skill matching, and permanent application tracking."*

- **100% Free Forever**: Completely unrestricted access to curated fresher job discovery, keyword search, and batch filtering.
- **Student Pipeline**: Retains **permanent access** to all saved jobs, applied jobs, recruitment status pipeline (`Applied` → `Shortlisted` → `Selected`), interview notes, and student profiles.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Tests
```bash
npx vitest run
```

### 4. Build for Production
```bash
npm run build
```

---

## Features

- **Direct Employer Application Links**: Verified job listings directing candidates straight to official company career portals (Workday, Greenhouse, Lever, etc.).
- **Deterministic Rule-Based Matching Engine**:
  - Compares student profile against job openings across Skills, Education, Experience, Location, and Fresher Eligibility.
  - Transparent match scoring and breakdown with zero AI/LLM cost or instability.
- **Permanent Candidate Pipeline**:
  - Organizes applications through Applied, Shortlisted, Interview, and Selected stages.
  - Unlimited notes, interview preparation tracking, and bookmarked jobs.
- **Mobile-First Responsive Design**: Optimized for smartphones and desktop with bottom navigation bar and accessible dialogs.
- **Full Page Suite**:
  - **Public**: Landing Page, Login, Signup, Terms, Privacy, FAQ.
  - **Student Desk**: Dashboard, Discover Jobs, Job Details Modal, Saved Jobs, Applications Tracker, Candidate Profile, Account Settings.
