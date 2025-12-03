# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repository contains **KIRASTAY / HOLIKEY**, a multi‑vendor vehicle rental platform built on **Next.js 14 (App Router)** with a **MySQL** backend. It serves multiple roles (admin, agency, customer, driver) and exposes a large set of API endpoints under `src/app/api` that operate on a shared relational schema (users, agencies, vehicles, reservations, etc.).

The codebase mixes a modern React/Next.js front end with a legacy HTML/CSS/JS theme under `public/html-folder`, which is wired into the React layout and components.

## Commands and tooling

All commands below are intended to run from the repo root using Node.js and npm.

### Core app lifecycle

- **Install dependencies**
  - `npm install`
- **Run development server (standard)**
  - `npm run dev`
- **Run development server with fast startup (bypasses some checks, uses custom script)**
  - `npm run dev:fast`
- **Clean Next.js build cache and restart dev server (Windows‑specific script)**
  - `npm run dev:clean`
- **Build production bundle**
  - `npm run build`
- **Start production server (after `npm run build`)**
  - `npm start`

### Linting

ESLint is configured via `eslint.config.mjs` (using `next/core-web-vitals`).

- **Run linter on the project**
  - `npm run lint`

Note: `next.config.mjs` sets `eslint.ignoreDuringBuilds = true`, so CI or local developers should run `npm run lint` explicitly when they care about lint status.

### Database and migration scripts

The platform requires a running **MySQL** instance. Connection settings are controlled by environment variables (used throughout `src/lib/db.js`, `src/lib/database.js`, and the scripts):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

Key scripts in `scripts/` (run with `node <script>`):

- **Run enhanced driver schema migrations (uses `src/lib/db.js`)**
  - `node scripts/run-migrations.js`
- **Apply HOLIKEY enhancement SQL to an existing schema and migrate legacy bookings**
  - `node scripts/migrate-to-holikey-enhanced.js`
- **Set up dynamic content tables and seed content (team members, FAQs, destinations, etc.)**
  - `node scripts/setup-dynamic-content.js`
- **Seed example agencies and their vehicles from the catalog**
  - `node scripts/seed-agencies-and-vehicles.js`
- **Insert sample driver user + driver profile data**
  - `node scripts/insert-sample-drivers.js`

There are also helper scripts under `src/scripts/` and `scripts/` for fixing passwords, restoring assets, and seeding notifications; consult those files directly when needed.

### Tests

There is currently **no dedicated automated test runner or `npm test` script** configured in `package.json`, and no `*.test.*`/`*.spec.*` files were found. To run a specific feature "test", start the dev server (`npm run dev`) and exercise the relevant Next.js page or API route via the browser or HTTP client.

If you add a test framework (Jest, Playwright, etc.), also add the corresponding scripts under `"scripts"` in `package.json` so future agents can run tests via `npm test` or similar.

## High‑level architecture

### Next.js App Router structure (`src/app`)

