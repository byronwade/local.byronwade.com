-- Membership Billing & Renewals (Dunning)

create table if not exists membership_subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  customer_id uuid not null,
  plan_id uuid not null,
  status text not null default 'active', -- active | past_due | canceled
  current_period_start date,
  current_period_end date,
  renewal_method text not null default 'auto', -- auto | manual
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists membership_invoices (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references membership_subscriptions(id) on delete cascade,
  amount_due numeric(12,2) not null,
  due_date date not null,
  status text not null default 'open', -- open | paid | void | uncollectible
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists membership_dunning_events (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references membership_invoices(id) on delete cascade,
  attempt_number integer not null,
  event_type text not null, -- email | sms | call | retry
  event_time timestamptz not null default now(),
  outcome text,
  created_at timestamptz not null default now()
);

create index if not exists idx_membership_subscriptions_business on membership_subscriptions(business_id);
create index if not exists idx_membership_subscriptions_customer on membership_subscriptions(customer_id);
create index if not exists idx_membership_invoices_subscription on membership_invoices(subscription_id);
create index if not exists idx_membership_dunning_invoice on membership_dunning_events(invoice_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_membership_subscriptions_updated_at'
  ) then
    create trigger set_membership_subscriptions_updated_at before update on membership_subscriptions
    for each row execute procedure set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_membership_invoices_updated_at'
  ) then
    create trigger set_membership_invoices_updated_at before update on membership_invoices
    for each row execute procedure set_updated_at();
  end if;
end $$;


