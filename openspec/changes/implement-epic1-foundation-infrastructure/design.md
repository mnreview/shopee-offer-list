# Design Document: Epic 1 - Foundation & Infrastructure Setup

## Context

โปรเจ็กต์ Shopee Offer List ปัจจุบันมีเพียง Frontend Dashboard ที่ใช้ mock data แต่เอกสาร PRD กำหนดให้เป็น Full Stack Serverless Application ที่ซิงค์ข้อมูลจาก Shopee Affiliate API

Epic 1 เป็นการวางรากฐานสำคัญ 2 ส่วนหลัก:
1. **Persistent Storage** - Turso Database สำหรับเก็บข้อมูล Offer List
2. **Compute Infrastructure** - Serverless Function ที่ทำงานตามกำหนดเวลา

### Constraints
- **Budget:** 0 บาท (ต้องใช้ Free Tier เท่านั้น)
- **Execution Model:** Event-Driven Serverless (ไม่มี long-running server)
- **Data Freshness:** ข้อมูลต้องอัพเดทอัตโนมัติตามเวลาที่กำหนด

### Stakeholders
- **Frontend Team:** ต้องการ real API endpoint แทน mock data
- **DevOps:** ต้องการ infrastructure ที่ maintain ง่าย และ cost-effective
- **Product:** ต้องการระบบที่ scale ได้ในอนาคต

## Goals / Non-Goals

### Goals
- ✅ สร้าง Turso database พร้อม schema สำหรับเก็บ Offer List
- ✅ สร้าง migration system สำหรับจัดการ schema changes
- ✅ สร้าง serverless function ที่ deploy ได้จริงบน cloud
- ✅ ตั้งค่า scheduler ให้ trigger function อัตโนมัติ
- ✅ ทุกอย่างทำงานภายใต้ free tier (0 cost)
- ✅ มี health check และ logging สำหรับ debugging

### Non-Goals
- ❌ ไม่ implement Shopee API integration (เป็นหน้าที่ของ Epic 2)
- ❌ ไม่ implement data processing logic (เป็นหน้าที่ของ Epic 3)
- ❌ ไม่แก้ไข frontend code (ยังใช้ mock data ต่อไป)
- ❌ ไม่ทำ user authentication (อยู่นอก scope ของ PRD)
- ❌ ไม่ optimize สำหรับ high-traffic ในตอนนี้

## Decisions

### Decision 1: Database - Turso (LibSQL)

**What:** ใช้ Turso เป็น primary database

**Why:**
- ✅ **Free Tier ใจกว้าง:** 500 databases, 9GB storage, 1 billion row reads/month
- ✅ **Serverless-Native:** HTTP-based protocol, ไม่ต้องจัดการ connection pooling
- ✅ **Edge-Ready:** รองรับ distributed deployment (อนาคต)
- ✅ **SQLite Compatibility:** ใช้ SQL ธรรมดา, migration ง่าย
- ✅ **Low Latency:** เหมาะกับ serverless cold start

**Alternatives Considered:**
1. **Supabase PostgreSQL**
   - ❌ Free tier จำกัดกว่า (500MB storage, 50K monthly active users)
   - ❌ Connection pooling ซับซ้อนกว่าสำหรับ serverless
   - ✅ มี built-in auth/realtime (แต่เราไม่ใช้)

2. **Firebase Firestore**
   - ❌ NoSQL schema ไม่เหมาะกับ relational queries
   - ❌ Cost model ตาม read/write operations (ยากคุม)
   - ✅ Realtime sync (แต่ไม่จำเป็น)

3. **MongoDB Atlas**
   - ❌ Free tier เล็กมาก (512MB)
   - ❌ NoSQL ไม่เหมาะกับ structured product data
   - ❌ Connection management ซับซ้อน

**Trade-offs:**
- ➕ Turso ยังใหม่กว่า, community เล็กกว่า
- ➕ Lock-in risk (แต่ SQLite compatible, migrate ได้)
- ➖ Perfect fit สำหรับ use case นี้

### Decision 2: Cloud Provider - Google Cloud Functions

**What:** เลือก Google Cloud Functions (GCF) เป็น serverless platform

**Why:**
- ✅ **Free Tier:** 2M invocations/month, 400K GB-seconds compute
- ✅ **Cold Start:** เร็วกว่า AWS Lambda สำหรับ Node.js (avg 400ms vs 1s)
- ✅ **Cloud Scheduler:** Built-in scheduler service ใน GCP (free 3 jobs)
- ✅ **Simple Pricing:** ไม่มี hidden charges
- ✅ **Easy Deployment:** `gcloud` CLI ใช้งานง่าย

