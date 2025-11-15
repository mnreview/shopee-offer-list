# Project Brief: Shopee Offer List Synchronization Service

## 1. Executive Summary


โครงการนี้มีวัตถุประสงค์เพื่อสร้างบริการซิงโครไนซ์ข้อมูล (Data Synchronization Service) สำหรับดึงข้อมูล **"Offer List" ทั้งหมด** จาก Shopee Affiliate API เพื่อนำมาจัดเก็บในฐานข้อมูลท้องถิ่น (Local Database)

เป้าหมายหลักคือการสร้างแหล่งข้อมูล (Data Source) ที่จะใช้ขับเคลื่อน **เว็บแอปพลิเคชันสำหรับ Affiliate Marketers** โดยเฉพาะ บริการนี้จะช่วยแก้ปัญหาความไร้ประสิทธิภาพในการค้นหาสินค้าบนแพลตฟอร์ม Shopee ในปัจจุบัน โดยการมอบฟีเจอร์การค้นหา การเปรียบเทียบ และการกรองข้อมูลที่ออกแบบมาเพื่อ Affiliate Marketers โดยเฉพาะ

## 2. Problem Statement


Affiliate Marketers จำเป็นต้องค้นหาและวิเคราะห์สินค้าที่มีศักยภาพสูง (เช่น สินค้าที่น่าสนใจ, คอมมิชชันสูง) เพื่อนำไปโปรโมต

กระบวนการปัจจุบันที่ต้องค้นหาสินค้าโดยตรงผ่านเว็บไซต์ Shopee นั้น **ไม่มีประสิทธิภาพ** เนื่องจากเครื่องมือค้นหาและตัวกรองถูกออกแบบมาสำหรับ *ผู้บริโภคทั่วไป* ไม่ใช่ *นักการตลาด* พวกเขาขาดเครื่องมือเฉพาะทางในการคัดกรอง เปรียบเทียบ หรือค้นหาสินค้าที่ตรงกับความต้องการเชิงกลยุทธ์ของ Affiliate Marketing

สิ่งนี้ทำให้ Marketers เสียเวลาในการค้นหาสินค้า และอาจพลาดโอกาสในการโปรโมตสินค้าที่ให้ผลตอบแทนสูง

## 3. Proposed Solution


เราจะสร้างบริการ Backend (Service) ที่ทำงานเบื้องหลังเพื่อซิงโครไนซ์ข้อมูล "Offer List" ทั้งหมดจาก Shopee API อย่างต่อเนื่อง (วนลูป)

ข้อมูลนี้จะถูกจัดเก็บและจัดทำดัชนี (Indexed) ในฐานข้อมูลของเราเอง ซึ่งถูกออกแบบมาเพื่อรองรับการค้นหาที่ซับซ้อนโดยเฉพาะ

ฐานข้อมูลนี้จะทำหน้าที่เป็น Backend ให้กับเว็บแอปพลิเคชันใหม่ ที่จะมอบประสบการณ์การค้นหาที่เหนือกว่าแก่นักการตลาด ทำให้พวกเขาสามารถค้นหาสินค้าได้ "ง่ายและตรงจุดกว่า" ผ่านตัวกรองและการเปรียบเทียบที่สร้างขึ้นเพื่อพวกเขาโดยเฉพาะ

## 4. Target Users


* **Primary User Segment: Affiliate Marketers**
    * **Description:** ผู้ใช้งานที่ต้องการค้นหาสินค้า "ที่น่าสนใจ" จาก Shopee เพื่อนำไปโปรโมตผ่านช่องทางของตนเอง
    * **Needs:** ต้องการเครื่องมือค้นหา (Search), เปรียบเทียบ (Compare), และตัวกรอง (Filter) ที่ทรงพลังและออกแบบมาสำหรับ Affiliate Marketers โดยเฉพาะ เพื่อเพิ่มประสิทธิภาพในการทำงานและเพิ่มรายได้

## 5. Goals & Success Metrics


### Business Objectives
* สร้างรายได้จากค่าสมาชิก (Membership Fees) สำหรับ Affiliate Marketers ที่มาใช้บริการเว็บแอปพลิเคชันนี้

