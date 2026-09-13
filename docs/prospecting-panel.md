# Painel de prospecção ativa

Rota: /prospeccao. Sem autenticação, sem banco remoto e sem endpoints públicos de contatos. Armazenamento local versionado na chave avyro-prospecting-v1. Não aparece na navegação comercial nem no sitemap; noindex, nofollow. Uma pessoa usando outro aparelho ou endereço não acessa os mesmos dados automaticamente.

Base: conversa compartilhada “Comparar prospecção e anúncios”, lida em https://chatgpt.com/share/6aa0d248-6ba4-83e9-b6e7-568afa078ccb. Critérios extraídos: cidade + segmento; negócios ativos e profissionais sem site ou apenas Instagram como prioridade quente; site antigo como morno; sinais de abandono para revisão/descarte; avaliações, fotos recentes, WhatsApp/Instagram/e-mail; frase personalizada e oportunidade concreta; retorno sugerido em dois dias; acompanhar empresas contatadas, respostas, interessados e fechamentos por segmento.

## Uso

1. Adicionar empresa, pessoa, cidade, segmento, origem, canais e links.
2. Qualificar situação do site, atividade e sinais observados. A prioridade sugerida pode ser substituída manualmente.
3. Abrir a ficha e copiar um rascunho opcional para revisar. O painel não envia mensagens e copiar não conta como contato.
4. Registrar a abordagem realizada, data, canal, resultado e próximo passo. A data de retorno é ajustável; etapas encerradas saem dos retornos.
5. Consultar lista, funil, retornos até hoje e comparação por segmento. Arquivar é reversível.

Resultados usam empresas únicas, não o número de mensagens. Respostas e interesse são históricos; fechamentos e valores usam a etapa atual. Um registro retroativo não regride a etapa atual nem o retorno. Projeto e mensalidade são apresentados separados e não representam pagamentos confirmados. Meta inicial: 30; investimento inicial: zero, para preenchimento com custo real.

## Dados e backup

Exportação JSON inclui contatos, histórico, notas e configurações. Importação validada por Zod, até 10 MB e 5.000 contatos. Duplicados por identificador são ignorados na mesclagem. Se não existirem contatos, as configurações do backup também são restauradas. Dados inválidos ou sem permissão de armazenamento não são sobrescritos silenciosamente. Fichas alteradas em outra aba devem ser reabertas antes de salvar edições antigas.

Use sempre o mesmo endereço (por exemplo 127.0.0.1:3000). localhost, domínio publicado, navegador diferente e modo anônimo têm armazenamentos separados. Faça backups antes de limpar dados do navegador ou migrar de endereço.

Não há autenticação conforme solicitado. Uma futura versão com armazenamento compartilhado precisa definir acesso e persistência antes de receber dados em um servidor. Este painel não exporta dados para Google Ads nem envia mensagens automaticamente.

Validação: testes automatizados de qualificação, datas, registros retroativos, métricas, validação de links e backups, persistência e rota. Sem teste visual ou interação automatizada no navegador.


## Guia e preparação do Supabase — 13/09/2026

A aba Guia de prospecção reúne seleção por sinais de atividade, nichos para testar, critérios de qualificação, preparação do contato, mensagens adaptáveis e leitura de resultados. Fontes: conversa fornecida e política oficial de mensagens em https://business.whatsapp.com/policy.

SQL proposto: docs/sql/prospecting-schema.sql. Prompt operacional: docs/antigravity-prospecting-prompt.md. Estes arquivos não foram executados no Supabase. O painel continua local, sem alteração em tabelas ou integrações existentes. A migration prepara três tabelas com RLS e sem acesso anônimo ou de usuários autenticados do produto atual. Base de segurança: https://supabase.com/docs/guides/database/postgres/row-level-security.
