# Atelier Commerce — Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce web application featuring a curated artisan goods catalog, stateful shopping cart, multi-method checkout with inventory deduction, real-time live order tracking, role-based access control (Admin / Customer), and an administrative CMS dashboard.

---

## 🌟 Key Features

### 🛒 Product Catalog & Storefront
- **Dynamic Catalog Filtering**: Real-time keyword search, category segmented filters, maker/brand selectors, and price/rating sorting.
- **Inventory & Stock Management**: Live stock availability badges, low-stock warnings, and out-of-stock prevention.
- **Product Detail Module (PDP)**: High-resolution visual presentations, complete technical specifications table, quantity steppers, and single-click purchase drawer integration.
- **Zero-Broken-Image Resilience**: High-fidelity vector artworks ensuring offline resilience across evaluation sandboxes.

### 🛍️ Shopping Bag & Checkout Flow
- **Slide-Over Bag Drawer**: Persistent cart stored in `localStorage`, quantity increment/decrement, piece deletion, and complimentary courier shipping threshold progress bar ($150 target).
- **Multi-Method Checkout**:
  - **Credit / Debit Card**: Simulated 3D-Secure payment flow.
  - **Cash on Delivery (COD)**: Transparent total amounts with courier SMS dispatch verification.
  - **Wire Transfer**: Direct IBAN/SWIFT invoice generation.
- **Automated Stock Deduction**: Automatically decrements product stock on successful placement.

### 🚚 Real-Time Order Tracking & Audit Log
- **Visual 4-Step Stepper**: Chronological status tracking (*Order Received* $\to$ *Inspection & Packing* $\to$ *In Transit* $\to$ *Delivered*).
- **Searchable Tracking IDs**: Lookup any order by tracking number (e.g., `ATL-883104` or `ATL-914280`).
- **Milestone Audit Log**: Historical timestamps and notes logging package handling at regional fulfillment centers.
- **Account Order Archive**: Quick-access history of all orders placed by logged-in customers.

### 🔐 Authentication & Role-Based Access Control (RBAC)
- **Cryptographic Security**: Passwords hashed with Node.js `pbkdf2Sync` (1,000 rounds, SHA-512 with unique cryptographic salt per user).
- **Signed Session Tokens**: Stateless tokens with HMAC-SHA256 signature verification.
- **Role Differentiation**:
  - **Customer**: Browse catalog, place orders, view order archive.
  - **Administrator**: Access operational dashboard, manage inventory, update dispatch statuses, manage taxonomy, and review user accounts.

### 📊 Administrative Dashboard (CMS)
- **KPI Metrics**: Real-time calculation of Gross Revenue, Total Orders, Active In-Transit Shipments, and Registered Accounts.
- **Product Management (CRUD)**: Create new catalog entries with custom specs, edit existing items, adjust pricing, and delete items.
- **Order Dispatch Management**: Review all customer orders, inspect line items and shipping addresses, and change fulfillment status with custom transit notes.
- **Taxonomy Management**: Create and delete categories and artisan brand profiles.
- **Database Reset**: One-click restore button to re-seed factory demo fixtures at any time.

---

## 🔑 Pre-Seeded Demo Credentials

