-- Executar no SQL Editor do Supabase ANTES de publicar o painel atualizado.
-- Não executado automaticamente. Preserva o telefone principal e os registros atuais.
begin;
alter table public.prospecting_leads
  add column if not exists additional_phones jsonb not null default '[]'::jsonb;
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.prospecting_leads'::regclass
      and conname = 'prospecting_leads_additional_phones_check'
  ) then
    alter table public.prospecting_leads
      add constraint prospecting_leads_additional_phones_check
      check (jsonb_typeof(additional_phones) = 'array' and jsonb_array_length(additional_phones) <= 9);
  end if;
end $$;
notify pgrst, 'reload schema';
commit;
