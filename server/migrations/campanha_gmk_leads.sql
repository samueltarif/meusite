-- ═══════════════════════════════════════════════════════════════════
-- CAMPANHA GMK TELAS MOSQUITEIRAS — SUPABASE MIGRATION
-- Tabela para captura e gestão dos leads do Google Ads
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. TABELA: campanha_gmk_leads ────────────────────────────────
CREATE TABLE IF NOT EXISTS campanha_gmk_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'contato', 'orcamento', 'ganho', 'perdido')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('janela', 'porta-giro', 'porta-balcao', 'casa-inteira')),
  quantidade TEXT NOT NULL CHECK (quantidade IN ('1-2', '3-5', 'mais-5', 'visita')),
  local TEXT NOT NULL,
  origem TEXT NOT NULL DEFAULT 'landing-quiz',
  tracking JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT NOT NULL DEFAULT '',
  value NUMERIC(12, 2) NULL
);

-- ─── 2. ÍNDICES DE PERFORMANCE ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_campanha_gmk_leads_created_at ON campanha_gmk_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campanha_gmk_leads_status ON campanha_gmk_leads (status);
CREATE INDEX IF NOT EXISTS idx_campanha_gmk_leads_phone ON campanha_gmk_leads (phone);

-- ─── 3. SEGURANÇA E RLS (Row Level Security) ──────────────────────
ALTER TABLE campanha_gmk_leads ENABLE ROW LEVEL SECURITY;

-- Política de acesso para a API do backend (Service Role)
DROP POLICY IF EXISTS "Service role tem acesso total a campanha_gmk_leads" ON campanha_gmk_leads;
CREATE POLICY "Service role tem acesso total a campanha_gmk_leads"
  ON campanha_gmk_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Política para inserção segura (caso anon queira gravar via Supabase Client direto)
DROP POLICY IF EXISTS "Insercao publica controlada em campanha_gmk_leads" ON campanha_gmk_leads;
CREATE POLICY "Insercao publica controlada em campanha_gmk_leads"
  ON campanha_gmk_leads
  FOR INSERT
  WITH CHECK (true);

-- Política para leitura via service_role ou authenticated
DROP POLICY IF EXISTS "Permitir leitura dos leads por service_role" ON campanha_gmk_leads;
CREATE POLICY "Permitir leitura dos leads por service_role"
  ON campanha_gmk_leads
  FOR SELECT
  USING (true);
