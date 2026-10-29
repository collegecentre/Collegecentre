# CollegeCentre 2.0 — Production Deployment & Launch Guide

This document outlines the architecture, deployment sequence, environment setup, database migrations, security hardening, and rollback strategies for launching **CollegeCentre 2.0** into production.

---

## 1. Production Architecture Overview

- **Frontend / Application Server**: Next.js 16 (App Router, React Server Components, Turbopack).
- **Hosting Tier**: Vercel, Fly.io, or Node.js container (AWS ECS / Google Cloud Run).
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS) on all public and private schemas.
- **Object Storage**: Supabase Storage with bucket-level size limits, MIME type restrictions, and folder ownership policies.
- **Analytics**: Privacy-conscious, cookie-free aggregated telemetry (zero personal IP tracking).
- **Billing Tier**: Pluggable `BillingProvider` interface with server-side authorization enforcement.

---

## 2. Pre-Deployment Checklist

### A. Environment Variables
Verify that all production environment variables are configured in your deployment platform:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`: Production Supabase HTTPS endpoint.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Production Supabase anonymous key (RLS-enforced).
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: Server-only secret key (strictly never exposed to client).
- [ ] `NEXT_PUBLIC_APP_URL`: Canonical public domain (`https://collegecentre.in`).
- [ ] `CRON_SECRET`: High-entropy 32-byte secret for automated maintenance jobs.
- [ ] `NODE_ENV`: Set to `production`.

### B. Security & Storage
- [ ] Verify Row Level Security is active on every table: `profiles`, `student_links`, `basic_social_links`, `projects`, `achievements`, `certificates`, `resumes`, `colleges`, `college_members`, `plans`, `subscriptions`, `entitlements`, `billing_events`, `analytics_events`.
- [ ] Verify private profiles (`is_public = false`) cannot be queried for projects, achievements, certificates, or resumes via public REST queries.
- [ ] Verify storage buckets exist with enforced MIME filters:
  - `avatars` (max 5MB: JPEG, PNG, WebP, GIF)
  - `projects` (max 10MB: JPEG, PNG, WebP, GIF)
  - `certificates` (max 10MB: JPEG, PNG, WebP, PDF)
  - `resumes` (max 10MB: PDF only)
- [ ] Storage RLS policy active: `auth.uid()::text = (storage.foldername(name))[1]` preventing cross-user file overwrites.

### C. Performance & SEO
- [ ] Production security headers enabled in `next.config.mjs` (HSTS, X-Content-Type-Options, X-Frame-Options, Permissions-Policy).
- [ ] Dynamic XML sitemap verified at `/sitemap.xml`.
- [ ] Dynamic search directives verified at `/robots.txt`.
- [ ] JSON-LD structured data active (`Person` on profiles, `EducationalOrganization` on college pages).
- [ ] Health check endpoint live at `/api/health`.

---

## 3. Database Migration Sequence

Execute migrations in numerical order against the production Supabase PostgreSQL instance:

1. `20261029000000_phase2_auth_profiles.sql` — Auth triggers, base profiles table & RLS.
2. `20261029000001_phase3_student_links.sql` — Basic social links & profile links.
3. `20261029000002_phase5_links_management.sql` — Advanced links manager & categories.
4. `20261029000003_phase6_projects.sql` — Student engineering projects table & ordering.
5. `20261029000004_phase7_achievements.sql` — Verified honors, hackathons & awards.
6. `20261029000005_phase8_certificates.sql` — Professional certificates & credentials.
7. `20261029000006_phase9_resumes.sql` — Resumes table & storage bucket configuration.
8. `20261029000007_phase10_themes.sql` — Theme customization presets & aesthetics.
9. `20261029000008_phase12_analytics.sql` — Privacy-conscious telemetry & aggregation.
10. `20261029000009_phase13_explore_discovery.sql` — Student discoverability & composite indexes.
11. `20261029000010_phase14_colleges.sql` — College hubs, campus directories & institutional RBAC.
12. `20261029000011_phase15_billing_entitlements.sql` — Plans, subscriptions & entitlement gating.
13. `20261029000012_phase16_production_hardening.sql` — Hardened private data isolation, storage MIME filters & high-throughput indexes.

---

## 4. Backup & Disaster Recovery Strategy

1. **Automated Daily Backups**:
   - Supabase Point-in-Time Recovery (PITR) enabled with Write-Ahead Logging (WAL) retaining 7-14 days.
2. **Logical Database Dumps**:
   - Automated nightly `pg_dump -Fc` exported to an encrypted offsite cloud storage bucket (AWS S3 with Object Lock or Cloudflare R2).
3. **Storage Bucket Replication**:
   - Daily snapshot of S3-compatible Supabase storage buckets (`resumes`, `certificates`, `avatars`, `projects`).

---

## 5. Rollback Strategy

1. **Application Deployment Rollback**:
   - Instant 1-click rollback via Vercel/container deployment dashboard to the previous verified commit SHA.
2. **Database Migration Rollback**:
   - All migrations are additive and backwards-compatible with previous application versions.
   - If a rollback is required, revert application code first; schema changes preserve existing column defaults.
3. **DNS Fallback**:
   - Cloudflare / Route53 DNS TTL configured to 300 seconds during major platform launches to enable rapid traffic rerouting if needed.

---

## 6. Observability & Monitoring

- **Health Check Endpoint**: Continuous HTTP GET monitoring to `https://collegecentre.in/api/health` (checked every 60 seconds by BetterStack, UptimeRobot, or Datadog).
- **Error Tracking**: Client and server unhandled exceptions logged through `src/lib/logger.ts`.
- **Alert Thresholds**:
  - API response latency > 1,500ms for 3 consecutive checks.
  - Health check returning non-200 status code.
  - Error rate exceeding 1% of total page requests.
