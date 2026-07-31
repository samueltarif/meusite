-- ═══════════════════════════════════════════════════════════════════
-- INSTAGRAM AUTO REPLY — SUPABASE MIGRATION
-- Execute este script no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. TABELA: instagram_accounts ──────────────────────────────
-- Vincula contas do Instagram aos usuários do sistema.
-- Preparada para multi-tenant (cada usuário conecta seu próprio IG).

CREATE TABLE IF NOT EXISTS instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instagram_account_id TEXT NOT NULL,
  instagram_username TEXT,
  access_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON instagram_accounts(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_instagram_accounts_ig_id ON instagram_accounts(instagram_account_id);

-- RLS
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own instagram accounts"
  ON instagram_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own instagram accounts"
  ON instagram_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instagram accounts"
  ON instagram_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own instagram accounts"
  ON instagram_accounts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to instagram_accounts"
  ON instagram_accounts FOR ALL
  USING (auth.role() = 'service_role');


-- ─── 2. TABELA: instagram_webhook_events ────────────────────────
-- Log de todos os eventos recebidos via webhook da Meta.

CREATE TABLE IF NOT EXISTS instagram_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_account_id TEXT,
  sender_id TEXT,
  recipient_id TEXT,
  event_type TEXT NOT NULL DEFAULT 'unknown',
  message_id TEXT,
  message_text TEXT,
  comment_id TEXT,
  media_id TEXT,
  raw_payload JSONB,
  processed BOOLEAN NOT NULL DEFAULT false,
  auto_reply_sent BOOLEAN NOT NULL DEFAULT false,
  matched_rule_id UUID,
  human_reply_text TEXT,
  human_reply_sent BOOLEAN NOT NULL DEFAULT false,
  human_reply_status TEXT,
  human_reply_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_webhook_events_ig_account ON instagram_webhook_events(instagram_account_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_sender ON instagram_webhook_events(sender_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON instagram_webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON instagram_webhook_events(event_type);

-- Índice único para deduplicação de mensagens
CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_message_dedup
  ON instagram_webhook_events(message_id)
  WHERE message_id IS NOT NULL;

-- Índice único para deduplicação de comentários
CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_comment_dedup
  ON instagram_webhook_events(comment_id)
  WHERE comment_id IS NOT NULL;

-- RLS
ALTER TABLE instagram_webhook_events ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver eventos das contas Instagram que possuem
CREATE POLICY "Users can view events of own instagram accounts"
  ON instagram_webhook_events FOR SELECT
  USING (
    instagram_account_id IN (
      SELECT ia.instagram_account_id FROM instagram_accounts ia
      WHERE ia.user_id = auth.uid()
    )
  );

-- Service role (webhook server-side) pode inserir/atualizar qualquer evento
CREATE POLICY "Service role full access to webhook events"
  ON instagram_webhook_events FOR ALL
  USING (auth.role() = 'service_role');


-- ─── 3. TABELA: instagram_auto_replies ──────────────────────────
-- Regras de auto-resposta por palavras-chave.

CREATE TABLE IF NOT EXISTS instagram_auto_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instagram_account_id TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'message' CHECK (trigger_type IN ('message', 'comment')),
  keyword TEXT NOT NULL,
  match_type TEXT NOT NULL DEFAULT 'contains' CHECK (match_type IN ('exact', 'contains')),
  response_message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_auto_replies_user_id ON instagram_auto_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_replies_ig_account ON instagram_auto_replies(instagram_account_id);
CREATE INDEX IF NOT EXISTS idx_auto_replies_active ON instagram_auto_replies(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE instagram_auto_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own auto reply rules"
  ON instagram_auto_replies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own auto reply rules"
  ON instagram_auto_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own auto reply rules"
  ON instagram_auto_replies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own auto reply rules"
  ON instagram_auto_replies FOR DELETE
  USING (auth.uid() = user_id);

-- Service role pode ler regras para matching no webhook
CREATE POLICY "Service role full access to auto replies"
  ON instagram_auto_replies FOR ALL
  USING (auth.role() = 'service_role');