**Alternatives Considered:**
1. **AWS Lambda**
   - ✅ Free tier ใหญ่กว่า (1M requests/month)
   - ❌ Cold start느ช้ากว่า
   - ❌ EventBridge scheduler ซับซ้อนกว่า
   - ❌ IAM/permissions ซับซ้อน

2. **Vercel Serverless Functions**
   - ✅ Deploy ง่ายมาก (Git-based)
   - ❌ Free tier จำกัดมาก (100GB-hours/month)
   - ❌ Execution time limit 10s (ไม่เพียงพอสำหรับ pagination loop)
   - ❌ Cron job ไม่ฟรี

3. **Railway/Render**
   - ❌ ไม่ใช่ pure serverless (มี idle time charging)
   - ❌ Free tier มี sleep policy
   - ✅ เหมาะกับ traditional server มากกว่า

**Trade-offs:**
- ➕ Lock-in กับ GCP (แต่ code เป็น standard Node.js ย้ายได้)
- ➕ ต้องเรียนรู้ GCP console
- ➖ Free tier เพียงพอมากสำหรับ MVP

### Decision 3: Build Tool - ESBuild

**What:** ใช้ ESBuild สำหรับ compile TypeScript → JavaScript

**Why:**
- ✅ **Speed:** เร็วกว่า TSC/Webpack 10-100x
- ✅ **Bundle Size:** Tree-shaking ดีเยี่ยม
- ✅ **Simple Config:** ไม่ต้อง complex webpack config
- ✅ **Single File Output:** เหมาะกับ serverless deployment

**Alternatives Considered:**
- **TSC (TypeScript Compiler):** ช้า, ไม่ bundle dependencies
- **Webpack:** ซับซ้อน, overkill สำหรับ simple function
- **Rollup:** ดีแต่ slow กว่า esbuild

### Decision 4: Migration Strategy - Simple SQL Files

**What:** ใช้ plain SQL files + custom migration runner

**Why:**
- ✅ **Simplicity:** ไม่ต้องพึ่ง ORM/migration framework
- ✅ **Portability:** SQL files อ่านง่าย, ย้าย database ได้
- ✅ **Control:** ควบคุม SQL query ได้เต็มที่
- ✅ **No Dependencies:** ไม่มี heavyweight libraries

**Alternatives Considered:**
1. **Prisma Migrate**
   - ❌ Heavy dependency (~40MB)
   - ❌ ORM lock-in
   - ✅ Type-safe queries (แต่ไม่จำเป็นสำหรับ simple schema)

2. **Knex.js Migrations**
   - ❌ Query builder overhead
   - ❌ Extra abstraction layer
   - ✅ Migration management ดี (แต่ทำเองได้)

**Implementation:**
```typescript
// scripts/migrate.ts
// Read SQL files from db/migrations/
// Track applied migrations in `_migrations` table
// Support up/down migrations
```

### Decision 5: Scheduler Frequency - Every 1 Hour

**What:** ตั้ง cron job ให้รัน function ทุก 1 ชั่วโมง

**Why:**
- ✅ **Data Freshness:** Shopee product data ไม่เปลี่ยนทุกนาที, 1 hour เพียงพอ
- ✅ **Free Tier Safe:** 24 executions/day = 720/month << 2M limit
- ✅ **API Rate Limit:** ไม่กระทบ Shopee API rate limit (2000/hour)

**Alternatives Considered:**
- **Every 15 minutes:** Unnecessary, เปลืองโควต้า
- **Every 6 hours:** Data stale เกินไป
- **Real-time:** ไม่เป็นไปได้ด้วย serverless model

**Flexibility:**
- Config ปรับได้ทีหลังผ่าน environment variable
- เริ่มจาก 1 hour, monitor แล้วปรับ

