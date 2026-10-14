-- Permite gravar leads do pop-up de WhatsApp (sem tipo/quantidade/local).
ALTER TABLE campanha_gmk_leads DROP CONSTRAINT IF EXISTS campanha_gmk_leads_tipo_check;
ALTER TABLE campanha_gmk_leads ADD CONSTRAINT campanha_gmk_leads_tipo_check
  CHECK (tipo IN ('janela', 'porta-giro', 'porta-balcao', 'casa-inteira', 'nao-informado'));

ALTER TABLE campanha_gmk_leads DROP CONSTRAINT IF EXISTS campanha_gmk_leads_quantidade_check;
ALTER TABLE campanha_gmk_leads ADD CONSTRAINT campanha_gmk_leads_quantidade_check
  CHECK (quantidade IN ('1-2', '3-5', 'mais-5', 'visita', 'nao-informado'));

ALTER TABLE campanha_gmk_leads ALTER COLUMN local SET DEFAULT '';

-- Conferência: quantos leads existem e o último
SELECT count(*) AS total, max(created_at) AS ultimo FROM campanha_gmk_leads;
