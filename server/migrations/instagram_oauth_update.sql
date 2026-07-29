-- ═══════════════════════════════════════════════════════════════════
-- MIGRATION: Atualização da tabela instagram_accounts para OAuth
-- Execute no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE instagram_accounts
  ADD COLUMN IF NOT EXISTS connection_status TEXT DEFAULT 'disconnected'
    CHECK (connection_status IN ('pending', 'connected', 'expired', 'error', 'disconnected')),
  ADD COLUMN IF NOT EXISTS last_error TEXT;

CREATE INDEX IF NOT EXISTS idx_instagram_accounts_status ON instagram_accounts(connection_status);
