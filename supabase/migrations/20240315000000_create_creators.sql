-- Create creators table
create table if not exists public.creators (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  username text unique not null,
  platform text not null,
  followers bigint not null,
  avatar text,
  verified boolean default false,
  description text,
  categories text[],
  social_links jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.creators enable row level security;

create policy "Allow public read access"
  on public.creators for select
  using (true);

-- Create indexes
create index if not exists creators_platform_idx on public.creators(platform);
create index if not exists creators_followers_idx on public.creators(followers desc);
create index if not exists creators_username_idx on public.creators(username);