-- Proposta de migration: avyro_prospecting_v1
-- Destino a confirmar pelo MCP: mwrtluebbiyrmjrqwhut.
-- Não executada por Codex. Aplicar uma única vez via migration do Supabase.
-- Se qualquer objeto abaixo já existir, inspecionar antes; não apagar/recriar.
begin;

create table public.prospecting_leads (
  id uuid primary key default gen_random_uuid(),
  company varchar(200) not null check (char_length(btrim(company)) >= 2),
  person varchar(200) not null default '',
  city varchar(200) not null check (char_length(btrim(city)) >= 2),
  segment varchar(200) not null check (char_length(btrim(segment)) >= 2),
  source varchar(200) not null default 'Google Maps',
  maps varchar(2000) not null default '' check (maps = '' or maps ~* '^https?://'),
  instagram varchar(2000) not null default '' check (instagram = '' or instagram ~* '^https?://'),
  website varchar(2000) not null default '' check (website = '' or website ~* '^https?://'),
  phone varchar(50) not null default '',
  email varchar(254) not null default '',
  website_status text not null default 'Não verificado'
    check (website_status in ('Não verificado', 'Sem site', 'Só Instagram', 'Site antigo ou ruim', 'Site adequado')),
  activity text not null default 'Não verificada'
    check (activity in ('Não verificada', 'Ativo', 'Aparentemente abandonado')),
  good_reviews boolean not null default false,
  recent_photos boolean not null default false,
  professional boolean not null default false,
  rating numeric(2,1) check (rating between 0 and 5),
  review_count integer check (review_count >= 0),
  heat_override text not null default '' check (heat_override in ('', 'Quente', 'Morno', 'Revisar', 'Descartar')),
  opportunity varchar(4000) not null default '',
  personalization varchar(2000) not null default '',
  stage text not null default 'Selecionado'
    check (stage in ('Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar')),
  next_action varchar(500) not null default '',
  follow_up date,
  notes varchar(6000) not null default '',
  proposal_value numeric(12,2) not null default 0 check (proposal_value between 0 and 100000000),
  monthly_value numeric(12,2) not null default 0 check (monthly_value between 0 and 100000000),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prospecting_interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.prospecting_leads(id) on delete restrict,
  date date not null,
  channel text not null check (channel in ('WhatsApp', 'Instagram', 'E-mail', 'Telefone', 'Presencial')),
  stage text not null check (stage in ('Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar')),
  note varchar(4000) not null check (char_length(btrim(note)) >= 1),
  created_at timestamptz not null default now()
);

-- Painel de um único operador nesta fase: configurações singleton, sem associação
-- artificial aos perfis do produto Link-in-Bio. Não representa multiusuário.
create table public.prospecting_settings (
  singleton boolean primary key default true check (singleton),
  target integer not null default 30 check (target between 1 and 100000),
  budget numeric(12,2) not null default 0 check (budget between 0 and 10000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.prospecting_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

create trigger prospecting_leads_touch_updated_at
before update on public.prospecting_leads
for each row execute function public.prospecting_touch_updated_at();

create trigger prospecting_settings_touch_updated_at
before update on public.prospecting_settings
for each row execute function public.prospecting_touch_updated_at();

create index prospecting_leads_city_segment_idx on public.prospecting_leads (city, segment);
create index prospecting_leads_stage_idx on public.prospecting_leads (stage, archived);
create index prospecting_leads_follow_up_idx on public.prospecting_leads (follow_up)
where archived = false and stage not in ('Fechado', 'Sem interesse', 'Não contatar');
create index prospecting_interactions_lead_date_idx on public.prospecting_interactions (lead_id, date desc, created_at desc);

alter table public.prospecting_leads enable row level security;
alter table public.prospecting_interactions enable row level security;
alter table public.prospecting_settings enable row level security;

-- Nenhuma policy permissiva: clientes anônimos e contas existentes do Link-in-Bio
-- não recebem acesso ao CRM. O backend futuro deverá ter controle de acesso próprio.
revoke all privileges on table public.prospecting_leads, public.prospecting_interactions, public.prospecting_settings from public, anon, authenticated;
grant select, insert, update, delete on table public.prospecting_leads, public.prospecting_interactions, public.prospecting_settings to service_role;
revoke all privileges on function public.prospecting_touch_updated_at() from public, anon, authenticated;
grant execute on function public.prospecting_touch_updated_at() to service_role;

insert into public.prospecting_settings (singleton, target, budget) values (true, 30, 0);

comment on table public.prospecting_leads is 'CRM interno Avyro. Acesso público bloqueado; não conectado ao painel local nesta migration.';
comment on table public.prospecting_interactions is 'Histórico manual de contatos. Cada empresa conta uma vez nas métricas; uma linha não é uma nova empresa.';
comment on column public.prospecting_leads.heat_override is 'String vazia usa a classificação calculada pela aplicação; não é previsão de conversão.';
comment on column public.prospecting_leads.monthly_value is 'Valor mensal informado para manutenção, separado do valor do projeto; não confirma recebimento.';

commit;
