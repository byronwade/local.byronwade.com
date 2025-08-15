-- CSR Console fundamentals: call logs and booking intents

create table if not exists csr_calls (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  customer_id uuid,
  direction text not null, -- inbound | outbound
  from_number text,
  to_number text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer,
  recording_url text,
  disposition text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists csr_booking_intents (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references csr_calls(id) on delete cascade,
  preferred_date date,
  preferred_time_range text,
  service_type text,
  location jsonb,
  notes text,
  status text not null default 'draft', -- draft | scheduled | abandoned
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_csr_calls_business on csr_calls(business_id);
create index if not exists idx_csr_calls_customer on csr_calls(customer_id);
create index if not exists idx_csr_booking_call on csr_booking_intents(call_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_csr_booking_intents_updated_at'
  ) then
    create trigger set_csr_booking_intents_updated_at before update on csr_booking_intents
    for each row execute procedure set_updated_at();
  end if;
end $$;


