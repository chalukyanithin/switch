-- ==============================================================================
-- SWITCH SOCIAL PLATFORM - INITIAL DATABASE SCHEMA
-- Migration: 0001_initial_schema.sql
-- Description: Core tables, RLS policies, triggers, and seed data for Switch.
-- Architecture: One account. One social graph. Multiple specialized worlds.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE
-- Stores public user identities linked 1:1 with Supabase auth.users.
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text default '',
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 30),
  constraint username_format check (username ~* '^[a-zA-Z0-9_.]+$')
);

-- Index for fast username queries
create index if not exists idx_profiles_username on public.profiles(username);

-- ==============================================================================
-- 3. WORLDS TABLE
-- Switch specialized interest worlds (Technology, Cricket, Meme).
-- ==============================================================================
create table if not exists public.worlds (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  icon text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_worlds_slug on public.worlds(slug);

-- Seed Switch Core Worlds
insert into public.worlds (name, slug, description, icon, is_active)
values
  (
    'Technology',
    'technology',
    'Editorial code discussions, live sandboxes & algorithmic mastery',
    'Code2',
    true
  ),
  (
    'Cricket',
    'cricket',
    'Professional cricket journalism, match tactics & live scorecards',
    'Trophy',
    true
  ),
  (
    'Meme',
    'meme',
    'Interactive meme templates, caption remixes & cultural banter',
    'Sparkles',
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  is_active = excluded.is_active;

-- ==============================================================================
-- 4. FOLLOWS TABLE (GLOBAL SOCIAL GRAPH)
-- Follow relationships are unified across all worlds.
-- ==============================================================================
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  constraint no_self_follow check (follower_id <> following_id),
  constraint unique_follow unique (follower_id, following_id)
);

create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

-- ==============================================================================
-- 5. POSTS TABLE
-- Multi-world post entity. Each post belongs to exactly one world and one author.
-- ==============================================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  world_id uuid references public.worlds(id) on delete cascade not null,
  content text not null,
  post_type text default 'standard' not null, -- 'standard' | 'tech' | 'meme' | 'cricket'
  is_edited boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_posts_world on public.posts(world_id, created_at desc);
create index if not exists idx_posts_user on public.posts(user_id, created_at desc);

-- ==============================================================================
-- 6. POST MEDIA TABLE
-- Media attachments (images, GIFs, video clips) linked to posts.
-- ==============================================================================
create table if not exists public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  media_url text not null,
  media_type text default 'image' not null, -- 'image' | 'video' | 'gif'
  display_order int default 0 not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_post_media_post on public.post_media(post_id);

-- ==============================================================================
-- 7. COMMENTS TABLE
-- Hierarchical comments supporting replies via parent_comment_id.
-- ==============================================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_comments_post on public.comments(post_id, created_at asc);
create index if not exists idx_comments_user on public.comments(user_id);
create index if not exists idx_comments_parent on public.comments(parent_comment_id);

-- ==============================================================================
-- 8. REACTIONS TABLE
-- High-intent emoji reactions (Dead, Certified Banger, Absolute Cinema, Upvotes, etc.).
-- ==============================================================================
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  reaction_type text not null, -- 'upvote' | 'downvote' | 'skull' | 'laugh' | 'clown' | 'cinema' | 'fire'
  created_at timestamptz default now() not null,
  constraint unique_user_post_reaction unique (user_id, post_id, reaction_type)
);

create index if not exists idx_reactions_post on public.reactions(post_id);
create index if not exists idx_reactions_user on public.reactions(user_id);

-- ==============================================================================
-- 9. BOOKMARKS TABLE
-- Private user bookmarks for saving posts across worlds.
-- ==============================================================================
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  constraint unique_user_post_bookmark unique (user_id, post_id)
);

create index if not exists idx_bookmarks_user on public.bookmarks(user_id, created_at desc);

