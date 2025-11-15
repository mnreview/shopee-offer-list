# Product Requirements Document (PRD)

| Project Name | Shopee Offer List Synchronization Service (Serverless Edition) |
| :--- | :--- |
| **Version** | 1.0 |
| **Status** | Approved |
| **Last Updated** | 2025-11-15 |
| **Author** | John (PM) |

## 1. Goals and Background Context

### Goals
* [cite_start]**Data Synchronization:** สร้างระบบดึงข้อมูลสินค้า (Offer List) จาก Shopee Affiliate API มาจัดเก็บในฐานข้อมูลส่วนตัวโดยอัตโนมัติ [cite: 352]
* **Zero Cost Architecture:** ออกแบบและพัฒนาระบบให้ทำงานภายใต้ต้นทุนโครงสร้างพื้นฐาน **0 บาท** โดยใช้เทคโนโลยี Serverless และ Free Tier Database
* **Data Efficiency:** คัดกรองเฉพาะ Field ที่จำเป็นต่อการใช้งานเพื่อประหยัดพื้นที่จัดเก็บและลดปริมาณการเขียนข้อมูล (Write Operations)
* **Continuous Updates:** ระบบต้องทำงานตามรอบเวลา (Scheduled) เพื่อให้ข้อมูลมีความสดใหม่อยู่เสมอ

### Background Context
เรากำลังพัฒนาเว็บแอปพลิเคชันสำหรับ Affiliate Marketers เพื่อช่วยในการค้นหาและเปรียบเทียบสินค้าจาก Shopee ได้อย่างมีประสิทธิภาพกว่าหน้าเว็บปกติ

เพื่อให้บรรลุเป้าหมายนี้ เราจำเป็นต้องมีฐานข้อมูลของเราเอง แต่ด้วยข้อจำกัดด้านงบประมาณ เราจึงไม่สามารถรัน Server ตลอด 24 ชั่วโมงได้ ทางออกคือการใช้สถาปัตยกรรม **Event-Driven Serverless** (Function-as-a-Service) ร่วมกับ **Turso Database** ซึ่งทำงานเฉพาะเมื่อถึงกำหนดเวลาดึงข้อมูล ทำให้ไม่มีค่าใช้จ่ายในช่วงเวลาที่ระบบไม่ได้ทำงาน (Idle Time)

## 2. Requirements

### Functional Requirements (FR)

#### FR1: Authentication & Security
* **FR1.1:** ระบบต้องสามารถสร้าง Signature ตามมาตรฐาน HMAC-SHA256 โดยใช้ `AppId`, `Timestamp`, `Payload`, และ `Secret` ได้อย่างถูกต้อง
* **FR1.2:** ระบบต้องแนบ Authorization Header ในทุก Request ที่ส่งไปยัง Shopee API

#### FR2: Data Fetching (Shopee API)
* **FR2.1:** ระบบต้องดึงข้อมูล Offer List ผ่าน GraphQL Endpoint
* **FR2.2:** ระบบต้องจัดการ Pagination โดยใช้ `scrollId` อย่างเคร่งครัด
* **FR2.3:** กระบวนการดึงข้อมูลหน้าถัดไปต้องเกิดขึ้นภายใน 30 วินาทีหลังจากได้รับ `scrollId` ล่าสุด เพื่อป้องกัน `scrollId` หมดอายุ

#### FR3: Data Processing & Filtering
* **FR3.1:** ระบบต้องคัดกรอง (Filter) ข้อมูลที่ได้รับ โดยเลือกเก็บเฉพาะ Field ที่กำหนดไว้ใน Whitelist (เช่น ชื่อสินค้า, ราคา, คอมมิชชัน, ลิงก์, รูปภาพ) เพื่อลดขนาดข้อมูล
* **FR3.2:** แปลงรูปแบบข้อมูล (Data Transformation) ให้สอดคล้องกับ Schema ของฐานข้อมูลปลายทาง

#### FR4: Data Persistence (Turso DB)
* **FR4.1:** บันทึกข้อมูลลงใน Turso Database
* **FR4.2:** ใช้กลไก "Upsert" (Update if exists, Insert if new) เพื่อป้องกันข้อมูลซ้ำซ้อนและอัปเดตข้อมูลให้เป็นปัจจุบัน

#### FR5: Scheduling & Execution
* **FR5.1:** ระบบต้องถูกกระตุ้น (Trigger) ให้ทำงานอัตโนมัติตามตารางเวลา (Cron Job) ผ่าน Cloud Scheduler

### Non-Functional Requirements (NFR)

* **NFR1 - Cost Constraint:** ระบบต้องทำงานภายใต้ขีดจำกัดของ Free Tier (Turso Free Tier & Cloud Function Free Tier) ห้ามมีค่าใช้จ่ายส่วนเกิน
* **NFR2 - Execution Limit:** การทำงานแต่ละรอบต้องไม่เกิน Timeout สูงสุดของ Serverless Platform (เช่น 9 นาที หรือ 15 นาที แล้วแต่ผู้ให้บริการ)
* **NFR3 - Rate Limiting:** ระบบต้องควบคุมอัตราการยิง Request ไม่ให้เกิน 2000 ครั้ง/ชั่วโมง

## 3. Technical Assumptions

* **Architecture Pattern:** Event-Driven Serverless (Scheduler -> Function -> DB)
* **Database:** Turso (LibSQL/SQLite over HTTP)
* **Backend Runtime:** Node.js (TypeScript) หรือ Python (เลือกตามความถนัดของทีมและ Library Support)
* **Scheduler:** AWS EventBridge หรือ Google Cloud Scheduler

## 4. Epic List

### Epic 1: Foundation & Infrastructure Setup
**Goal:** เตรียมโครงสร้างพื้นฐานทั้งหมดให้พร้อมสำหรับการพัฒนา ทั้ง Database และ Cloud Environment ภายใต้งบประมาณ 0 บาท
* Story 1.1: Setup Turso Database & Schema
* Story 1.2: Setup Cloud Function Project & CI/CD (Local Deploy)
* Story 1.3: Setup Scheduler Trigger (Hello World Test)

### Epic 2: Shopee Connector & Authentication
**Goal:** เชื่อมต่อกับ Shopee API ได้สำเร็จ สามารถยืนยันตัวตนและดึงข้อมูลดิบออกมาได้
* Story 2.1: Implement Signature Generator (HMAC-SHA256)
* Story 2.2: Implement GraphQL Client & Basic Query
* Story 2.3: Handle Pagination with ScrollId (The 30s Challenge)

### Epic 3: Data Processor & Persistence
**Goal:** ประมวลผลข้อมูล คัดกรอง และบันทึกลงฐานข้อมูลจริง พร้อมทำงานแบบวนซ้ำ
* Story 3.1: Implement Data Filtering & Transformation Logic
* Story 3.2: Implement Turso Repository (Upsert Logic)
* Story 3.3: Implement End-to-End Sync Handler

## 5. Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-11-15 | 1.0 | Initial Draft based on Project Brief | John (PM) |