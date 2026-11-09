# PhoneLytics — Premium Smartphone Store Management System

A retail smartphone inventory and retail management SaaS platform built with **React.js**, **Tailwind CSS**, and **LocalStorage persistence**. Designed directly following the uploaded modern retail UI blueprint.

---

## 🚀 Key Features

### 1. Smartphone Inventory (Main Visual Centerpiece)
- **Reference-Accurate Interface**: Clean white & `#F5F5F4` background, minimalist pill navigation, rounded cards, subtle drop shadows, and vibrant `#FF7900` accents.
- **Top Bar**: Date badge and orange `+ New Product` action button.
- **Filters**: Status, Brand, Storage Capacity, Price Range slider, and expandable *More Filters* panel.
- **Tabs with Dynamic Counts**: *All Products*, *In Stock*, *Low Stock*, and *Out of Stock*.
- **3-Column Product Grid**: Realistic smartphone imagery, badges (*New Arrival*, *Popular*, *Best Seller*), storage, RAM, color, SKU/IMEI, price, stock status, and 3-dot action menus.
- **Right-Side Product Details Panel**: Large product showcase, variant color swatches with active ring, rating, views, units sold, hardware specs, profit per unit calculation, stock valuation, and quick actions.

### 2. Executive Dashboard
- **Greeting**: "Good morning, Welcome to PhoneLytics".
- **4 Key Stat Cards**: Phones Sold Today, Revenue Today, Gross Profit Today, Total Remaining Stock.
- **Interactive Recharts**: 7-Day Revenue & Profit Area Chart, Brand Sales Share donut chart, Best-Selling phones leaderboard, Low-Stock warning alerts, and Recent Counter Sales.

### 3. POS (Point of Sale) Register
- Fast search & scan by model name, SKU, or IMEI.
- Quantity adjustment with live stock validation (prevents overselling).
- Discount application (in Uzbekistani Som).
- Payment methods: **Card**, **Cash**, and **Bank Transfer**.
- **Sale Confirmation**: Instant stock decrement, profit margin recording, confetti celebration animation, and printable thermal-styled receipt modal.

### 4. Daily Business Summary & Closing Report
- Complete end-of-day financial reconciliation:
  - Total phones sold
  - Gross sales revenue & discounts
  - Direct smartphone purchase cost
  - **Gross Profit** vs **Net Profit** (displayed separately)
  - Operating expenses deduction (Rent, Electricity, Salaries, Marketing)
  - Remaining physical inventory & warehouse valuation
- **Close Day & Generate Report**: Generates timestamped official summary without modifying or deleting inventory history.
- Historical reports archive with single-click inspection.

### 5. Sales History & Ledger
- Detailed transaction log with Transaction ID, IMEI, Date/Time, Price, Margin, Payment Mode, and Customer.
- Live search, date filters, brand filters, sorting, and modal receipt preview.
- **Export to CSV**: Download complete transaction records directly.

### 6. AI Business Assistant
- Flyout intelligence assistant analyzing live inventory levels, identifying best-performing brands, and recommending margin optimizations.

### 7. Settings & Data Management
- Store branding, manager details, and contact info.
- Default currency: **Uzbekistani Som (`so'm` / UZS)** with formatting (`15 900 000 so'm`).
- Configurable low-stock alert threshold.
- Full database backup export (`.json`) and one-click demo data reset.

---

## 💻 Tech Stack
- **React.js** (JavaScript ES6+, functional components & hooks)
- **Tailwind CSS** (configured with the exact `#FF7900` design palette)
- **Lucide React** (icons)
- **Recharts** (charts & data visualization)
- **Canvas Confetti** (POS sale celebration)
- **Vite** (build tool and dev server)

---

## 🏃‍♂️ Getting Started

### Start the Development Server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Build for Production:
```bash
npm run build
```