The platform is pre-seeded with two demo accounts for testing:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@store.com` | `admin123` | Full access to Admin CMS, Order Updates, Product CRUD, User Directory |
| **Customer** | `user@store.com` | `user123` | Shopping cart, checkout, and order tracking history |

> *Tip: You can also use the **"One-Click Demo Customer"** or **"Switch to Admin"** buttons located in the navigation bar and checkout view for instant evaluation.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js, Express 4.x REST APIs.
- **Database**: File-backed relational JSON database (`data/store.json`) with atomic write synchronization (`fs.writeFileSync` with atomic temp-swap) supporting relational models (`users`, `categories`, `brands`, `products`, `orders`).
- **Build System**: Vite 8 with integrated full-stack development middleware mode.

---

## 📂 Project Structure (Separated Frontend & Backend)

```text
├── server/                      # ─── DECOUPLED BACKEND ───
│   ├── app.ts                  # Pure Express REST API application
│   ├── db.ts                   # Relational database engine, PBKDF2 hashing & seed fixtures
│   └── standalone.ts           # Independent backend server entry point (PORT 5000)
├── data/
│   └── store.json              # Relational persistent database storage
├── src/                        # ─── DECOUPLED FRONTEND ───
│   ├── components/
│   │   ├── AdminDashboard.tsx  # Admin CMS (KPIs, Products, Orders, Taxonomy, Users)
│   │   ├── AuthModal.tsx       # Authentication modal & one-click demo logins
│   │   ├── CartDrawer.tsx      # Slide-over shopping bag with threshold meter
│   │   ├── Catalog.tsx         # Filterable, searchable product grid
│   │   ├── CheckoutView.tsx    # Multi-step checkout with address & payment modes
│   │   ├── CraftStorySection.tsx # Workshop craftsmanship story with background visual
│   │   ├── Footer.tsx          # Quiet, compliant footer with navigation & policies
│   │   ├── Header.tsx          # 3-zone Top Bar Contract navigation
│   │   ├── Hero.tsx            # Architectural sunlit studio hero with background artwork
│   │   ├── OrderTracker.tsx    # Real-time 4-step dispatch progress & audit log
│   │   ├── ProductCard.tsx     # High-density product card with Zero-Pill metadata
│   │   └── ProductDetailModal.tsx # Contiguous purchase module & technical specs
│   ├── context/
│   │   └── StoreContext.tsx    # Global cart, user state, and view routing
│   ├── services/
│   │   └── api.ts              # Frontend API client (supports VITE_API_URL for separate hosts)
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for all domain entities
│   ├── utils/
│   │   ├── backgrounds.ts      # Architectural background artworks & studio textures
│   │   └── productImages.ts    # Resilient vector artworks for Zero-Broken-Image safety
│   ├── App.tsx                 # Root application view coordinator
│   ├── index.css               # Tailwind CSS v4 setup and typography themes
│   └── main.tsx                # React entry point
├── server.ts                   # Unified Full-Stack entry point (Express + Vite)
├── metadata.json               # Project manifest and AI Studio capabilities
├── package.json                # Dependencies and npm scripts
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🚀 Deployment Options

### Option A: Unified Full-Stack Deployment (Default / Cloud Run / Single Container)
Run frontend and backend together from a single Node.js process:
```bash
# 1. Install dependencies
npm install

# 2. Build the frontend
npm run build

# 3. Start unified production server (serves both API & Frontend on port 3000)
npm start
```

### Option B: Separate Frontend and Backend Deployment
Frontend and Backend can be deployed independently across different hosting providers:

#### 1. Deploy Backend Separately (Render, Railway, Fly.io, AWS, Docker):
- **Command to run backend**:
  ```bash
  npm run start:backend
  ```
- Exposes all REST APIs at `http://localhost:5000/api/*` (or configured `PORT`).
- Health check available at `/api/health`.

#### 2. Deploy Frontend Separately (Vercel, Netlify, Cloudflare Pages, S3):
- Build the client distribution:
  ```bash
  npm run build:frontend
  ```
- Set environment variable pointing to your deployed backend URL:
  ```env
  VITE_API_URL="https://your-backend-api.onrender.com"
  ```
- Output directory to publish: `dist/`.

### 4. Code Quality & Verification
Validate TypeScript types:
```bash
npm run lint
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account with salted password hash |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue signed token |
| `GET` | `/api/auth/me` | User | Retrieve current user profile |
| `GET` | `/api/products` | Public | List products (with `category`, `brand`, `search`, `sort`) |
| `GET` | `/api/products/:id` | Public | Get single product by ID |
| `POST` | `/api/products` | Admin | Create new catalog item |
| `PUT` | `/api/products/:id` | Admin | Update product details and inventory |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `GET` | `/api/categories` | Public | List all categories |
| `POST` | `/api/categories` | Admin | Create a category |
| `DELETE` | `/api/categories/:id` | Admin | Remove a category |
| `GET` | `/api/brands` | Public | List all brands/ateliers |
| `POST` | `/api/brands` | Admin | Register new brand |
| `DELETE` | `/api/brands/:id` | Admin | Remove a brand |
| `GET` | `/api/orders` | Auth | Get order history (user orders or all if admin) |
| `GET` | `/api/orders/:id` | Public/Auth | Get order by ID or tracking code (e.g. `ATL-883104`) |
| `POST` | `/api/orders` | Public/Auth | Place new order and decrement inventory |
| `PUT` | `/api/orders/:id/status`| Admin | Update order status and append transit log note |
| `GET` | `/api/stats` | Admin | Get revenue, order count, and low stock metrics |
| `GET` | `/api/users` | Admin | Get list of registered users |
| `POST` | `/api/seed` | Admin | Reset database to pristine demo fixtures |

---

## 📄 License
Apache-2.0
