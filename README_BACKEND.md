# Switch — Backend Architecture & Supabase Implementation Guide

## 1. Product & Architecture Overview

**Switch** is a multi-domain social discovery platform structured around three core interest worlds:
- **Technology World** (`/world/tech`) — Code discussions, sandboxes, quizzes, and algorithmic deep dives.
- **Cricket World** (`/world/cricket`) — Match commentary, tactic reviews, simulated games, and dugout audio discussions.
- **Meme World** (`/world/meme`) — Meme feeds, templates, creator battles, and reaction rankings.

### Core Principle: One Account. One Social Graph. Multiple Specialized Worlds.
Users create **one single Switch account**. That identity, their social graph (followers and following), notifications, and bookmarks are shared globally across the platform. While each world provides its own specialized experience, components, and feeds, profiles and authentication remain unified.

---

## 2. Technology Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Database**: PostgreSQL (hosted via Supabase)
- **Auth**: Supabase Auth with Cookie Sessions via `@supabase/ssr`
- **Storage**: Supabase Storage (`avatars` and `posts` buckets)
- **Security**: Row Level Security (RLS) enabled across 100% of public tables
- **Design System**: Switch design system (Tailwind v4 with light `#ffffff` & dark `#192538` elevated floating cards)

---

## 3. Directory & Folder Structure

```text
switch-frontend/
├── app/
│   ├── (root)/
│   │   ├── create/               # Create post screen (Protected Route)
│   │   ├── explore/              # World discovery portals
│   │   ├── profile/              # User profile & account management
│   │   └── world/[id]/           # Specialized world feeds (Tech, Cricket, Meme)
│   ├── login/                    # Supabase Auth Login Screen
│   ├── signup/                   # Supabase Auth Registration Screen
│   ├── globals.css               # Design tokens, light & dark mode elevation system
│   └── layout.tsx                # App root layout with AuthProvider & layout shell
├── components/
│   ├── AuthProvider.tsx          # Real-time Supabase auth state context & hooks
│   ├── ui/                       # Reusable UI components (SideBar, Profile, Cards)
│   └── worlds/                   # World-specific presentation cards (Meme, Tech, Cricket)
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser-side Supabase client (@supabase/ssr)
│   │   ├── server.ts             # Server-side Supabase client (@supabase/ssr)
│   │   └── middleware.ts         # Middleware session refresh helper
│   ├── services/
│   │   ├── auth.service.ts       # Registration, login, session validation & signout
│   │   ├── profile.service.ts    # Profiles query, update & storage avatar uploads
│   │   ├── worlds.service.ts     # Worlds metadata & discovery queries
│   │   ├── posts.service.ts      # Multi-world post creation & feed queries
│   │   └── social.service.ts     # Follows, reactions, bookmarks & comments
│   └── actions/
│       ├── user.actions.ts       # Server actions for profile updates & follow toggling
│       └── thought.actions.ts    # Server actions for posts, likes & comments
├── middleware.ts                 # Next.js root middleware for session sync & route guarding
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql # PostgreSQL schema, RLS policies, triggers & seeds
├── types/
│   └── database.ts               # Complete TypeScript database schema definitions
├── .env.example                  # Environment configuration template
└── README_BACKEND.md             # This architecture documentation
```

---

## 4. Database Schema & Security (PostgreSQL)

The database schema is defined in `supabase/migrations/0001_initial_schema.sql`:

1. **`profiles`**:
   - `id` (UUID, references `auth.users(id)` on delete cascade)
   - `username` (Text, Unique, 3-30 chars, alphanumeric with `_` and `.`)
   - `display_name` (Text)
   - `bio` (Text)
   - `avatar_url` (Text)
   - `created_at`, `updated_at` (Timestamptz)
   - Automatically seeded via the `handle_new_user()` trigger on `auth.users` insert.

2. **`worlds`**:
   - `id` (UUID, primary key)
   - `name` (Text, Unique)
   - `slug` (Text, Unique) — seeded with `technology`, `cricket`, `meme`
   - `description`, `icon`, `is_active`

