-- ==============================================================================
-- Apna Wakil AI (اپنا وکیل) — Complete Database Schema & RLS Setup
-- Copy and paste this script directly into Supabase Dashboard -> SQL Editor -> Run
-- Dashboard URL: https://supabase.com/dashboard/project/fpmomynhaftfjgcnqneb/sql/new
-- ==============================================================================

-- 1. Enable pgvector extension for AI legal semantic search
create extension if not exists vector;

-- 2. Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  language text default 'en',
  created_at timestamptz default now()
);

-- Ensure required columns exist if profiles was previously created
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists language text default 'en';
alter table public.profiles add column if not exists created_at timestamptz default now();

-- 3. Conversations table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  category text,
  title text,
  created_at timestamptz default now()
);

-- 4. Messages table (stores chat history & grounded legal sources)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz default now()
);

-- 5. Legal Chunks table for RAG vector embeddings
create table if not exists public.legal_chunks (
  id bigserial primary key,
  law_name text not null,
  section text,
  categories text[] default '{}',
  content text not null,
  source_url text,
  embedding vector(768)
);

-- Create HNSW index for high performance vector cosine distance search
drop index if exists legal_chunks_embedding_idx;
create index legal_chunks_embedding_idx on public.legal_chunks using hnsw (embedding vector_cosine_ops);

-- 6. Rate limits table (per-user abuse protection)
create table if not exists public.rate_limits (
  user_id uuid not null,
  window_start timestamptz not null,
  count int default 1,
  primary key (user_id, window_start)
);

-- 7. Vector Similarity Search Function (match_legal_chunks)
create or replace function match_legal_chunks(
  query_embedding vector(768),
  match_count int,
  filter_category text default null
) returns table (
  id bigint,
  law_name text,
  section text,
  content text,
  source_url text,
  similarity float
)
language sql stable as $$
  select
    id,
    law_name,
    section,
    content,
    source_url,
    1 - (embedding <=> query_embedding) as similarity
  from public.legal_chunks
  where filter_category is null or filter_category = any(categories)
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- 8. Enable Row-Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.legal_chunks enable row level security;
alter table public.rate_limits enable row level security;

-- Drop existing policies if re-running script to avoid conflicts
drop policy if exists "own profile read" on public.profiles;
drop policy if exists "own profile update" on public.profiles;
drop policy if exists "own profile insert" on public.profiles;
drop policy if exists "own convos read" on public.conversations;
drop policy if exists "own convos insert" on public.conversations;
drop policy if exists "own convos delete" on public.conversations;
drop policy if exists "own msgs read" on public.messages;
drop policy if exists "own msgs insert" on public.messages;
drop policy if exists "auth read law" on public.legal_chunks;

-- Profiles RLS policies
create policy "own profile read"   on public.profiles for select using (id = auth.uid());
create policy "own profile update" on public.profiles for update using (id = auth.uid());
create policy "own profile insert" on public.profiles for insert with check (id = auth.uid());

-- Conversations RLS policies (Strict user isolation)
create policy "own convos read"   on public.conversations for select using (user_id = auth.uid());
create policy "own convos insert" on public.conversations for insert with check (user_id = auth.uid());
create policy "own convos delete" on public.conversations for delete using (user_id = auth.uid());

-- Messages RLS policies
create policy "own msgs read"   on public.messages for select using (user_id = auth.uid());
create policy "own msgs insert" on public.messages for insert with check (user_id = auth.uid());

-- Legal Chunks RLS: readable by authenticated users, service role manages writes
create policy "auth read law" on public.legal_chunks for select using (auth.role() = 'authenticated');

-- 9. Auto-create user profile trigger on signup
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, display_name, language)
  values (new.id, split_part(new.email, '@', 1), 'en')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