-- ==============================================================================
-- 10. NOTIFICATIONS TABLE
-- Real-time notification inbox for interactions, follows, and mentions.
-- ==============================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) on delete cascade not null,
  notification_type text not null, -- 'follow' | 'reaction' | 'comment' | 'mention'
  reference_id uuid,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_notifications_recipient on public.notifications(recipient_id, is_read, created_at desc);

-- ==============================================================================
-- 11. AUTOMATIC PROFILE CREATION TRIGGER
-- Triggers when a new user signs up in auth.users.
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_username text;
  raw_display text;
  raw_avatar text;
  cleaned_username text;
begin
  raw_username := new.raw_user_meta_data->>'username';
  raw_display  := coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name', raw_username);
  raw_avatar   := new.raw_user_meta_data->>'avatar_url';

  -- Fallback if username not provided in metadata: derive from email
  if raw_username is null or trim(raw_username) = '' then
    cleaned_username := split_part(new.email, '@', 1);
  else
    cleaned_username := regexp_replace(raw_username, '[^a-zA-Z0-9_.]', '', 'g');
  end if;

  -- Ensure minimum username length
  if char_length(cleaned_username) < 3 then
    cleaned_username := cleaned_username || '_' || substr(new.id::text, 1, 4);
  end if;

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    cleaned_username,
    coalesce(raw_display, cleaned_username),
    raw_avatar
  )
  on conflict (id) do update set
    username = excluded.username,
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

-- Drop trigger if exists then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_timestamp on public.profiles;
create trigger update_profiles_timestamp
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists update_posts_timestamp on public.posts;
create trigger update_posts_timestamp
  before update on public.posts
  for each row execute function public.handle_updated_at();

drop trigger if exists update_comments_timestamp on public.comments;
create trigger update_comments_timestamp
  before update on public.comments
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict security on every public table.
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.worlds enable row level security;
alter table public.follows enable row level security;
alter table public.posts enable row level security;
alter table public.post_media enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notifications enable row level security;

-- PROFILES
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- WORLDS
create policy "Worlds are readable by everyone"
  on public.worlds for select
  using (is_active = true);

-- FOLLOWS
create policy "Follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Users can follow others"
  on public.follows for insert
  with check (auth.uid() = follower_id and follower_id <> following_id);

create policy "Users can unfollow others"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- POSTS
create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Users can create posts under their own identity"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- POST MEDIA
create policy "Post media is viewable by everyone"
  on public.post_media for select
  using (true);

create policy "Users can add media to their own posts"
  on public.post_media for insert
  with check (
    exists (
      select 1 from public.posts
      where posts.id = post_media.post_id
      and posts.user_id = auth.uid()
    )
  );

create policy "Users can delete media from their own posts"
  on public.post_media for delete
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_media.post_id
      and posts.user_id = auth.uid()
    )
  );

-- COMMENTS
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Users can create comments under their own identity"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- REACTIONS
create policy "Reactions are viewable by everyone"
  on public.reactions for select
  using (true);

create policy "Users can create their own reactions"
  on public.reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own reactions"
  on public.reactions for delete
  using (auth.uid() = user_id);

-- BOOKMARKS
create policy "Users can view only their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can add bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can remove bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- NOTIFICATIONS
create policy "Users can view only their own received notifications"
  on public.notifications for select
  using (auth.uid() = recipient_id);

create policy "Users can mark their own notifications as read"
  on public.notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = recipient_id);

create policy "Authenticated users can create notifications"
  on public.notifications for insert
  with check (auth.uid() = actor_id);

-- ==============================================================================
-- 13. STORAGE BUCKETS SETUP
-- ==============================================================================
-- Create 'avatars' and 'posts' storage buckets if they do not exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('posts', 'posts', true)
on conflict (id) do nothing;

-- Storage policies:
-- Anyone can view avatars and post attachments
create policy "Avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Posts media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'posts');

create policy "Authenticated users can upload post media"
  on storage.objects for insert
  with check (
    bucket_id = 'posts'
    and auth.role() = 'authenticated'
  );

