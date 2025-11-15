# Epic 1: Foundation & Infrastructure Setup

## Goal
เตรียมโครงสร้างพื้นฐานทั้งหมดให้พร้อมสำหรับการพัฒนา ทั้ง Database และ Cloud Environment ภายใต้งบประมาณ 0 บาท เพื่อรองรับการทำงานแบบ Serverless

## Context
เราต้องการระบบที่ทำงานแบบ Event-Driven Serverless เพื่อประหยัดค่าใช้จ่าย Epic นี้จะโฟกัสที่การเตรียม "ที่อยู่" และ "ที่เก็บข้อมูล" ของระบบให้พร้อมก่อนที่จะเริ่มเขียน Logic การเชื่อมต่อ Shopee

## Stories

### Story 1.1: Setup Turso Database & Schema
**As a** Developer Agent,
**I want** to set up a Turso Database and define the initial schema for storing Offer Lists,
**so that** the application has a persistent storage layer ready for data synchronization.

**Acceptance Criteria:**
1. สร้าง Database ใหม่บน Turso (Free Tier) สำเร็จ
2. เชื่อมต่อ Database ผ่าน Local Environment ได้
3. สร้าง Table `offers` โดยมี Field รองรับ: `offer_id` (PK), `name`, `price`, `commission_rate`, `link`, `image_url`, `updated_at`
4. รองรับการ Upsert (ป้องกันข้อมูลซ้ำ)
5. มี Script สำหรับสร้าง Table (Migration Script) เก็บไว้ใน `db/migrations/`

### Story 1.2: Setup Cloud Function Project & CI/CD
**As a** Developer Agent,
**I want** to initialize a Node.js/TypeScript project for Serverless Functions (AWS Lambda or Google Cloud Functions),
**so that** I have a codebase structure ready for deploying backend logic.

**Acceptance Criteria:**
1. โครงสร้างโปรเจกต์ TypeScript ถูกสร้างขึ้นพร้อม `package.json`
2. ติดตั้ง Dependencies เบื้องต้น (e.g., `dotenv`, `@libsql/client`)
3. มี Function `helloWorld` ที่สามารถ Deploy และทำงานได้จริงบน Cloud Provider (Free Tier)
4. มี Script `npm run build` และ `npm run deploy` ที่ใช้งานได้

### Story 1.3: Setup Scheduler Trigger
**As a** Developer Agent,
**I want** to configure a Cloud Scheduler (AWS EventBridge or Google Cloud Scheduler),
**so that** the system can trigger the function automatically on a schedule.

**Acceptance Criteria:**
1. สร้าง Scheduler Job ที่ยิง Request ไปยัง Function ทุกๆ 1 ชั่วโมง (หรือตาม Config)
2. ยืนยันว่า Function ถูกเรียกทำงานจริงตามเวลาที่กำหนด (ดูจาก Logs)
3. การตั้งค่าต้องอยู่ใน Free Tier Limits