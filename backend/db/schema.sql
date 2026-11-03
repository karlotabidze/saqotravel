-- Persistent Google data: place_id only.
-- Region/city/village/category are Saqo-owned fields and must be entered/confirmed
-- by Saqo staff; do not populate them by copying Google Places content.
create table if not exists public.hotel_places (
  place_id text primary key,
  region_override text,
  city_override text,
  village_override text,
  category_override text check (
    category_override is null or category_override in
    ('hotel','hostel','guest_house','cottage','apartment','resort','other')
  ),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.places_sync_jobs (
  id bigserial primary key,
  status text not null check (status in ('running','completed','failed')),
  cursor_json jsonb not null default '{}'::jsonb,
  discovered_count integer not null default 0,
  last_error text,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists hotel_places_visible_idx
  on public.hotel_places (is_hidden, created_at desc);
