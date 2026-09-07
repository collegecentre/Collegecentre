# CollegeCentre — Student Job-Finding Platform

A focused, paid job-finding platform designed specifically for college students and freshers, powered by the **₹199 / 24-Hour Job Hunt Pass** model and built with **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## Core Product Principle
> *"I pay ₹199, spend 24 focused hours finding the right opportunities, apply to them, and keep my application tracker forever."*

- **₹199 / 24 Hours**: Unlocks NEW job discovery, keyword search, and AI matching.
- **Student Account**: Retains **permanent access** to all saved jobs, applied jobs, recruitment status pipeline (`Applied` → `Shortlisted` → `Selected`), interview notes, and student profiles even after the 24-hour pass expires.

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

### 3. Build for Production
```bash
npm run build
```

---

## Features

- **24-Hour Pass & Real-Time Countdown**: Live countdown timer (`⏱ 17h 42m remaining`) tracking the active sprint.
- **Simulated Payment Gateway**: 1-click test checkout supporting UPI, Credit/Debit Card, and NetBanking with instant pass activation and confetti celebration.
- **Rule 11 Enforced (Permanent Data Access)**:
  - When the pass expires, new job discovery and search lock.
  - The **Expired Access Screen** appears with an option to renew for ₹199.
  - **Saved Jobs** and **Application Tracker** remain 100% accessible, allowing students to update stages and take notes indefinitely without purchasing another pass.
- **AI Job Matching Engine**:
  - Compares student profile against job openings across Skills (40%), Education (20%), Experience (15%), Location & Work Mode (15%), and Fresher Eligibility (10%).
  - Provides a transparent reasons breakdown for every job.
- **Interactive Pass Simulator**: A quick header tool to simulate active, near-expiry (15 mins left), or expired states instantly.
- **Mobile-First Responsive Design**: Optimized for smartphones with bottom navigation bar and accessible dialogs.
- **Full Page Suite**:
  - **Public**: Landing Page, Pricing Page, Login, Signup.
  - **Student**: Dashboard, Discover Jobs, Job Details Modal, Saved Jobs, Applications Tracker, Profile Editor, Account & Payment History.
