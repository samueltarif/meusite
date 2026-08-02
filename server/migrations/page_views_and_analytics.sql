-- ==============================================================================
-- SCRIPT DE MIGRACAO SQL: ANALYTICS E TRACKING REAL DE VISUALIZACOES (PAGE VIEWS)
-- ==============================================================================

-- 1. Adicionar coluna views_count na tabela profiles (se ainda nao existir)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 2. Criar a tabela page_views para registro detalhado de acessos ao link na bio
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'Direto',
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar RLS na tabela page_views
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Politica para permitir insercoes de acessos anonimos (com DROP IF EXISTS para evitar erros ao re-executar)
DROP POLICY IF EXISTS "Permitir insercao publica em page_views" ON page_views;
CREATE POLICY "Permitir insercao publica em page_views" 
ON page_views FOR INSERT 
WITH CHECK (true);

-- Politica para leitura autenticada ou servico
DROP POLICY IF EXISTS "Permitir leitura publica/servico em page_views" ON page_views;
CREATE POLICY "Permitir leitura publica/servico em page_views" 
ON page_views FOR SELECT 
USING (true);

-- 4. Funcao RPC para incrementar views_count de forma atomica
CREATE OR REPLACE FUNCTION increment_profile_view(target_profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = target_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar indices para otimizar a velocidade dos relatorios de analytics
CREATE INDEX IF NOT EXISTS idx_page_views_profile_id ON page_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);

-- ==============================================================================
-- COMANDO OPCIONAL PARA ZERAR TODAS AS METRICAS ANTIGAS DO BANCO DE DADOS
-- Execute os comandos abaixo no SQL Editor do Supabase se quiser zerar tudo 100%:
-- ==============================================================================

-- TRUNCATE TABLE link_clicks;
-- TRUNCATE TABLE page_views;
-- UPDATE links SET clicks_count = 0;
-- UPDATE profiles SET views_count = 0;
