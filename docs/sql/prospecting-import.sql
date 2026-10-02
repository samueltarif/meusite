-- Executar antes de publicar a importação JSON/Excel. Não importa nem exclui dados por si só.
-- Requer as tabelas de prospecção já existentes.
begin;
alter table public.prospecting_leads add column if not exists additional_phones jsonb not null default '[]'::jsonb;
alter table public.prospecting_leads add column if not exists contact_status text;
alter table public.prospecting_leads add column if not exists contact_time text;
alter table public.prospecting_interactions add column if not exists contact_status text;
alter table public.prospecting_interactions add column if not exists contact_time text;
alter table public.prospecting_leads add column if not exists imported_at timestamptz;
create or replace function public.prospecting_identity_value(p_kind text, p_value text)
returns text language plpgsql immutable security invoker set search_path = '' as $$
declare v text := lower(btrim(coalesce(p_value, '')));
begin
  if p_kind = 'phone' then
    v := regexp_replace(v, '[^0-9]', '', 'g');
    if length(v) in (12,13) and left(v,2) = '55' then v := substr(v,3); end if;
  elsif p_kind in ('company','person') then
    v := translate(v, 'àáâãäåèéêëìíîïòóôõöùúûüçñýÿ', 'aaaaaaeeeeiiiiooooouuuucnyy');
    v := regexp_replace(v, '[^a-z0-9]', '', 'g');
  elsif p_kind in ('website','instagram','maps') then
    v := regexp_replace(v, '^https?://', '');
    v := regexp_replace(v, '^www\.', '');
    v := regexp_replace(v, '/+$', '');
  end if;
  return v;
end;
$$;
create or replace function public.prospecting_identity_keys(p_lead jsonb)
returns table(kind text, value text) language sql immutable security invoker set search_path = '' as $$
  select entries.key, public.prospecting_identity_value(entries.key, entries.value)
  from jsonb_each_text(jsonb_build_object('id', p_lead->>'id', 'company', p_lead->>'company',
    'person', p_lead->>'person', 'email', p_lead->>'email', 'website', p_lead->>'website',
    'instagram', p_lead->>'instagram', 'maps', p_lead->>'maps')) entries
  where public.prospecting_identity_value(entries.key, entries.value) <> ''
  union
  select 'phone', public.prospecting_identity_value('phone', phones.value)
  from jsonb_array_elements_text(jsonb_build_array(coalesce(p_lead->>'phone','')) || coalesce(p_lead->'additional_phones','[]'::jsonb)) phones
  where public.prospecting_identity_value('phone', phones.value) <> '';
$$;
revoke all on function public.prospecting_identity_value(text,text) from public, anon, authenticated;
revoke all on function public.prospecting_identity_keys(jsonb) from public, anon, authenticated;
grant execute on function public.prospecting_identity_value(text,text) to service_role;
grant execute on function public.prospecting_identity_keys(jsonb) to service_role;

create or replace function public.prospecting_import_leads(p_leads jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  item jsonb;
  interaction jsonb;
  new_id uuid;
  conflict_company text;
  conflict_kind text;
  imported_leads integer := 0;
  imported_interactions integer := 0;
begin
  if jsonb_typeof(p_leads) <> 'array' or jsonb_array_length(p_leads) > 5000 then
    raise exception 'Lote inválido';
  end if;
  -- Serialize import checks with every insert/update/delete, including manual registrations.
  lock table public.prospecting_leads in share row exclusive mode;
  for item in select value from jsonb_array_elements(p_leads) loop
    conflict_company := null;
    select existing.company, incoming.kind into conflict_company, conflict_kind
    from public.prospecting_leads existing
    cross join lateral public.prospecting_identity_keys(to_jsonb(existing)) stored
    join public.prospecting_identity_keys(item) incoming
      on incoming.kind = stored.kind and incoming.value = stored.value
    limit 1;
    if found then
      raise exception using errcode = '23505', message = format(
        'Importação bloqueada: "%s" conflita com "%s": %s em comum. Nenhum cadastro do arquivo foi importado.',
        item->>'company', conflict_company,
        case conflict_kind when 'company' then 'nome da empresa' when 'person' then 'nome do responsável'
          when 'phone' then 'telefone' when 'email' then 'e-mail' when 'website' then 'site'
          when 'instagram' then 'Instagram' when 'maps' then 'Google Maps' else 'identificador' end);
    end if;
    new_id := null;
    insert into public.prospecting_leads (id, company, person, city, segment, source, maps, instagram, website, phone, additional_phones, email, website_status, activity, good_reviews, recent_photos, professional, rating, review_count, heat_override, opportunity, personalization, stage, next_action, follow_up, notes, proposal_value, monthly_value, archived, contact_status, contact_time, created_at, updated_at, imported_at)
      select r.id, r.company, r.person, r.city, r.segment, r.source, r.maps, r.instagram, r.website, r.phone, r.additional_phones, r.email, r.website_status, r.activity, r.good_reviews, r.recent_photos, r.professional, r.rating, r.review_count, r.heat_override, r.opportunity, r.personalization, r.stage, r.next_action, r.follow_up, r.notes, r.proposal_value, r.monthly_value, r.archived, r.contact_status, r.contact_time, r.created_at, r.updated_at, transaction_timestamp()
      from jsonb_populate_record(null::public.prospecting_leads, item - 'interactions') r
      returning id into new_id;
    if new_id is not null then
      imported_leads := imported_leads + 1;
      for interaction in select value from jsonb_array_elements(coalesce(item->'interactions', '[]'::jsonb)) loop
        insert into public.prospecting_interactions (id, lead_id, date, channel, stage, note, created_at, contact_status, contact_time)
          select r.id, new_id, r.date, r.channel, r.stage, r.note, r.created_at, r.contact_status, r.contact_time
          from jsonb_populate_record(null::public.prospecting_interactions, interaction) r;
        imported_interactions := imported_interactions + 1;
      end loop;
    end if;
  end loop;
  return jsonb_build_object('imported_leads', imported_leads, 'imported_interactions', imported_interactions,
    'skipped_leads', jsonb_array_length(p_leads) - imported_leads);
end;
$$;
revoke all on function public.prospecting_import_leads(jsonb) from public, anon, authenticated;
grant execute on function public.prospecting_import_leads(jsonb) to service_role;
notify pgrst, 'reload schema';
commit;
