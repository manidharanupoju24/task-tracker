# Task Tracker

A clean, minimal todo list app built with **Next.js 14**, **TypeScript**, and **Tailwind CSS** — backed by a FastAPI REST API and Supabase for auth and database.

## Features

- **Authentication** — sign up and sign in with email/password via Supabase Auth
- **Create tasks** with priority (low / medium / high), category, and an optional due date
- **Complete, edit, and delete** tasks — double-click any task to edit inline
- **Filter** by status (all / active / completed) and by category
- **Sort** by newest, priority, or due date
- **Overdue warnings** on tasks past their due date
- **Progress bar** showing overall completion percentage
- **Persists across sessions** — all data stored in Supabase via the backend API

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth (JWT Bearer tokens) |
| Storage | Supabase PostgreSQL via FastAPI backend |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- The [task-tracker-api](../task-tracker-api) backend running on `http://localhost:8000`

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.local.example .env.local
# Fill in your Supabase credentials and API URL

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:8000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### Other Commands

```bash
npm run build   # Build for production
npm run start   # Start the production server
npm run lint    # Run ESLint
```

## Project Structure

```
app/
├── components/
│   ├── AuthForm.tsx      # Sign in / sign up form
│   ├── AddTodoForm.tsx   # Create new task form
│   ├── TodoItem.tsx      # Individual task row with edit/delete
│   ├── FilterBar.tsx     # Status and category filters
│   └── StatsBar.tsx      # Completion progress bar
├── types.ts              # Shared TypeScript types
├── page.tsx              # Main app page
└── layout.tsx            # Root layout
lib/
└── api.ts                # API client (auth, todos CRUD, token management)
```