3. **`follows`**:
   - `id` (UUID, primary key)
   - `follower_id`, `following_id` (UUID references `profiles.id`)
   - Constraints: `follower_id <> following_id`, `unique(follower_id, following_id)`

4. **`posts`**:
   - `id` (UUID, primary key)
   - `user_id` (UUID references `profiles.id`)
   - `world_id` (UUID references `worlds.id`)
   - `content` (Text), `post_type` (Text), `is_edited` (Boolean)

5. **`post_media`**:
   - Media attachments (`media_url`, `media_type`, `display_order`)

6. **`comments`**:
   - Hierarchical replies via `parent_comment_id`

7. **`reactions`**:
   - Multi-reaction types (`upvote`, `skull`, `laugh`, `clown`, `cinema`, `fire`) with unique constraint per `(user_id, post_id, reaction_type)`

8. **`bookmarks`**:
   - Private user bookmarks unique per `(user_id, post_id)`

9. **`notifications`**:
   - Realtime notification inbox for follows, reactions, and comments

### Row Level Security (RLS) Policies
- Every table has RLS enabled.
- Users can modify **only their own** profile (`auth.uid() = id`).
- Users can create and delete **only their own** posts, comments, reactions, and bookmarks.
- Users can read only their own bookmarks and private notifications.
- Verified server sessions (`auth.uid()`) are required for all mutations; user IDs supplied in payloads are never trusted blind.

---

## 5. Supabase Setup Instructions

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and name it `switch-social`.
3. Choose your closest region and set a database password.

### Step 2: Run Database Migrations
1. In the Supabase Dashboard, navigate to **SQL Editor** in the left sidebar.
2. Open the file `supabase/migrations/0001_initial_schema.sql` from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. All tables, foreign keys, triggers, RLS policies, storage buckets (`avatars`, `posts`), and seed records will be created.

### Step 3: Configure Environment Variables
1. In your Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy the **Project URL** and the **anon public API Key**.
3. Create or update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
   ```

### Step 4: Configure Google OAuth (Optional / Recommended)
1. Go to the [Google Cloud Console](https://console.cloud.google.com) and create an **OAuth 2.0 Client ID** (Web application).
2. Set the **Authorized redirect URI** to your Supabase project callback URL:
   ```text
   https://<your-project-id>.supabase.co/auth/v1/callback
   ```
   *(For example: `https://flytukovrseqjuhmvnvo.supabase.co/auth/v1/callback`)*
3. In your **Supabase Dashboard**, go to **Authentication** -> **Providers** -> **Google**.
4. Enable the Google provider, paste your **Google Client ID** and **Google Client Secret**, and click **Save**.
5. Under **Authentication** -> **URL Configuration**, ensure your site URL is set to `http://localhost:3000` (and add `http://localhost:3000/**` to Redirect URLs for local development).
6. Google Sign-In is now live on both `/login` and `/signup`!

---

## 6. How to Run & Test Authentication

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing Signup:
1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup).
2. Enter:
   - **Username**: e.g., `alex_dev`
   - **Display Name**: e.g., `Alex Miller`
   - **Email Address**: `alex@example.com`
   - **Password**: `securePass123`
   - **Confirm Password**: `securePass123`
3. Click **Join Switch**.
4. The system validates fields, registers with Supabase Auth, and the PostgreSQL trigger automatically provisions the user profile in `public.profiles`.

### Testing Login & Route Protection:
1. Navigate to [http://localhost:3000/login](http://localhost:3000/login).
2. Enter your credentials or click a sandbox demo credential button.
3. Click **Sign In**.
4. Upon authentication, a persistent cookie session is established via `@supabase/ssr`.
5. Try navigating directly to `/create` while logged out to verify that `middleware.ts` intercepts and redirects unauthenticated requests to `/login?redirect=/create`.

### Testing Profile & Avatar Upload:
1. Navigate to [http://localhost:3000/profile](http://localhost:3000/profile).
2. Click **Edit Profile** to change display name, bio, or verify username uniqueness.
3. Click the avatar camera icon to choose a preset or click **Select Image from Computer** to upload a custom JPG/PNG file directly to the Supabase `avatars` storage bucket.
4. Changes update in real-time across all Switch worlds.

