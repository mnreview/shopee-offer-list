# Project Context

## Purpose
Shopee Offer List เป็นแอปพลิเคชัน Affiliate Dashboard สำหรับสำรวจและจัดการรายการสินค้า Shopee Affiliate
- ค้นหาและกรองสินค้า Affiliate ที่มีคอมมิชชั่นสูง
- ติดตามยอดขาย, คะแนนรีวิว และอัตราคอมมิชชั่น
- บันทึกสินค้าที่สนใจเพื่อติดตามต่อ
- รองรับทั้ง Desktop และ Mobile responsive design

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript 5.6** - Type safety
- **Vite 7** - Build tool and dev server
- **Wouter** - Lightweight client-side routing
- **TanStack Query v4** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### UI Components & Styling
- **Radix UI** - Headless accessible components
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **shadcn/ui** - Component collection based on Radix UI + Tailwind

### Backend
- **Node.js** - Runtime
- **Express** - Web server
- **ESBuild** - Backend bundling

### Dev Tools
- **Prettier** - Code formatting
- **pnpm** - Package manager
- **Vitest** - Testing framework

## Project Conventions

### Code Style
- **Formatting**: ใช้ Prettier สำหรับ auto-formatting (รัน `pnpm format`)
- **Type Checking**: TypeScript strict mode เปิดใช้งาน, รัน `pnpm check` ก่อน commit
- **File Naming**:
  - Components ใช้ PascalCase (e.g., `ProductTable.tsx`, `DashboardLayout.tsx`)
  - Utilities และ hooks ใช้ camelCase
  - UI components อยู่ใน `client/src/components/ui/`
  - Feature components อยู่ใน `client/src/components/`
- **Import Paths**: ใช้ path alias `@/` สำหรับ `client/src/`, `@shared/` สำหรับ shared code
- **Component Structure**: ใช้ functional components กับ hooks เท่านั้น, ไม่ใช้ class components

### Architecture Patterns
- **Monorepo Structure**:
  - `client/` - Frontend React application
  - `server/` - Express backend server
  - `shared/` - Shared types และ utilities
  - `openspec/` - Project specifications และ change proposals
- **Component Architecture**:
  - UI components แยกออกจาก business logic
  - ใช้ composition pattern กับ Radix UI primitives
  - Context providers สำหรับ global state (Theme, etc.)
  - Custom hooks สำหรับ reusable logic
- **Error Handling**: ใช้ ErrorBoundary component ครอบทั้งแอป
- **Responsive Design**: Mobile-first approach, แยก component สำหรับ mobile เมื่อจำเป็น
- **Build Process**:
  - Frontend: Vite builds to `dist/public/`
  - Backend: ESBuild bundles server to `dist/`
  - Single build command handles both

### Testing Strategy
- **Test Framework**: Vitest configured แต่ยังไม่มี test suite ครบถ้วน
- **Type Checking**: ใช้ TypeScript เป็นหลักในการตรวจสอบ type safety
- **Manual Testing**: ทดสอบด้วย `pnpm dev` บน localhost:3000
- **TODO**: เพิ่ม unit tests และ integration tests

### Git Workflow
- **Main Branch**: `main` - production-ready code
- **Commit Style**:
  - ใช้ conventional commits format เมื่อเป็นไปได้
  - เช่น: `feat:`, `fix:`, `trigger:`, `🔒` สำหรับ security
- **Version Control**: Git-based, push to remote repository
- **Package Manager**: pnpm v10+ (ระบุไว้ใน packageManager field)

## Domain Context

### Affiliate Marketing Domain
- **Commission Rate**: เปอร์เซ็นต์ที่ affiliate ได้รับจากการขายสินค้า
- **Sales Volume**: จำนวนการขายสินค้าทั้งหมด - ใช้เป็นตัวชี้วัดความนิยม
- **Review Rating**: คะแนนรีวิวสินค้า (0-5 ดาว) - มีผลต่อ conversion rate
- **Product Categories**: Electronics, Home & Living, Fashion, Health & Beauty
- **Saved Products**: รายการสินค้าที่ user bookmark ไว้เพื่อติดตาม

### UI/UX Patterns
- **Filter System**: ค้นหา, กรองตามหมวดหมู่, ช่วงราคา, คอมมิชชั่น
- **Sorting**: เรียงตาม commission, price, sales volume, rating
- **Pagination**: แบ่งหน้าสำหรับรายการสินค้าจำนวนมาก
- **Responsive Tables**: Desktop แสดงเป็น table, Mobile แสดงเป็น cards
- **Real-time Updates**: แสดงเวลาอัพเดทล่าสุดของสินค้า

## Important Constraints

### Technical Constraints
- **Client-Side Routing**: ใช้ Wouter แทน React Router (มี patch สำหรับ wouter@3.7.1)
- **Tailwind CSS v4**: ใช้ Vite plugin แทน PostCSS (breaking change จาก v3)
- **nanoid Version**: ใช้ nanoid 3.3.7 สำหรับ tailwindcss dependency (pnpm override)
- **Path Aliases**: ต้อง config ทั้งใน vite.config.ts และ tsconfig.json ให้ตรงกัน
- **Build Target**: ES modules เท่านั้น (type: "module" ใน package.json)

### Development Constraints
- **Port Configuration**: Default port 3000, auto-fallback ถ้า port ไม่ว่าง
- **Host Restrictions**: Vite server มี allowedHosts whitelist สำหรับ security
- **File System Access**: Strict mode เปิดใช้งาน, ห้ามเข้าถึง dotfiles

### Communication Requirements
- **ภาษาไทย**: สื่อสารกับ user เป็นภาษาไทยที่เข้าใจง่าย non-technical รู้เรื่อง
- **Progress Reporting**: รายงานผลทุกครั้งที่เสร็จงาน: ทำอะไรไป, ได้อะไร, ทดสอบยังไง, `npm run dev` ได้หรือไม่

## External Dependencies

### UI Component Libraries
- **Radix UI**: Accessible headless components - อัพเดท breaking changes ต้องระวัง
- **shadcn/ui**: Pre-built components - ติดตั้งผ่าน `pnpm dlx shadcn@latest add [component]`

### Development Services
- **Manus Runtime**: Vite plugin สำหรับ runtime debugging (development only)
- **Google Maps Types**: Type definitions สำหรับ Map component integration

### Build & Tooling
- **Vite Plugins**:
  - `@vitejs/plugin-react` - React support
  - `@tailwindcss/vite` - Tailwind CSS v4
  - `@builder.io/vite-plugin-jsx-loc` - JSX location tracking
  - `vite-plugin-manus-runtime` - Debug runtime

### Future Integrations (Planned)
- **Shopee Affiliate API**: ปัจจุบันใช้ mock data, วางแผนเชื่อม real API
- **Authentication System**: Supabase (มี commits บ่งชี้ว่ากำลังพัฒนา)
- **Database**: เตรียมพร้อมสำหรับ product และ user data persistence
