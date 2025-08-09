-- Proposals / Options (Good-Better-Best)

create table if not exists estimate_proposals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  estimate_id uuid,
  title text not null,
  description text,
  status text not null default 'draft', -- draft | sent | accepted | declined
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists estimate_proposal_options (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references estimate_proposals(id) on delete cascade,
  tier text not null, -- good | better | best
  name text not null,
  summary text,
  total_amount numeric(12,2) not null default 0,
  items jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_estimate_proposals_business on estimate_proposals(business_id);
create index if not exists idx_estimate_proposals_estimate on estimate_proposals(estimate_id);
create index if not exists idx_estimate_proposal_options_proposal on estimate_proposal_options(proposal_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_estimate_proposals_updated_at'
  ) then
    create trigger set_estimate_proposals_updated_at before update on estimate_proposals
    for each row execute procedure set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'set_estimate_proposal_options_updated_at'
  ) then
    create trigger set_estimate_proposal_options_updated_at before update on estimate_proposal_options
    for each row execute procedure set_updated_at();
  end if;
end $$;


