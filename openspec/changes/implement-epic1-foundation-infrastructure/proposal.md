# Change: Implement Epic 1 - Foundation & Infrastructure Setup

## Why

โปรเจ็กต์ปัจจุบันมีเฉพาะ Frontend Dashboard ที่ใช้ mock data เท่านั้น แต่เอกสาร PRD และ Architecture กำหนดให้เป็น Full Stack Serverless Application ที่ซิงค์ข้อมูลจาก Shopee Affiliate API

มีช่องว่างระหว่าง Documentation กับ Implementation อย่างมาก:
- ไม่มี Database setup (Turso)
- ไม่มี Serverless function infrastructure
- ไม่มี Scheduler/Cron job setup
- Frontend ใช้ mock data แทนข้อมูลจริง

Epic 1 เป็นรากฐานสำคัญที่ต้องทำก่อน เพื่อเตรียม Database และ Cloud Environment ให้พร้อมรองรับการพัฒนา Epic 2 (Shopee API Integration) และ Epic 3 (Data Processing) ต่อไป

## What Changes

### Infrastructure
- **Setup Turso Database** (Free Tier) พร้อม schema สำหรับเก็บข้อมูล Offer List
- **Create database schema** ตาม design ใน `docs/architecture.md` (offers table with indexes)
- **Setup migration system** สำหรับจัดการ database schema changes

### Serverless Environment
- **Initialize serverless project** (Node.js/TypeScript) สำหรับ Cloud Function
- **Setup build & deployment scripts** สำหรับ deploy ไปยัง cloud provider (AWS Lambda หรือ Google Cloud Functions)
- **Create "Hello World" function** เพื่อทดสอบ deployment pipeline

### Scheduler
- **Setup Cloud Scheduler/Cron** ให้ trigger function ตามเวลาที่กำหนด
- **Configure scheduler** ให้อยู่ภายใน Free Tier limits
- **Verify execution** ผ่าน logs และ monitoring

### Project Structure
- **Reorganize codebase** ให้รองรับทั้ง frontend และ serverless backend
- **Add environment variables management** (.env.example, config files)
- **Setup TypeScript types** สำหรับ database models และ API responses

## Impact

### Affected Specs
- **NEW:** `database` - Database schema และ connection management
- **NEW:** `serverless-infrastructure` - Serverless function setup และ deployment

### Affected Code
- **NEW:** `db/migrations/` - SQL migration scripts
- **NEW:** `src/lib/db.ts` - Turso client initialization
- **NEW:** `src/index.ts` - Serverless function entry point
- **MODIFIED:** `package.json` - เพิ่ม dependencies (@libsql/client, dotenv, etc.)
- **MODIFIED:** `tsconfig.json` - ปรับ config สำหรับ serverless environment
- **NEW:** `.env.example` - Template สำหรับ environment variables
- **NEW:** `scripts/deploy.sh` - Deployment automation

### Breaking Changes
- ไม่มี breaking changes (เป็นการเพิ่ม infrastructure ใหม่)

### Migration Path
- Frontend ยังคงใช้ mock data ได้ปกติ
- Backend infrastructure จะถูกสร้างแยกต่างหาก
- ไม่กระทบ existing code

## Dependencies

### Prerequisites
- Turso account (Free Tier)
- AWS/GCP account (Free Tier) สำหรับ Cloud Function
- Node.js 20.x LTS

### Follows
- Epic 2: Shopee Connector & Authentication (ต้องรอ Epic 1 เสร็จก่อน)
- Epic 3: Data Processor & Persistence (ต้องรอ Epic 1 และ 2 เสร็จก่อน)

## Success Criteria

- ✅ Turso database ถูกสร้างและเชื่อมต่อได้จาก local environment
- ✅ Table `offers` ถูกสร้างพร้อม indexes ครบถ้วน
- ✅ Migration system ทำงานได้ (apply/rollback)
- ✅ Serverless function deploy สำเร็จและ respond ได้
- ✅ Scheduler trigger function ตามเวลาที่กำหนด (verified ผ่าน logs)
- ✅ ทุกอย่างอยู่ภายใน Free Tier limits (0 บาท)
- ✅ Documentation อัพเดทให้สอดคล้องกับ implementation
