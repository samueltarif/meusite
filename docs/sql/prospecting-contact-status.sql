-- Migration opcional para persistir colunas dedicadas de status de contato e horário na tabela prospecting_leads.
-- O painel já funciona imediatamente persistindo via interações e notas estruturadas.
-- Executar no SQL Editor do Supabase se desejar colunas diretas na tabela de leads.

begin;

alter table public.prospecting_leads
  add column if not exists contact_status text not null default 'Nenhum contato',
  add column if not exists contact_time text not null default '';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.prospecting_leads'::regclass
      and conname = 'prospecting_leads_contact_status_check'
  ) then
    alter table public.prospecting_leads
      add constraint prospecting_leads_contact_status_check
      check (contact_status in ('Nenhum contato', 'Contato realizado', 'Não atendeu', 'Não respondeu'));
  end if;
end $$;

notify pgrst, 'reload schema';

commit;
