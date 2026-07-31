-- ═══════════════════════════════════════════════════════════════════
-- INSTAGRAM REVIEW MODE & HUMAN AGENT — SUPABASE MIGRATION
-- Execute este script no SQL Editor do Supabase se necessário
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE instagram_webhook_events
  ADD COLUMN IF NOT EXISTS human_reply_text TEXT,
  ADD COLUMN IF NOT EXISTS human_reply_sent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS human_reply_status TEXT,
  ADD COLUMN IF NOT EXISTS human_reply_at TIMESTAMPTZ;
