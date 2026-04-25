create extension if not exists "pgcrypto";

create type public.story_status as enum ('draft', 'active', 'published', 'archived');
create type public.story_visibility as enum ('private', 'public');
create type public.message_kind as enum ('narration', 'character', 'user', 'system');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'unpaid');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Автор Rolea',
  avatar_url text,
  level integer not null default 1,
  xp integer not null default 0,
  content_rating text not null default '16+',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  genre text not null,
  format text not null,
  summary text,
  status public.story_status not null default 'draft',
  visibility public.story_visibility not null default 'private',
  progress integer not null default 0 check (progress between 0 and 100),
  chapter integer not null default 1,
  cover_url text,
  safety_rating text not null default '16+',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.worlds (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  name text not null,
  description text not null,
  rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  world_id uuid not null references public.worlds(id) on delete cascade,
  name text not null,
  description text not null,
  mood text,
  created_at timestamptz not null default now()
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  name text not null,
  role text not null,
  description text,
  traits text[] not null default '{}',
  is_user_character boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.story_members (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  unique (story_id, user_id)
);

create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  title text not null,
  summary text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  scene_id uuid references public.scenes(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  character_id uuid references public.characters(id) on delete set null,
  kind public.message_kind not null,
  author_name text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.ai_generation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  story_id uuid references public.stories(id) on delete cascade,
  purpose text not null,
  model text not null,
  prompt_tokens integer,
  output_tokens integer,
  safety_result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status public.subscription_status not null default 'incomplete',
  plan_key text not null default 'free',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  event_type text not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  story_id uuid references public.stories(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.worlds enable row level security;
alter table public.locations enable row level security;
alter table public.characters enable row level security;
alter table public.story_members enable row level security;
alter table public.scenes enable row level security;
alter table public.messages enable row level security;
alter table public.ai_generation_logs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events enable row level security;
alter table public.reports enable row level security;

create policy "profiles own read" on public.profiles for select using (id = auth.uid());
create policy "profiles own update" on public.profiles for update using (id = auth.uid());
create policy "profiles own insert" on public.profiles for insert with check (id = auth.uid());

create policy "stories owner read or public" on public.stories
  for select using (owner_id = auth.uid() or visibility = 'public');
create policy "stories owner write" on public.stories
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "worlds story access" on public.worlds for select using (
  exists (select 1 from public.stories s where s.id = story_id and (s.owner_id = auth.uid() or s.visibility = 'public'))
);
create policy "worlds owner write" on public.worlds for all using (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
) with check (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
);

create policy "locations story access" on public.locations for select using (
  exists (
    select 1 from public.worlds w
    join public.stories s on s.id = w.story_id
    where w.id = world_id and (s.owner_id = auth.uid() or s.visibility = 'public')
  )
);
create policy "locations owner write" on public.locations for all using (
  exists (
    select 1 from public.worlds w
    join public.stories s on s.id = w.story_id
    where w.id = world_id and s.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.worlds w
    join public.stories s on s.id = w.story_id
    where w.id = world_id and s.owner_id = auth.uid()
  )
);

create policy "characters story access" on public.characters for select using (
  exists (select 1 from public.stories s where s.id = story_id and (s.owner_id = auth.uid() or s.visibility = 'public'))
);
create policy "characters owner write" on public.characters for all using (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
) with check (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
);

create policy "story members own access" on public.story_members for select using (user_id = auth.uid());
create policy "story members owner write" on public.story_members for all using (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
) with check (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
);

create policy "scenes story access" on public.scenes for select using (
  exists (select 1 from public.stories s where s.id = story_id and (s.owner_id = auth.uid() or s.visibility = 'public'))
);
create policy "scenes owner write" on public.scenes for all using (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
) with check (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
);

create policy "messages story access" on public.messages for select using (
  exists (select 1 from public.stories s where s.id = story_id and (s.owner_id = auth.uid() or s.visibility = 'public'))
);
create policy "messages owner write" on public.messages for all using (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
) with check (
  exists (select 1 from public.stories s where s.id = story_id and s.owner_id = auth.uid())
);

create policy "ai logs own access" on public.ai_generation_logs for select using (user_id = auth.uid());
create policy "ai logs own insert" on public.ai_generation_logs for insert with check (user_id = auth.uid());

create policy "subscriptions own access" on public.subscriptions for select using (user_id = auth.uid());
create policy "usage own access" on public.usage_events for select using (user_id = auth.uid());
create policy "usage own insert" on public.usage_events for insert with check (user_id = auth.uid());

create policy "reports own insert" on public.reports for insert with check (reporter_id = auth.uid());
create policy "reports own read" on public.reports for select using (reporter_id = auth.uid());
