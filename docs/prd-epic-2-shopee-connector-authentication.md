# Epic 2: Shopee Connector & Authentication

## Goal
เชื่อมต่อกับ Shopee Affiliate API ได้สำเร็จ สามารถยืนยันตัวตน (Authentication) และดึงข้อมูลดิบออกมาได้ โดยจัดการข้อจำกัดเรื่อง `scrollId` ได้อย่างถูกต้อง

## Context
Shopee API มีความซับซ้อนเรื่อง Authentication ที่ต้องคำนวณ Signature เอง และมีข้อจำกัดเรื่อง Pagination ที่ `scrollId` หมดอายุเร็วมาก (30 วินาที) Epic นี้จะโฟกัสแค่การ "คุย" กับ Shopee ให้รู้เรื่องและดึงข้อมูลได้ทันเวลา

## Stories

### Story 2.1: Implement Signature Generator
**As a** Developer Agent,
**I want** to implement a utility function to generate the HMAC-SHA256 signature,
**so that** I can authenticate requests with the Shopee API.

**Acceptance Criteria:**
1. ฟังก์ชันรับ Input: `AppId`, `Secret`, `Timestamp`, `Payload`
2. ฟังก์ชันคืนค่า Signature ที่ถูกต้องตาม Algorithm ของ Shopee (SHA256)
3. มี Unit Test ยืนยันความถูกต้องของ Logic การคำนวณ

### Story 2.2: Implement GraphQL Client & Basic Query
**As a** Developer Agent,
**I want** to setup a GraphQL client and write a query to fetch the offer list,
**so that** I can retrieve raw product data from Shopee.

**Acceptance Criteria:**
1. สร้าง GraphQL Query สำหรับดึง `offerList` โดยเลือกเฉพาะ Field ที่กำหนดใน Schema (จาก Epic 1)
2. สามารถส่ง Request พร้อม Authorization Header ที่ถูกต้องไปยัง Shopee Endpoint
3. ได้รับ Response 200 OK พร้อมข้อมูล JSON กลับมา

### Story 2.3: Handle Pagination with ScrollId
**As a** Developer Agent,
**I want** to implement a pagination loop using `scrollId`,
**so that** I can fetch all offers, not just the first page.

**Acceptance Criteria:**
1. ลูปดึงข้อมูลหน้าถัดไปโดยใช้ `scrollId` จาก Response ก่อนหน้า
2. **CRITICAL:** Logic การดึงหน้าถัดไปต้องเกิดขึ้นทันทีภายใน 30 วินาทีเพื่อป้องกัน `scrollId` หมดอายุ
3. หยุดลูปเมื่อไม่มีข้อมูลหน้าถัดไป
4. จัดการ Error กรณี `scrollId` หมดอายุ (Graceful Error Handling)