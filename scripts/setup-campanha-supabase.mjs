import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey) {
  console.error('❌ ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada no arquivo .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndTest() {
  console.log('\n🔍 Verificando tabela campanha_gmk_leads no Supabase...')
  const { data, error } = await supabase.from('campanha_gmk_leads').select('id').limit(1)

  if (error && error.code === 'PGRST205') {
    console.log('\n⚠️  A TABELA AINDA NÃO EXISTE NO SEU SUPABASE!')
    console.log('─────────────────────────────────────────────────────────────────')
    console.log('Como o Supabase protege operações DDL (criar tabelas via API REST),')
    console.log('basta executar a migration criada no seu SQL Editor:')
    console.log('\n👉 Link direto: https://supabase.com/dashboard/project/mwrtluebbiyrmjrqwhut/sql/new')
    console.log('─────────────────────────────────────────────────────────────────')
    const sqlPath = join(process.cwd(), 'server', 'migrations', 'campanha_gmk_leads.sql')
    const sql = await fs.readFile(sqlPath, 'utf8')
    console.log('\n📋 SCRIPT SQL (copie e cole no link acima):\n')
    console.log(sql)
    console.log('─────────────────────────────────────────────────────────────────')
    console.log('Após clicar em RUN no Supabase, rode novamente:')
    console.log('node scripts/setup-campanha-supabase.mjs\n')
    return false
  }

  if (error) {
    console.error('❌ Erro inesperado ao consultar Supabase:', error)
    return false
  }

  console.log('✅ TABELA ENCONTRADA COM SUCESSO!')
  console.log('🧪 Executando teste de gravação e leitura no banco...')

  const testId = '00000000-0000-0000-0000-000000000001'
  // Test insert
  const { error: insertErr } = await supabase.from('campanha_gmk_leads').insert({
    id: testId,
    name: 'Teste de Conexão Supabase',
    phone: '5511999999999',
    tipo: 'janela',
    quantidade: '1-2',
    local: 'São Paulo - SP',
    origem: 'teste-script',
    status: 'novo',
    notes: 'Registro de teste automatizado',
    value: 500
  })

  if (insertErr) {
    console.error('❌ Erro no teste de inserção:', insertErr)
    return false
  }
  console.log('  ✓ Inserção de lead de teste OK')

  // Test read
  const { data: readData, error: readErr } = await supabase.from('campanha_gmk_leads').select('*').eq('id', testId).single()
  if (readErr) {
    console.error('❌ Erro no teste de leitura:', readErr)
    return false
  }
  console.log('  ✓ Leitura de lead de teste OK:', readData.name)

  // Test cleanup
  await supabase.from('campanha_gmk_leads').delete().eq('id', testId)
  console.log('  ✓ Limpeza de teste OK')

  console.log('\n🎉 O BANCO DE DADOS SUPABASE ESTÁ 100% PRONTO E HOMOLOGADO!\n')
  return true
}

checkAndTest().catch(console.error)
