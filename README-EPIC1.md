# Epic 1: Foundation & Infrastructure Setup

## Overview

Epic 1 ได้ทำการสร้างรากฐานสำคัญของโปรเจ็กต์ ได้แก่:
- ✅ Turso Database schema และ migration system
- ✅ Serverless function entry point พร้อม health check
- ✅ Configuration และ logging utilities
- ✅ TypeScript type definitions

## What's Implemented

### Database Layer (`db/`, `src/lib/db.ts`)
- **Schema**: Table `offers` พร้อม indexes สำหรับ `updated_at` และ `category_name`
- **Migration System**: Automatic migration runner (`scripts/migrate.ts`)
- **Connection**: Turso client initialization ด้วย retry logic

### Serverless Function (`src/index.ts`)
- **Handler**: Main entry point สำหรับ cloud scheduler trigger
- **Health Check**: Endpoint สำหรับตรวจสอบสถานะ database connection
- **Error Handling**: Graceful error handling พร้อม structured logging

### Utilities (`src/lib/`)
- **Config** (`config.ts`): Environment variable validation
- **Logger** (`logger.ts`): Structured JSON logging (production) และ readable format (development)
- **Database** (`db.ts`): Connection pooling และ retry logic

## Setup Instructions

### 1. Turso Database Setup

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create shopee-offer-list

# Get database URL
turso db show shopee-offer-list --url

# Create auth token
turso db tokens create shopee-offer-list
```

### 2. Environment Configuration

สร้างไฟล์ `.env` จาก template:

```bash
cp .env.example .env
```

แก้ไขค่าตัวแปร:

```env
TURSO_DATABASE_URL=libsql://shopee-offer-list-[your-org].turso.io
TURSO_AUTH_TOKEN=eyJhbGc...
NODE_ENV=development
LOG_LEVEL=info
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Migrations

```bash
# Check migration status
pnpm migrate:status

# Apply migrations
pnpm migrate
```

### 5. Test Locally

```bash
# Test function handler
pnpm function:test

# Test health check
pnpm function:health
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Vite dev server (frontend) |
| `pnpm build:function` | Build serverless function |
| `pnpm migrate` | Apply database migrations |
| `pnpm migrate:status` | Show migration status |
| `pnpm function:test` | Test function locally |
| `pnpm function:health` | Test health check endpoint |

## Project Structure

```
shopee-offer-list/
├── db/
│   └── migrations/
│       └── 001_create_offers_table.sql   # Initial schema
├── src/
│   ├── index.ts                          # Function entry point
│   ├── types.ts                          # TypeScript definitions
│   └── lib/
│       ├── db.ts                         # Database client
│       ├── config.ts                     # Environment config
│       └── logger.ts                     # Structured logging
├── scripts/
│   └── migrate.ts                        # Migration runner
├── .env.example                          # Environment template
└── package.json                          # Dependencies & scripts
```

## Database Schema

### `offers` Table

```sql
CREATE TABLE offers (
    offer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL,
    commission_rate REAL,
    commission REAL,
    link TEXT,
    image_url TEXT,
    category_name TEXT,
    updated_at INTEGER NOT NULL
);

-- Indexes
CREATE INDEX idx_offers_updated_at ON offers(updated_at);
CREATE INDEX idx_offers_category ON offers(category_name);
```

### `_migrations` Table (Internal)

```sql
CREATE TABLE _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at INTEGER NOT NULL
);
```

## Testing

### Test Database Connection

```bash
# Start function locally
pnpm function:test
```

Expected output:
```json
{
  "statusCode": 200,
  "headers": { "Content-Type": "application/json" },
  "body": {
    "status": "ok",
    "timestamp": 1700000000000,
    "database": {
      "connected": true,
      "latency_ms": 150
    },
    "version": "0.1.0-epic1"
  }
}
```

### Test Health Check

```bash
pnpm function:health
```

Expected output:
```json
{
  "status": "ok",
  "timestamp": 1700000000000,
  "database": {
    "connected": true,
    "latency_ms": 120
  },
  "version": "0.1.0-epic1"
}
```

## Troubleshooting

### Error: "TURSO_DATABASE_URL environment variable is required"

**Solution:** ตรวจสอบว่า `.env` file มีอยู่และมีค่าครบถ้วน

### Error: "Database connection failed"

**Solution:**
1. ตรวจสอบว่า database URL ถูกต้อง
2. ตรวจสอบว่า auth token ยังใช้งานได้
3. ทดสอบ connection ด้วย `turso db shell shopee-offer-list`

### Error: "Failed to read migrations directory"

**Solution:** ตรวจสอบว่า `db/migrations/` directory มีอยู่

## What's Next

Epic 1 สร้างรากฐานเรียบร้อยแล้ว ขั้นตอนต่อไป:

### Epic 2: Shopee Connector & Authentication
- [ ] Implement HMAC-SHA256 signature generator
- [ ] Create GraphQL client for Shopee API
- [ ] Handle pagination with scrollId

### Epic 3: Data Processor & Persistence
- [ ] Implement data filtering and transformation
- [ ] Create Turso repository with upsert logic
- [ ] Build end-to-end sync handler

## Success Criteria Checklist

- [x] Turso database ถูกสร้างและเชื่อมต่อได้
- [x] Table `offers` ถูกสร้างพร้อม indexes
- [x] Migration system ทำงานได้ (apply/rollback)
- [ ] Serverless function deploy สำเร็จ (pending cloud setup)
- [ ] Scheduler trigger function ตามเวลา (pending cloud setup)
- [x] Code ครบตาม specification
- [x] Documentation ครบถ้วน

## Resources

- [Turso Documentation](https://docs.turso.tech/)
- [Google Cloud Functions](https://cloud.google.com/functions/docs)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/)
- [OpenSpec Change Proposal](./openspec/changes/implement-epic1-foundation-infrastructure/)

## License

MIT
