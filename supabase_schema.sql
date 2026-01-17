-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table (Users)
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  role text check (role in ('citizen', 'authority')) not null,
  full_name text,
  auth_id text unique, -- Can link to Supabase Auth User ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Issues Table
create table if not exists issues (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category text not null, -- 'road_infrastructure', 'waste_sanitation', etc.
  location text,          -- Text address for now
  lat float,              -- Latitude (for map)
  lng float,              -- Longitude (for map)
  status text default 'submitted' check (status in ('submitted', 'in_progress', 'resolved', 'rejected')),
  severity int default 50,
  photo_url text,
  upvotes int default 0,
  user_id uuid references profiles(id), -- Reporter
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Comments Table
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  issue_id uuid references issues(id) on delete cascade not null,
  user_id uuid references profiles(id),
  user_name text, -- Cache name for display
  user_role text, -- 'Citizen' or 'Official'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table issues enable row level security;
alter table comments enable row level security;

-- Policies (Permissive for Development)
create policy "Public access" on profiles for select using (true);
create policy "Public access" on issues for select using (true);
create policy "Public insert" on issues for insert with check (true);
create policy "Public update" on issues for update using (true); 
create policy "Public access" on comments for select using (true);
create policy "Public insert" on comments for insert with check (true);

-- 5. STORAGE SETUP (For Photo Uploads)
-- Create a public bucket named 'evidence'
insert into storage.buckets (id, name, public) 
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

-- Storage Policies (Allow public access and uploads)
create policy "Evidence is publicly accessible" on storage.objects 
  for select using ( bucket_id = 'evidence' );
  
create policy "Anyone can upload evidence" on storage.objects 
  for insert with check ( bucket_id = 'evidence' );

-- Indexes
create index if not exists idx_issues_status on issues(status);
create index if not exists idx_issues_category on issues(category);
