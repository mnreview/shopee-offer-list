# Epic 3: Data Processor & Persistence

## Goal
ประมวลผลข้อมูล คัดกรอง และบันทึกลงฐานข้อมูลจริง พร้อมทำงานแบบวนซ้ำจนครบถ้วน (End-to-End)

## Context
เมื่อเราดึงข้อมูลดิบได้แล้ว (Epic 2) และมีที่เก็บข้อมูลแล้ว (Epic 1) Epic นี้คือการนำทั้งสองส่วนมาประกอบกัน คือเอาข้อมูลดิบมาแปลง (Transform/Filter) แล้วยัดลง DB (Persist) ให้ทันเวลา

## Stories

### Story 3.1: Implement Data Filtering & Transformation
**As a** Developer Agent,
**I want** to process the raw JSON response from Shopee,
**so that** I have a clean data object matching my database schema.

**Acceptance Criteria:**
1. ฟังก์ชันรับ Raw JSON และคืนค่า Array ของ Product Object
2. กรอง Field ที่ไม่ได้ใช้ออก (เก็บเฉพาะ `name`, `price`, `commission`, `link`, `image`)
3. แปลง Data Type ให้ถูกต้อง (เช่น String -> Number สำหรับราคา)

### Story 3.2: Implement Turso Repository (Upsert Logic)
**As a** Developer Agent,
**I want** to implement the database saving logic,
**so that** existing offers are updated and new offers are inserted.

**Acceptance Criteria:**
1. ใช้คำสั่ง SQL แบบ Upsert (`INSERT ... ON CONFLICT DO UPDATE`)
2. รองรับการบันทึกแบบ Batch (เช่น ทีละ 50-100 รายการ) เพื่อลด Round-trip time
3. จัดการกรณี Database Connection Error หรือ Timeout

### Story 3.3: Implement End-to-End Sync Handler
**As a** Developer Agent,
**I want** to connect the Scheduler Trigger (Epic 1) to the Shopee Fetcher (Epic 2) and Data Saver (Epic 3),
**so that** the entire sync process runs automatically.

**Acceptance Criteria:**
1. Function หลัก (Entry point) เรียกใช้ Fetch -> Transform -> Save ได้อย่างต่อเนื่อง
2. ระบบทำงานจบกระบวนการภายใน Timeout ของ Serverless Function (เช่น 15 นาที)
3. มี Log บันทึกสถานะการทำงาน (Start, Success Count, Error, End)
4. ตรวจสอบปริมาณการใช้งานจริงเทียบกับ Free Tier Limits