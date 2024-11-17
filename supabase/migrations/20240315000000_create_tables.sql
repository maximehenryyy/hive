-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create creators table
create table if not exists public.creators (
  id uuid default uuid_generate_v4() primary key,
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

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.creators enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Creators policies
create policy "Creators are viewable by everyone"
  on creators for select
  using (true);

-- Create indexes
create index if not exists creators_platform_idx on creators(platform);
create index if not exists creators_followers_idx on creators(followers desc);
create index if not exists creators_username_idx on creators(username);