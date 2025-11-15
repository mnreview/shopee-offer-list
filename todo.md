# AffiliatePro: Offer Explorer Dashboard - TODO

## Phase 1: Foundation & Setup
- [x] Initialize Next.js project with React 19 + Tailwind CSS 4 + Shadcn UI
- [x] Set up global styling and theme (light mode with professional colors)
- [x] Configure typography (Inter font via Google Fonts)
- [x] Update APP_LOGO and APP_TITLE in const.ts

## Phase 2: Layout & Navigation
- [x] Create Sidebar component with logo, navigation links, and user profile
- [x] Create Header component with breadcrumbs, global search, and notifications
- [x] Create DashboardLayout wrapper for main content area
- [x] Implement responsive sidebar (hamburger menu on mobile)

## Phase 3: Filter Toolbar
- [x] Create Filter Toolbar card component
- [x] Implement Search Input (product name search)
- [x] Implement Category Select dropdown
- [x] Implement Price Range slider/inputs
- [x] Implement Commission Rate slider
- [x] Implement Sort By dropdown
- [x] Add Reset Filters and Apply buttons
- [x] Wire up filter state management

## Phase 4: Data Table & Pagination
- [x] Create Data Table component with columns
- [x] Image (thumbnail)
- [x] Product Name (with link)
- [x] Category (badge)
- [x] Price (formatted currency)
- [x] Commission Rate (green badge)
- [x] Est. Earn (highlighted)
- [x] Updated (relative time)
- [x] Actions (Get Link, Save buttons)
- [x] Implement Pagination component
- [x] Create mock data structure for products
- [x] Wire up table with filter state

## Phase 5: Responsive Design & Polish
- [x] Test mobile responsiveness (hide sidebar, card list view)
- [x] Create ProductTableMobile component for mobile card view
- [x] Implement empty state UI
- [x] Fine-tune spacing, colors, and typography
- [x] Add micro-interactions and hover states
- [ ] Ensure accessibility (keyboard navigation, ARIA labels)

## Phase 6: Final Review & Delivery
- [ ] Review design against PRD and requirements
- [ ] Create checkpoint for deployment
- [ ] Prepare project for user delivery

## Phase 7: Enhanced Analytics Columns
- [x] Add 'Sales Volume' column to Product interface
- [x] Add 'Review Rating' column to Product interface
- [x] Update mock data with sales and review data
- [x] Add columns to desktop ProductTable
- [x] Add columns to mobile ProductTableMobile
- [x] Format sales volume with K/M notation (e.g., 1.2K, 5M)
- [x] Display review rating with star icon and color coding
- [x] Test responsive layout with new columns
