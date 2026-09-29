# Integração completa do painel de prospecção com Supabase Auth

Substitui o localStorage pelo Supabase como armazenamento principal do CRM de prospecção, implementando autenticação exclusiva para o painel e proteção completa em todas as camadas.

## Estado atual confirmado

- **Migration `avyro_prospecting_v1`** já aplicada: tabelas `prospecting_leads`, `prospecting_interactions`, `prospecting_settings` existem com RLS ativo.
- **Migration `avyro_prospecting_auth_v1`** já aplicada: tabela `prospecting_members`, função `is_prospecting_member()`, policies para as 3 tabelas + members.
- **`samuel.tarif@gmail.com`** (UUID `4fa6c459-...`) já inserido em `prospecting_members`.
- `auth.users` tem 8 contas; apenas o membro autorizado acessa o CRM.
- Supabase já está integrado no projeto via `app/composables/useSupabase.ts`.
- Já existe `server/utils/auth.ts` com validação de sessão no servidor.
- Já existem páginas em `/auth/` (forgot-password, reset-password, confirm) e `/login`.

## Proposed Changes

---

### Banco (sem novas migrations necessárias)
Banco está 100% pronto. Nenhuma migration adicional será necessária.

---

### API Server — Novos endpoints para o CRM

#### [NEW] `server/api/prospecting/auth.get.ts`
Verifica se o usuário logado é membro do CRM. Retorna `{ member: boolean }`.

#### [NEW] `server/api/prospecting/leads/index.get.ts`
Lista todas as leads do usuário (via RLS + token). Inclui as interações aninhadas.

#### [NEW] `server/api/prospecting/leads/index.post.ts`
Cria uma nova lead. Valida com Zod, converte camelCase → snake_case.

#### [NEW] `server/api/prospecting/leads/[id].patch.ts`
Edita uma lead. Proteção de concorrência via `updated_at` (se datas divergirem, retorna 409).

#### [NEW] `server/api/prospecting/interactions/index.post.ts`
Registra interação em transação: insere em `prospecting_interactions` + atualiza `prospecting_leads` respeitando regra de não regressão de etapa.

#### [NEW] `server/api/prospecting/settings.get.ts` + `settings.patch.ts`
Lê e atualiza as configurações singleton.

#### [NEW] `server/api/prospecting/import.post.ts`
Importação idempotente de backup: usa `ON CONFLICT (id) DO NOTHING` para leads e interações.

---

### Middleware de rota

#### [NEW] `app/middleware/prospecting-auth.ts`
Middleware client-side: redireciona para `/prospeccao/login` se não houver sessão ativa.

---

### Páginas do painel CRM

#### [NEW] `app/pages/prospeccao/login.vue`
Login exclusivo para o painel — design dark neutro, e-mail + senha. Sem link para registro. Redireciona para `/prospeccao` após autenticação confirmada como membro.

#### [MODIFY] `app/pages/prospeccao.vue`
Adicionar middleware de guarda + lógica de detecção de dados locais para migração.

---

### Services e Composables

#### [NEW] `app/services/prospecting-api.ts`
Camada de rede: todas as chamadas `$fetch` para os endpoints do CRM. Sem reatividade.

#### [MODIFY] `app/composables/useProspecting.ts`
Substitui chamadas ao `localStorage` por chamadas ao `prospecting-api`. Mantém toda a reatividade, validações Zod, regras de negócio, estados de loading/error/notice.

#### [NEW] `app/composables/useProspectMigration.ts`
Detecta `avyro-prospecting-v1` no localStorage após login. Exibe prévia da migração, pede confirmação, chama endpoint de importação idempotente.

---

### Componente de migração

#### [NEW] `app/components/prospecting/MigrationBanner.vue`
Banner com contagem de registros locais + botões "Exportar backup" e "Importar para o banco". Aparece apenas quando há dados locais não migrados.

---

## Verificação

### Testes no banco (transacionais com rollback)
- Anônimo sem session → 401 em todos os endpoints
- Autenticado sem membership → 403
- Membro autorizado → 200 e CRUD funcionando
- Concorrência: PATCH com `updated_at` defasado → 409
- Interação retroativa não regride etapa
- Importação duplicada idempotente

### Build e testes existentes
- `npm run build` sem erros
- Suíte de testes Vitest existente

## Open Questions

> [!IMPORTANT]
> A página `/login` existente é do produto Link-in-Bio (redireciona para `/dashboard`). O painel de prospecção precisará de uma página de login **separada** em `/prospeccao/login` para não conflitar com o fluxo de usuários do produto principal.

> [!IMPORTANT]
> O texto atual em Workspace.vue diz "Sem login · Dados salvos apenas neste navegador e endereço." Isso será atualizado para refletir a sincronização com o banco após o login.