## Technical Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                    │
│                                                             │
│  ┌──────────────┐         ┌─────────────────────────────┐  │
│  │   Cloud      │ trigger │  Cloud Function (Node 20)  │  │
│  │  Scheduler   ├────────>│                             │  │
│  │  (Cron Job)  │         │  - Entry: src/index.ts      │  │
│  └──────────────┘         │  - Runtime: 60s timeout     │  │
│   0 * * * * (hourly)      │  - Memory: 256MB            │  │
│                           │  - Env: TURSO_* vars        │  │
│                           └────────┬────────────────────┘  │
│                                    │                        │
└────────────────────────────────────┼────────────────────────┘
                                     │
                                     │ HTTP/LibSQL Protocol
                                     │ (TLS encrypted)
                                     ▼
                            ┌─────────────────┐
                            │  Turso Database │
                            │   (Serverless)  │
                            │                 │
                            │  Table: offers  │
                            │  - offer_id PK  │
                            │  - name         │
                            │  - price        │
                            │  - commission   │
                            │  - ...          │
                            │                 │
                            │  Indexes:       │
                            │  - updated_at   │
                            │  - category     │
                            └─────────────────┘
```

### Data Flow (Epic 1 Scope)

```
Scheduler → Cloud Function → Health Check → Database
                          │
                          └─> Return: { status: "ok", db: "connected" }
```

### File Structure

```
shopee-offer-list/
├── src/                          # Serverless function code
│   ├── index.ts                  # Entry point (handler)
│   ├── lib/
│   │   ├── db.ts                 # Turso client
│   │   ├── config.ts             # Environment config
│   │   └── logger.ts             # Structured logging
│   └── types.ts                  # TypeScript types
│
├── db/
│   └── migrations/
│       ├── 001_create_offers_table.sql
│       └── 002_add_indexes.sql
│
├── scripts/
│   ├── migrate.ts                # Migration runner
│   ├── deploy.sh                 # GCP deployment script
│   └── setup-scheduler.sh        # Scheduler configuration
│
├── client/                       # Existing frontend (unchanged)
├── server/                       # Existing Express (deprecated after Epic 1)
│
├── .env.example                  # Environment variables template
├── package.json
└── tsconfig.json
```

## Database Schema

### offers Table

```sql
CREATE TABLE IF NOT EXISTS offers (
    offer_id TEXT PRIMARY KEY,          -- Shopee product ID
    name TEXT NOT NULL,                 -- Product name
    price REAL,                         -- Current price
    commission_rate REAL,               -- Commission % (0-100)
    commission REAL,                    -- Calculated commission amount
    link TEXT,                          -- Affiliate link
    image_url TEXT,                     -- Product image
    category_name TEXT,                 -- Category
    updated_at INTEGER NOT NULL         -- Unix timestamp
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_offers_updated_at
    ON offers(updated_at);

CREATE INDEX IF NOT EXISTS idx_offers_category
    ON offers(category_name);
```

### _migrations Table (Internal)

```sql
CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,          -- e.g., "001_create_offers_table"
    applied_at INTEGER NOT NULL         -- Unix timestamp
);
```

## Environment Variables

### Required Variables

```bash
# Turso Database
TURSO_DATABASE_URL=libsql://[db-name]-[org].turso.io
TURSO_AUTH_TOKEN=eyJhbGc...

# Cloud Function Config
NODE_ENV=production
LOG_LEVEL=info

# Optional
SCHEDULER_FREQUENCY=0 * * * *  # Cron expression
```

### Security Considerations

- ✅ Secrets stored in Google Secret Manager
- ✅ No credentials in code or Git
- ✅ Environment variables encrypted at rest in GCF
- ✅ Principle of least privilege (IAM roles)

## Deployment Process

### One-Time Setup

```bash
# 1. Create Turso database
turso db create shopee-offer-list
turso db show shopee-offer-list --url
turso db tokens create shopee-offer-list

# 2. Setup GCP project
gcloud init
gcloud config set project [PROJECT_ID]

# 3. Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
```

### Deployment Steps

```bash
# 1. Build function
npm run build

# 2. Deploy to GCP
npm run deploy
# Equivalent to:
# gcloud functions deploy shopee-sync \
#   --runtime nodejs20 \
#   --trigger-http \
#   --entry-point handler \
#   --set-env-vars TURSO_DATABASE_URL=...,TURSO_AUTH_TOKEN=...