- **Root layout**: `src/app/layout.js`
  - Imports global styles and wires in **AuthProvider**, **I18nProvider**, and **CurrencyProvider` from `src/contexts` and `src/i18n`.
  - Injects the legacy HTML theme assets by linking CSS from `public/html-folder/css` and JavaScript from `public/html-folder/js` into the `<head>` / `<body>`.
  - All pages render within this provider and asset shell.

- **Entry/home page**: `src/app/page.js`
  - Client component that renders the main marketing/search page.
  - Fetches trending vehicles from `/api/vehicles/trending` and displays them grouped by agency.
  - Uses localization (`useI18n`) and currency formatting (`useCurrency`) contexts, and routes searches to `/search` using `next/navigation`.

- **Role‑specific route groups** (each with its own dashboards and sub‑pages):
  - `src/app/admin/**`: admin dashboards (`dashboard`, `bookings`, `users`, `vehicles`, `settings`, etc.) with an `admin/layout.js` for the admin shell.
  - `src/app/agency/**`: agency owner/operator dashboards (fleet management, earnings, reservations, settings).
  - `src/app/customer/**` and `src/app/user/**`: customer‑facing dashboards and booking management pages.
  - `src/app/driver/**`: driver dashboards, with `driver/layout.js` and role‑specific navigation.
  - Other marketing/utility pages (e.g. `about`, `contact`, `news`, `jobs`, `vacation-packages`, etc.) live alongside these under `src/app`.

Each route group uses shared layout components from `src/components` to maintain a consistent header/footer and dashboard chrome.

### API layer (`src/app/api` and `src/api`)

Most backend logic lives in **Next.js route handlers** under `src/app/api/**/route.js`:

- Endpoints are grouped by domain: `admin`, `agency`, `auth`, `bookings`, `vehicles`, `drivers`, `chat`, `finance`, `notifications`, `analytics`, etc.
- Route handlers use `NextResponse` and call into shared database helpers (`src/lib/db.js` / `src/lib/database.js`) and domain models under `src/models`.
- Example: `src/app/api/bookings/route.js`
  - Handles `POST` to create reservations in the `reservations` schema (creating/updating users, customers, newsletter subscriptions, and reservation extras as needed).
  - Provides `GET` for fetching a single booking or paginated bookings list, joining vehicles, customers, agencies, locations, and extras.
  - Implements `PUT`/`DELETE` for updating status and cancelling bookings, and sends status emails via `src/lib/email.js`.
- Example: `src/app/api/vehicles/trending/route.js`
  - Queries `agency_vehicles` joined with `reservations` and `users` to produce a list of trending vehicles with aggregate stats and grouping by agency for the home page.

There is also a small legacy API surface under `src/api/**` that still uses the older Next.js `pages/api` style; prefer `src/app/api` for new endpoints.

### Data access and models

Database access is centralized in two helper modules:

- `src/lib/db.js`
  - Creates a **mysql2** connection pool using `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
  - Exposes `query(sql, params)` and `testConnection()`.
  - Implements higher‑level helpers such as `getCars`, `getCarById`, and `getFilterOptions` for the legacy `cars` tables.

- `src/lib/database.js`
  - A lighter wrapper around `mysql2/promise` with `query`, `closeConnection`, `testConnection` for newer model classes.

Domain models under `src/models` encapsulate table‑specific logic on top of these helpers:

- `src/models/User.js`
  - Wraps the `users` table: creation (with bcrypt hashing), lookup by id/email, password reset, email verification, generic `update`, `getAll`, and soft‑delete (`deactivate`).

- `src/models/Agency.js`
  - Wraps the `agencies` table and related entities.
  - Handles creation/lookup, filtering and aggregating agencies with vehicle/reservation counts, updating status and ratings, and retrieving related vehicles and reservations.

Other backend helpers live in `src/lib/` and `src/utils/`:

- `src/lib/auth.js`: JWT‑based session management for the HOLIKEY platform (`holikey_session` cookies, role/permission mapping, helpers like `getCurrentSession`, `hasPermission`, `validateApiSession`).
- `src/lib/email.js` / `src/utils/emailService.js` / `src/utils/emailTemplates.js`: email sending and templating used by booking and notification flows.
- `src/utils/pdfGenerator.js`: PDF generation for booking documents.
- `src/lib/payment.js`, `src/lib/notifications.js`, `src/lib/scrapers.js`, etc.: payment integration (Stripe), notification helpers, and data scraping utilities used by admin/seed endpoints and scripts.

### React contexts, localization, and shared UI

- **Auth context**: `src/contexts/AuthContext.js`
  - Manages client‑side session state on top of `/api/auth/*` endpoints.
  - Exposes `login`, `register`, `logout`, and helpers like `isAdmin`, `isAgency`, `isCustomer`, and `checkAuthStatus`.
  - Redirects users to the appropriate dashboard based on `user_type`/`role`.

- **Currency context**: `src/contexts/CurrencyContext.js`
  - Provides helpers like `formatCurrency` and conversion utilities for multi‑currency pricing, used heavily in UI components and pages.

- **I18n**: `src/i18n/I18nProvider.js` + `src/i18n/locales/*.json`
  - Provides `useI18n()` with `t(key)`, locale‑aware number/currency/date formatting, and language metadata.
  - Updates `document.documentElement.lang`/`dir` and toggles `rtl`/`ltr` body classes.

- **Shared components**: `src/components/**`
  - Layout components (`AdminDashboardLayout`, `AgencyLayout`, `CustomerDashboardLayout`, `UserLayout`) encapsulate shared chrome for each role.
  - Reusable feature components for car search and booking (`VehicleSearchForm`, `CarBookingForm`, `TrendingVehicles`, `LocationAutocomplete`), chat (`Chat`, `ChatConversationList`, `ChatMessagesArea`), navigation/header/footer, modals (`LoginModal`, `SignupModal`), etc.
  - Many components bridge between the React app and the legacy jQuery‑driven theme (e.g. car cards styled via `public/html-folder/css`).

### Legacy assets and theme integration

- The legacy static theme lives under `public/html-folder/**` (HTML templates, CSS, JS, images, and flag assets).
- `src/app/layout.js` and several pages include these assets via `<link>` and `<script>` tags, and some components assume the presence of jQuery plugins (Owl Carousel, daterangepicker, Select2, etc.).
- When modifying UI, be aware that styling and behavior may be controlled both by React code and by these legacy scripts.

## Notes for future agents

- When adding new backend features, follow the existing pattern of **keeping SQL in `src/lib/db.js` / `src/lib/database.js` or in dedicated model classes**, and exposing behavior via `src/app/api/**/route.js`.
- For role‑aware features, respect the role/permission system defined in `src/lib/auth.js` and exposed in `AuthContext`.
- If you introduce automated tests, document their runner in `package.json` so new agents can execute them via a single npm script.