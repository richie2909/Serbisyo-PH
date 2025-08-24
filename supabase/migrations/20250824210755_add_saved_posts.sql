-- ========================================
-- Posts table
-- ========================================
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  image_url text,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- Enable Row Level Security
alter table posts enable row level security;

-- Policy: anyone can view posts
create policy "Anyone can view posts"
  on posts for select
  using (true);

-- ========================================
-- Saved Posts table (connects user to posts)
-- ========================================
create table if not exists saved_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id) -- prevent duplicate saves
);

-- Enable Row Level Security
alter table saved_posts enable row level security;

-- Policies for saved_posts
create policy "Users can view their own saved posts"
  on saved_posts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved posts"
  on saved_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own saved posts"
  on saved_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own saved posts"
  on saved_posts for delete
  using (auth.uid() = user_id);

-- ========================================
-- Optional view: user_saved_posts
-- Easier frontend queries
-- ========================================
create or replace view user_saved_posts as
select 
  s.user_id,
  p.*
from saved_posts s
join posts p on p.id = s.post_id;