### User Success Metrics
* ผู้ใช้เลือกใช้ระบบค้นหาของเรามากกว่าการค้นหาโดยตรงจาก Shopee
* ผู้ใช้สามารถค้นหาสินค้าได้ **รวดเร็ว**
* ผู้ใช้สามารถ **กรองข้อมูลได้ง่าย** (Easy Filtering)
* ผู้ใช้สามารถ **จัดเรียงได้หลายค่า** (Multi-value Sorting)
* ผู้ใช้สามารถ **ส่งออกข้อมูลหลายรายการ** (Multi-item Export)

### Key Performance Indicators (KPIs)

* **Service KPI:** Data Freshness (ความสดใหม่ของข้อมูล)
* **Service KPI:** Data Completeness (ความครบถ้วนของข้อมูล)
* **Business KPI:** Number of Active Subscribers
* **Business KPI:** Search/Filter/Export Feature Usage Rate

## 6. MVP Scope


### Core Features (Must Have)

* [x] สร้าง Service สำหรับการซิงโครไนซ์ข้อมูล "Offer List" จาก Shopee Affiliate API
* [x] ดึงข้อมูล **บาง Field ที่ API มีให้** สำหรับ Offers
* [x] Service ต้องสามารถทำงานวนซ้ำได้อย่างต่อเนื่อง (Continuous Loop) เพื่ออัปเดตข้อมูล
* [x] ฐานข้อมูลที่ได้ต้องรองรับการค้นหา, กรอง, และจัดเรียงข้อมูล

### Out of Scope for MVP
* [ ] การดึงข้อมูล Conversion Report
* [ ] การสร้าง Short Link

## 7. Post-MVP Vision


* **Phase 2 Features:** เพิ่มการซิงโครไนซ์ข้อมูล Conversion Report
* **Long-term Vision:** เป็นเครื่องมืออันดับหนึ่งสำหรับ Shopee Affiliate Marketers ในการค้นหาและวิเคราะห์สินค้า

## 8. Technical Considerations


### Technology Preferences

* **Database:** ผู้ใช้เสนอ **Turso (Free Tier)** หรือทางเลือกอื่นที่เป็น **Free Tier**
* **Backend:** ไม่ระบุ (ใช้เทคโนโลยีใดก็ได้ที่เหมาะสม)

## 9. Constraints & Assumptions


### Constraints
* **Budget (Infrastructure):** ต้องมีต้นทุนโครงสร้างพื้นฐาน **0 บาท**

### Key Assumptions
* สันนิษฐานว่ามีโซลูชัน Free Tier (เช่น Turso) ที่สามารถรองรับขนาดข้อมูล (Storage) และปริมาณการเขียน (Writes) ของ "Offer List ทั้งหมด" ได้
* สันนิษฐานว่ามีโซลูชัน Free Tier (เช่น AWS Lambda, Cloud Functions, หรือ PaaS อื่นๆ) ที่สามารถรัน Service แบบ **Non-Idling (ทำงานต่อเนื่อง 24/7)** ได้ เพื่อให้สอดคล้องกับข้อจำกัด "ต้นทุน 0 บาท"

## 10. Risks & Open Questions


### Key Risks
* **Technical Risk (0 Baht Constraint):** โซลูชันโฮสติ้ง Free Tier ส่วนใหญ่ มีนโยบาย "Idling/Sleeping" (หยุดทำงานเมื่อไม่มีการใช้งาน) ซึ่งขัดแย้งกับข้อกำหนดที่ Service ต้องทำงานแบบ "Continuous Loop"

## 11. Next Steps


### PM Handoff

เอกสาร Project Brief นี้ให้บริบทที่ครบถ้วนสำหรับโครงการ "Shopee Offer List Synchronization Service" แล้ว ขอส่งมอบงานนี้ให้ **Product Manager (PM)** เพื่อเริ่มกระบวนการสร้าง **Product Requirements Document (PRD)** โดยใช้ `prd-tmpl.yaml`

**ข้อเสนอแนะสำหรับ PM:**
* ทำงานร่วมกับ **Architect** เพื่อประเมินความเสี่ยงที่ระบุไว้ในส่วนที่ 10 โดยเร็วที่สุด
* ยืนยันความเป็นไปได้ทางเทคนิคของ "0 Baht Constraint" ก่อนที่จะกำหนด Non-Functional Requirements (NFRs) ใน PRD