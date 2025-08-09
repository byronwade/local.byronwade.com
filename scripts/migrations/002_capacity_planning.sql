-- Capacity Planning core tables
-- Safe to run multiple times

create table if not exists capacity_plans (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  name text not null,
  start_date date not null,
  end_date date not null,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists capacity_shifts (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references capacity_plans(id) on delete cascade,
  team_id uuid,
  technician_id uuid,
  role text,
  shift_date date not null,
  start_time time not null,
  end_time time not null,
  capacity_units integer not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists time_off_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  user_id uuid not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending', -- pending | approved | rejected
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_capacity_plans_business on capacity_plans(business_id);
create index if not exists idx_capacity_shifts_plan on capacity_shifts(plan_id);
create index if not exists idx_time_off_requests_business on time_off_requests(business_id);
create index if not exists idx_time_off_requests_user on time_off_requests(user_id);

-- updated_at triggers
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_capacity_plans_updated_at'
  ) then
    create trigger set_capacity_plans_updated_at before update on capacity_plans
    for each row execute procedure set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_capacity_shifts_updated_at'
  ) then
    create trigger set_capacity_shifts_updated_at before update on capacity_shifts
    for each row execute procedure set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_time_off_requests_updated_at'
  ) then
    create trigger set_time_off_requests_updated_at before update on time_off_requests
    for each row execute procedure set_updated_at();
  end if;
end $$;