# 3. Setup scheduler
npm run setup-scheduler
# Creates Cloud Scheduler job targeting function
```

## Risks / Trade-offs

### Risk 1: Free Tier Limits
**Risk:** Exceeding free tier จะเกิดค่าใช้จ่าย

**Mitigation:**
- ตั้ง billing alerts ที่ $0.01
- Monitor usage metrics daily
- Implement circuit breaker ถ้าใกล้ limit
- Scheduler frequency เริ่มต้น conservative (1 hour)

### Risk 2: Cold Start Latency
**Risk:** Function cold start อาจช้า (2-5 seconds)

**Impact:** ไม่สำคัญเพราะ scheduler trigger (ไม่ใช่ user-facing)

**Mitigation:**
- Optimize bundle size (ใช้ esbuild)
- Minimal dependencies
- Keep function warm ด้วย ping (ถ้าจำเป็น)

### Risk 3: Database Connection Errors
**Risk:** Turso อาจ temporary unavailable

**Mitigation:**
- Retry logic with exponential backoff (3 retries)
- Graceful error handling
- Alert on persistent failures
- Scheduler retry policy (cloud native)

### Risk 4: Schema Migration Conflicts
**Risk:** Migration ผิดพลาดอาจทำ data corruption

**Mitigation:**
- Test migrations locally first
- Backup database ก่อน run migration (Turso snapshots)
- Rollback script พร้อมใช้งาน
- Version control migration files

### Risk 5: Vendor Lock-in
**Risk:** ผูกติดกับ GCP/Turso

**Mitigation:**
- Use standard Node.js (ไม่ใช้ GCP-specific APIs)
- Database เป็น SQLite (portable)
- Function code เป็น HTTP handler standard (ย้ายได้)
- Keep infrastructure as code (easy to replicate)

## Migration Plan

### From Current State

**Current:**
- Frontend: React + Mock Data
- Backend: Express (serve static only)

**After Epic 1:**
- Frontend: React + Mock Data (ไม่เปลี่ยน)
- Backend: Express (deprecated, อาจลบภายหลัง)
- **NEW:** Serverless Function (health check only)
- **NEW:** Turso Database (empty, schema ready)

### Migration Steps

1. ✅ Create new infrastructure (parallel with existing)
2. ✅ Test infrastructure independently
3. ⏳ Epic 2: Connect Shopee API to populate database
4. ⏳ Epic 3: Expose database via API for frontend
5. ⏳ Update frontend to use real API
6. ⏳ Deprecate mock data and Express server

### Rollback Plan

- Infrastructure เป็น isolated, ลบได้โดยไม่กระทบ frontend
- Delete GCP resources: `gcloud functions delete shopee-sync`
- Delete Turso database: `turso db destroy shopee-offer-list`
- No changes to existing code

## Performance Considerations

### Expected Performance (Epic 1)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cold Start | < 5s | GCP logs |
| Function Execution | < 10s | GCP logs |
| Database Query | < 100ms | Application logs |
| Scheduler Accuracy | ±2 minutes | Expected for Cloud Scheduler |

### Optimization Opportunities (Future)

- Keep function warm (ping every 5 minutes)
- Edge deployment (Turso edge replicas)
- Lazy loading dependencies
- Connection pooling (if needed)

## Open Questions

### Q1: Should we use TypeScript in strict mode?
**Answer:** YES
- Catch bugs early
- Better IDE support
- Minimal overhead in build

### Q2: Do we need a staging environment?
**Answer:** NOT YET
- Start with production only (low risk for Epic 1)
- Add staging if team grows or complexity increases

### Q3: Should we add monitoring/alerting from day 1?
**Answer:** YES (minimal)
- GCP Cloud Logging (free tier)
- Billing alerts (must have)
- Function error alerts (recommended)
- No need for fancy APM tools yet

### Q4: How to handle database backups?
**Answer:** Use Turso built-in features
- Turso automatic snapshots (included in free tier)
- Point-in-time recovery available
- Manual backup via `turso db dump` if needed

### Q5: Testing strategy for Epic 1?
**Answer:** Manual testing + smoke tests
- Unit tests for migration runner
- Integration test for database connection
- Manual verification of deployment
- Automated tests in Epic 2+ when logic grows

## Success Metrics

### Technical Metrics
- [ ] Database connection < 200ms latency
- [ ] Function cold start < 5 seconds
- [ ] Migration runs without errors
- [ ] Scheduler triggers on time (±2 min)
- [ ] Zero cost (free tier only)

### Deliverables
- [ ] Turso database provisioned
- [ ] Database schema deployed
- [ ] Function deployed and accessible
- [ ] Scheduler configured and running
- [ ] Documentation complete
- [ ] All tasks in tasks.md completed

### Definition of Done
- Code merged to main branch
- Deployment verified in production
- Logs confirm scheduled executions
- Health check endpoint responding
- Documentation reviewed and approved
- Epic 2 can begin immediately
