-- Executar no SQL Editor do Supabase antes de publicar a opção de excluir.
-- Este script apenas instala a função. Não exclui nenhuma empresa ao ser executado.
begin;
create or replace function public.prospecting_delete_lead(
  p_lead_id uuid,
  p_expected_updated_at timestamptz
) returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_updated_at timestamptz;
begin
  select updated_at into v_updated_at
  from public.prospecting_leads where id = p_lead_id for update;
  if not found then return false; end if;
  if p_expected_updated_at is null or v_updated_at is distinct from p_expected_updated_at then
    raise exception 'Empresa alterada em outra sessão' using errcode = '40001';
  end if;
  delete from public.prospecting_interactions where lead_id = p_lead_id;
  delete from public.prospecting_leads where id = p_lead_id;
  return true;
end;
$$;
revoke all on function public.prospecting_delete_lead(uuid, timestamptz) from public, anon, authenticated;
grant execute on function public.prospecting_delete_lead(uuid, timestamptz) to service_role;
notify pgrst, 'reload schema';
commit;
