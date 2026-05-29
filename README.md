# 🎓 CampusLens — College Discovery Platform

> **Discover. Compare. Decide.**

A production-grade college discovery and decision-making platform built as a Full Stack Engineer internship submission (Track B). CampusLens enables students to explore 150+ colleges across India, compare them side-by-side, predict admission chances, and save favorites — all powered by a modern, scalable tech stack.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🔍 College Listing + Search
- Full-text search with debounced input
- Multi-criteria filtering (state, city, fees, rating, ownership, NAAC grade)
- Sorting by rating, fees, placements, name
- Cursor-based infinite scroll pagination
- Responsive card grid with skeleton loading
- Server-side filtering via optimized Prisma queries

### 📋 College Detail Page
- Dynamic route (`/college/[slug]`) with SEO-friendly URLs
- Hero banner with rating, location, and quick actions
- Tabbed content: Overview, Courses, Placements, Reviews, Gallery
- Placement charts with Recharts (bar chart, rating breakdown)
- Related colleges from the same state
- Sticky action bar (save, compare, visit website)

### ⚖️ Compare Colleges
- Compare 2-3 colleges side-by-side
- Visual comparison charts (Recharts bar chart)
- Detailed comparison table with best-value highlighting
- Facilities checklist comparison
- Add/remove colleges from any page

### 🧠 College Predictor
- Smart recommendation engine using cutoff data
- Input: exam, rank, category, branch, state preference
- Weighted scoring algorithm with state quota boost
- Results categorized: Safe / Moderate / Dream
- Admission chance percentage for each college
- Supports JEE Main, JEE Advanced, CUET, AKTU, NEET, and more

### 🔐 Authentication + Saved Items
- Clerk authentication (sign up, sign in, sign out)
- Protected routes via middleware
- Save/bookmark colleges with database persistence
- Saved colleges dashboard with remove functionality
- Graceful login prompts for unauthenticated users

### 🌗 Additional
- Dark mode toggle (system/light/dark)
- Custom 404 page
- Global error boundary
- Toast notifications (Sonner)
- SEO metadata + Open Graph tags
- Responsive design (mobile/tablet/desktop)
- Skeleton loading states everywhere
- Empty state components

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | TailwindCSS + ShadCN UI |
| **Database** | PostgreSQL (Neon) + Prisma ORM |
| **Auth** | Clerk |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Validation** | Zod |
| **Forms** | React Hook Form + Zod Resolver |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth pages (sign-in, sign-up)
│   ├── (main)/                    # Main layout (navbar + footer)
│   │   ├── page.tsx               # Home / Landing
│   │   ├── colleges/page.tsx      # College listing
│   │   ├── college/[slug]/page.tsx # College detail
│   │   ├── compare/page.tsx       # Compare colleges
│   │   ├── predictor/page.tsx     # College predictor
│   │   ├── saved/page.tsx         # Saved colleges
│   │   └── profile/page.tsx       # User profile
│   ├── api/                       # REST API routes
│   │   ├── colleges/              # GET listing + detail
│   │   ├── compare/               # GET comparison
│   │   ├── predictor/             # POST predictions
│   │   ├── saved/                 # CRUD saved colleges
│   │   └── reviews/               # GET reviews
│   ├── layout.tsx                 # Root layout
│   ├── not-found.tsx              # 404 page
│   └── error.tsx                  # Error boundary
├── components/
│   ├── ui/                        # ShadCN primitives
│   ├── shared/                    # Navbar, Footer, etc.
│   └── college/                   # College-specific components
├── hooks/                         # TanStack Query hooks
├── store/                         # Zustand stores
├── providers/                     # Query + Theme providers
├── lib/                           # Utilities, Prisma client
├── types/                         # TypeScript types
└── validators/                    # Zod schemas
```

---

## 🗄️ Database Schema

```
College ──┬── Course (1:N)
          ├── PlacementStats (1:1)
          ├── Review (1:N)
          ├── SavedCollege (1:N)
          └── CutoffData (1:N)
```

- **6 Models**: College, Course, PlacementStats, Review, SavedCollege, CutoffData
- **4 Enums**: OwnershipType, NAACGrade, ExamType, Category
- **Optimized indexes** on frequently filtered columns
- **Cascade deletes** for data integrity

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL database (Neon recommended)
- Clerk account

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd campus-lens
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string from Neon
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — From Clerk dashboard
- `CLERK_SECRET_KEY` — From Clerk dashboard

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with 150+ colleges
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/colleges` | No | Search + filter + paginate colleges |
| GET | `/api/colleges/[slug]` | No | Get college detail by slug |
| GET | `/api/compare?ids=a,b,c` | No | Compare 2-3 colleges |
| POST | `/api/predictor` | No | Get college predictions |
| GET | `/api/saved` | Yes | Get user's saved colleges |
| POST | `/api/saved` | Yes | Save a college |
| DELETE | `/api/saved?collegeId=x` | Yes | Remove saved college |
| GET | `/api/reviews?collegeId=x` | No | Get college reviews |

All endpoints return consistent `ApiResponse<T>` format with proper error codes.

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js
5. Run database seed via Vercel CLI or locally pointing to production DB

```bash
# Build locally to verify
npm run build
```

---

## 🏛️ Architecture Decisions

- **Cursor-based pagination** over offset — better performance at scale for infinite scroll
- **No User model** — Clerk handles user management; we store Clerk user IDs as foreign keys
- **CutoffData model** — enables the predictor tool with real exam/category/branch cutoff matching
- **Zustand for client state** — lightweight, no boilerplate, persists compare list to localStorage
- **TanStack Query for server state** — automatic caching, invalidation, infinite queries
- **ShadCN UI** — composable, unstyled primitives that we control via Tailwind
- **Server Components + Client Components** — optimal code splitting, SSR where possible

---

## 📊 Performance Optimizations

- Debounced search (300ms) to reduce API calls
- Cursor-based pagination for O(1) page fetching
- Image optimization with Next/Image and Unsplash CDN
- TanStack Query caching (5min staleTime)
- Dynamic imports for heavy components
- Prisma query optimization with selective `select` and `include`
- Indexes on all filterable columns

---

## 📝 License

MIT

---

Built with ❤️ for the AI Software Engineer Internship — Track B (Full Stack Engineer)
