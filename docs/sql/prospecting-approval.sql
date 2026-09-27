-- Execute no SQL Editor do Supabase ANTES de publicar o painel atualizado.
-- Preserva dados e permissões. Não converte empresas existentes em contatadas.
-- 'Selecionado' continua salvo no banco e aparece como 'Pendente' na interface.
-- 'Contatado' continua salvo no banco e aparece como 'Em contato'.
begin;

do $$
declare
  target regclass;
  stage_column smallint;
  existing_constraint record;
begin
  foreach target in array array['public.prospecting_leads'::regclass, 'public.prospecting_interactions'::regclass]
  loop
    select attnum into strict stage_column from pg_attribute
      where attrelid = target and attname = 'stage' and not attisdropped;
    -- Substitui somente CHECKs exclusivos da coluna stage; mantém demais regras.
    for existing_constraint in
      select conname from pg_constraint
      where conrelid = target and contype = 'c'
        and conkey = array[stage_column]::smallint[]
    loop
      execute format('alter table %s drop constraint %I', target, existing_constraint.conname);
    end loop;
    execute format(
      'alter table %s add constraint %I check (stage in (''Selecionado'', ''Aprovado'', ''Contatado'', ''Respondeu'', ''Interessado'', ''Proposta enviada'', ''Fechado'', ''Sem interesse'', ''Não contatar''))',
      target, replace(target::text, 'public.', '') || '_stage_check'
    );
  end loop;
end $$;

commit;

-- Conferência: ambas as regras devem incluir Aprovado.
select conrelid::regclass as tabela, conname, pg_get_constraintdef(oid) as regra
from pg_constraint
where conrelid in ('public.prospecting_leads'::regclass, 'public.prospecting_interactions'::regclass)
  and contype = 'c' and conname like '%stage_check';
