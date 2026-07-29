# 📄 Product Requirement Document (PRD) — Avyro SaaS Platform

> **Versão:** 1.0.0  
> **Status:** Em Produção / Desenvolvimento Ativo  
> **Última Atualização:** 29 de Julho de 2026  
> **Domínio Oficial:** [avyro.com.br](https://www.avyro.com.br)  
> **Repositório:** [samueltarif/meusite](https://github.com/samueltarif/meusite.git)  

---

## 📑 Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Objetivos Estratégicos & KPIs](#2-objetivos-estratégicos--kpis)
3. [Público-Alvo e Personas](#3-público-alvo-e-personas)
4. [Arquitetura Técnica & Stack Tecnológica](#4-arquitetura-técnica--stack-tecnológica)
5. [Modelagem de Banco de Dados (Supabase PostgreSQL)](#5-modelagem-de-banco-de-dados-supabase-postgresql)
6. [Módulos e Funcionalidades Detalhadas](#6-módulos-e-funcionalidades-detalhadas)
   - 6.1 [Landing Page Institucional & Vitrine](#61-landing-page-institucional--vitrine)
   - 6.2 [Motor de Link-in-Bio & Perfis Públicos](#62-motor-de-link-in-bio--perfis-públicos)
   - 6.3 [Painel do Cliente (Dashboard)](#63-painel-do-cliente-dashboard)
   - 6.4 [Métricas & Analytics de Tráfego](#64-métricas--analytics-de-tráfego)
   - 6.5 [Instagram Auto Reply & Automação Webhook Meta](#65-instagram-auto-reply--automação-webhook-meta)
   - 6.6 [Autenticação & Gestão de Contas](#66-autenticação--gestão-de-contas)
   - 6.7 [Pagamentos, Assinaturas & Resgate de Cupons](#67-pagamentos-assinaturas--resgate-de-cupons)
7. [Requisitos Não-Funcionais & Segurança](#7-requisitos-não-funcionais--segurança)
8. [Estrutura de Arquivos e Código](#8-estrutura-de-arquivos-e-código)
9. [Guia de Variáveis de Ambiente](#9-guia-de-variáveis-de-ambiente)
10. [Roadmap & Próximos Passos](#10-roadmap--próximos-passos)

---

## 1. Visão Geral do Produto

O **Avyro** é uma plataforma SaaS (Software as a Service) All-in-One voltada para otimização da presença digital e conversão de vendas. O produto combina:

- **Página de Links na Bio Premium (Link-in-Bio):** Solução estilizada com suporte a mais de 24 temas dinâmicos, integração com redes sociais, vitrine virtual de produtos (Shop), embed de vídeos, player de mídia 3D e redirecionamentos rápidos.
- **Automação de Instagram (Auto Reply & Webhooks):** Captura em tempo real de mensagens diretas (DMs) e comentários no Instagram via Webhooks da Meta Graph API, permitindo resposta automática configurável por palavras-chave com isolamento multi-tenant por usuário.
- **Analytics Avançado:** Mapeamento em tempo real de cliques por botão, origem do tráfego (Instagram, TikTok, WhatsApp, Threads, YouTube, Direto), ranking de dispositivos e gráficos temporários.
- **Plataforma de Sites e Landing Pages:** Vitrine para contratação de criação de sites personalizados e modelos prontos de alta performance.

---

## 2. Objetivos Estratégicos & KPIs

### Objetivos
1. Maximizar a taxa de conversão no link da bio para criadores de conteúdo e negócios digitais.
2. Automatizar o atendimento inicial no Instagram (Instagram DM e comentários), transformando seguidores em leads qualificados sem intervenção manual contínua.
3. Oferecer um painel de controle ultra intuitivo, rápido (responsivo mobile-first) e esteticamente impecável.

### KPIs Principais
- **Taxa de Retenção de Assinantes (Churn Rate):** < 5% ao mês no Plano Pro.
- **Tempo Médio de Resposta do Webhook:** < 200ms para confirmação HTTP 200 à Meta.
- **Disponibilidade (Uptime):** 99.9% nos serviços de borda (Vercel Serverless / Supabase).
- **Engajamento nos Links:** Média de cliques por visitante único na página pública.

---

## 3. Público-Alvo e Personas

1. **Influenciadores & Criadores de Conteúdo (Creators):**
   - Necessitam de um link da bio visualmente atraente, integrado ao TikTok/Instagram/YouTube/Spotify, e que exiba contagem de seguidores e mídia em destaque.
2. **Pequenas Empresas & E-commerces:**
   - Querem expor catálogo de produtos (Shop em 2 colunas com fotos em zoom), resgatar cupons de desconto e responder dúvidas frequentes automaticamente via direct no Instagram.
3. **Prestadores de Serviço & Consultores:**
   - Focados em agendamento via WhatsApp, direcionamento para formulários de lead e rastreamento da origem exata dos cliques.

---

## 4. Arquitetura Técnica & Stack Tecnológica

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              CLIENT-SIDE                               │
 │         Nuxt 4 / Vue 3 App (Vite, TailwindCSS, Pinia, VueUse)          │
 └───────────────────┬────────────────────────────────┬───────────────────┘
                     │                                │
                     ▼                                ▼
 ┌───────────────────────────────────────┐ ┌──────────────────────────────┐
 │         SERVERLESS FUNCTIONS          │ │        META GRAPH API        │
 │  Nuxt Server Engine (H3 EventHandlers)│ │   (Webhooks & Direct Msg)    │
 └───────────────────┬───────────────────┘ └──────────────┬───────────────┘
                     │                                    │
                     ├─── Supabase Client (Auth & DB) ────┤
                     │                                    │
                     ▼                                    ▼
 ┌───────────────────────────────────────┐ ┌──────────────────────────────┐
 │         SUPABASE POSTGRESQL           │ │        CLOUDFLARE R2          │
 │    Auth, Profiles, Links, Events,     │ │    (Armazenamento S3 de      │
 │    Auto Replies, RLS Multi-tenant     │ │       Fotos e Mídias)        │
 └───────────────────────────────────────┘ └──────────────────────────────┘
```

| Camada | Tecnologia | Função |
|---|---|---|
| **Core Framework** | Nuxt 4 (`compatibilityVersion: 4`) / Vue 3 | Rendering híbrido (SSR + SPA) com otimização automática de rotas |
| **Estilização** | Vanilla CSS + TailwindCSS | Design System customizado com gradientes, dark mode e micro-animações |
| **Backend & DB** | Supabase (PostgreSQL) | Banco de dados relacional, autenticação segura e Row Level Security (RLS) |
| **Server Engine** | H3 Event Handlers (`server/api/`) | Execução serverless de endpoints REST e webhooks |
| **Armazenamento de Mídia**| Cloudflare R2 (`@aws-sdk/client-s3`) | Upload e CDN de imagens em alta resolução |
| **Integração de Pagamento**| Stripe API + Mercado Pago SDK | Processamento de cartões, PIX, assinaturas Pro e verificação de cupons |
| **Integração Social** | Meta Graph API (v19.0) | Recebimento e envio de automações do Instagram |
| **Hospedagem** | Vercel Serverless | Deploy contínuo via GitHub CI/CD com CDN Global |

---

## 5. Modelagem de Banco de Dados (Supabase PostgreSQL)

### 5.1 Tabela `profiles`
Armazena os dados dos usuários cadastrados no SaaS:
- `id` (uuid, PK, FK → `auth.users`)
- `username` (text, único)
- `full_name` (text)
- `avatar_url` (text)
- `bio` (text)
- `theme_id` (text)
- `plan_type` (text: `'free'` | `'pro'`)
- `subscription_status` (text: `'active'` | `'canceled'` | `'free'`)
- `stripe_customer_id` (text)
- `stripe_subscription_id` (text)
- `updated_at` (timestamptz)

### 5.2 Tabela `links`
Armazena os botões e elementos da página pública de cada usuário:
- `id` (uuid, PK)
- `user_id` (uuid, FK → `profiles.id`)
- `title` (text)
- `url` (text)
- `icon` (text)
- `position` (integer)
- `clicks_count` (integer, default 0)
- `created_at` (timestamptz)

### 5.3 Tabela `link_clicks`
Histórico individualizado de cliques para o Analytics:
- `id` (uuid, PK)
- `link_id` (uuid, FK → `links.id`)
- `profile_id` (uuid, FK → `profiles.id`)
- `platform` (text: `'Instagram'`, `'TikTok'`, `'WhatsApp'`, etc.)
- `referrer` (text)
- `created_at` (timestamptz)

### 5.4 Tabela `instagram_accounts` *(Multi-tenant)*
Vincula contas do Instagram Business aos usuários do sistema:
- `id` (uuid, PK)
- `user_id` (uuid, FK → `auth.users`)
- `instagram_account_id` (text, único)
- `instagram_username` (text)
- `access_token` (text)
- `token_expires_at` (timestamptz)
- `is_active` (boolean, default true)
- `created_at` / `updated_at` (timestamptz)

### 5.5 Tabela `instagram_webhook_events` *(Log & Leads)*
Registra todos os eventos recebidos via webhook da Meta:
- `id` (uuid, PK)
- `instagram_account_id` (text)
- `sender_id` (text)
- `recipient_id` (text)
- `event_type` (text: `'message'`, `'comment'`, `'unknown'`)
- `message_id` (text, único via índice parcial de deduplicação)
- `message_text` (text)
- `comment_id` (text, único via índice parcial de deduplicação)
- `media_id` (text)
- `raw_payload` (jsonb)
- `processed` (boolean, default false)
- `auto_reply_sent` (boolean, default false)
- `matched_rule_id` (uuid, FK → `instagram_auto_replies.id`)
- `error_message` (text)
- `created_at` (timestamptz)

### 5.6 Tabela `instagram_auto_replies` *(Regras de Automação)*
Regras de palavra-chave para respostas automáticas:
- `id` (uuid, PK)
- `user_id` (uuid, FK → `auth.users`)
- `instagram_account_id` (text)
- `trigger_type` (text: `'message'` | `'comment'`)
- `keyword` (text)
- `match_type` (text: `'exact'` | `'contains'`)
- `response_message` (text)
- `is_active` (boolean, default true)
- `created_at` / `updated_at` (timestamptz)

---

## 6. Módulos e Funcionalidades Detalhadas

### 6.1 Landing Page Institucional & Vitrine
- **Rotas:** `/`, `/modelos-site`, `/link-in-bio`
- **Recursos:**
  - Apresentação visual da Avyro Growth Company com modo escuro espacial (`cosmic-nebula.jpg`).
  - Animações Lottie interativas (`landing-page-animation.json`, `website-design.json`).
  - Formulário de captura de leads via WhatsApp.
  - Carrossel e vitrine de modelos de sites e perfis.
  - Meta tags globais de SEO e verificação de domínio do Meta Business (`facebook-domain-verification`).

### 6.2 Motor de Link-in-Bio & Perfis Públicos
- **Rotas:** `/[username]`, `/@username`, `/bio/[username]`
- **Recursos:**
  - Renderização ultrarrápida do perfil do usuário.
  - **24 Temas Estilizados:** presets como *Monica Vera*, *Lexie Candis*, *Memphis Pop*, *Vaporwave Grid*, *Boho Circles*, *Luxury Gold*, entre outros.
  - **Shop / Vitrine Virtual:** Layout em grade de 2 colunas com suporte a imagens em tela cheia (Modal de Zoom) e abas de categorias.
  - **Social Feed Card:** Bloco visual 3D exibindo imagens sobrepostas e contagem de seguidores.
  - **Modal de Compartilhamento:** Botão rápido com QR Code e cópia de link.
  - Rastreamento de clique transparente via `/api/analytics/track-click.post.ts`.

### 6.3 Painel do Cliente (Dashboard)
- **Rota:** `/dashboard/index.vue`
- **Recursos:**
  - Editor em tempo real (WYSIWYG/Live Preview) da página do usuário.
  - Reordenação drag-and-drop / posições de links.
  - Integração com provedores de imagem (Pexels API, Unsplash API, Giphy GIFs e Stickers).
  - Upload de arquivos direto para o Cloudflare R2.
  - Modal de resgate de cupons de desconto Pro com validação via Stripe.

### 6.4 Métricas & Analytics de Tráfego
- **Rota:** `/dashboard/analytics.vue`
- **Recursos:**
  - Gráfico comparativo diário com offset ajustado para o fuso horário `America/Sao_Paulo`.
  - Agrupamento automático da origem do visitante (Instagram, TikTok, WhatsApp, Threads, YouTube, Facebook, Direto).
  - Trava visual (PRO Lock Overlay) para usuários do plano gratuito.

### 6.5 Instagram Auto Reply & Automação Webhook Meta
- **Rotas API:**
  - GET/POST `/api/instagram/webhook`
  - GET/POST/PUT/DELETE `/api/instagram/auto-replies`
  - GET `/api/instagram/events`
- **Rota Dashboard:** `/dashboard/instagram.vue`
- **Recursos:**
  - **Validação leve de GET:** Handshake instantâneo lendo `hub.mode`, `hub.verify_token` e `hub.challenge`.
  - **Deduplicação Inteligente:** Prevenção de duplicados com índices únicos em `message_id` e `comment_id`.
  - **Proteção Anti-Loop:** O sistema detecta se a mensagem foi enviada pelo próprio ID do Instagram e ignora o disparo de auto-resposta.
  - **Modo de Segurança (`INSTAGRAM_AUTO_REPLY_ENABLED=false`):** Permite registrar e visualizar interações e regras ativadas sem efetuar o envio real para a Meta durante fase de testes.
  - **Painel com Abas:** Gestão completa de regras de palavras-chave (`exact` / `contains`) e histórico de leads recebidos.

### 6.6 Autenticação & Gestão de Contas
- **Rotas:** `/login`, `/register`, `/auth/confirm`, `/auth/forgot-password`, `/auth/reset-password`
- **Recursos:**
  - Login e cadastro via Supabase Auth (E-mail/Senha).
  - Plugin cliente `auth-recovery.client.ts` para captura de tokens de redefinição de senha na URL.
  - Proteção de armazenamento seguro (Safe Storage fallback) contra falhas de `localStorage` na navegação anônima do Safari iOS.

### 6.7 Pagamentos, Assinaturas & Resgate de Cupons
- **Rotas API:** `/api/stripe/webhook.post.ts`, `/api/coupons/redeem.post.ts`
- **Recursos:**
  - Checkout e gerenciamento de assinaturas via Stripe.
  - Suporte a Mercado Pago para pagamentos PIX/nacionais.
  - Validação redundante de cupons promocionais no Stripe (ex: `VIPAMIGOS`, `BIANCA100`, `100OFF`) com atualização instantânea do perfil do usuário para Plano Pro.

---

## 7. Requisitos Não-Funcionais & Segurança

1. **Segurança Server-Side:**
   - Todas as chaves secretas (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `R2_SECRET_ACCESS_KEY`) são estritamente mantidas em variáveis de ambiente server-side no `.env` e Vercel, nunca expostas no pacote do cliente.
2. **Políticas RLS (Row Level Security):**
   - Isolamento total por usuário: cada cliente visualiza e edita exclusivamente suas próprias regras, links e contas conectadas.
3. **Resiliência de Webhooks:**
   - Resposta HTTP 200 OK rápida à Meta para evitar desativação do webhook por timeout.
4. **Sanitização de Logs:**
   - Mascaramento automático de tokens de acesso nos logs do console (ex: `avy...2026`).
5. **Compatibilidade SEO:**
   - Tags dinâmicas `useSeoMeta` em todas as páginas, Open Graph (`og:image`), Twitter Cards e favicon customizado Avyro (`public/favicon.ico` e `public/favicon.png`).

---

## 8. Estrutura de Arquivos e Código

```text
d:\avyro\
├── app/
│   ├── assets/              # Estilos globais (main.css) e fontes
│   ├── components/          # Componentes Vue reutilizáveis e layouts
│   ├── composables/         # Composable do Supabase (useSupabase.ts)
│   ├── layouts/             # Layouts do Nuxt (default.vue)
│   ├── pages/               # Páginas e rotas da aplicação
│   │   ├── index.vue        # Landing Page Institucional
│   │   ├── login.vue        # Tela de Login
│   │   ├── register.vue     # Tela de Cadastro
│   │   └── dashboard/       # Painel do Cliente
│   │       ├── index.vue    # Editor de Links & Live Preview
│   │       ├── analytics.vue# Métricas de Cliques & Origem
│   │       └── instagram.vue# Gestão de Auto Reply & Leads
│   ├── plugins/             # Plugins do Nuxt (auth-recovery.client.ts)
│   └── utils/               # utilitários de ícones de marcas (brandIcons.ts)
├── public/                  # Arquivos estáticos (favicon.ico, favicon.png, Lottie JSONs)
├── server/
│   ├── api/                 # Handlers H3 de API REST e Webhooks
│   │   ├── analytics/       # Endpoint de rastreamento de cliques
│   │   ├── coupons/         # Endpoint de resgate de cupons
│   │   ├── instagram/       # Webhook e CRUD de regras/eventos
│   │   │   ├── webhook.ts
│   │   │   ├── auto-replies.get.ts
│   │   │   ├── auto-replies.post.ts
│   │   │   ├── auto-replies.put.ts
│   │   │   ├── auto-replies.delete.ts
│   │   │   └── events.get.ts
│   │   └── stripe/          # Webhook do Stripe
│   ├── migrations/          # Scripts SQL do Supabase (instagram_auto_reply.sql)
│   └── utils/               # Utilitários de servidor (instagram.ts, auth.ts)
├── docs/                    # Documentação do projeto (PRD.md)
├── nuxt.config.ts           # Configurações globais do Nuxt
├── tailwind.config.ts       # Configurações do TailwindCSS
└── .env                     # Variáveis de ambiente locais
```

---

## 9. Guia de Variáveis de Ambiente

Para o funcionamento correto em ambiente de desenvolvimento local e em produção na Vercel, as seguintes variáveis devem estar configuradas:

```env
# ─── Supabase Configuration ───
SUPABASE_URL=https://mwrtluebbiyrmjrqwhut.supabase.co
SUPABASE_KEY=eyJhbGciOi... (Anon Key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (Service Role Key)

# ─── Stripe Configuration ───
STRIPE_SECRET_KEY=sk_live_...
STRIPE_RESTRICTED_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─── Cloudflare R2 Storage ───
R2_ENDPOINT=https://ade6ce43fa3f7c4b7d4d3e821c8b37e0.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=ff37233a1dee219bc04c97ebe3a1af96
R2_SECRET_ACCESS_KEY=cce30ac4de70...
R2_BUCKET_NAME=unajoya
R2_PUBLIC_URL=https://pub-dc27e38de76e4cbabdbf37c4d1ef65ff.r2.dev

# ─── Third-Party APIs (Stock Images/GIFs) ───
PEXELS_API_KEY=RpoJjgCHZLRwflbEYW...
UNSPLASH_ACCESS_KEY=BBaWeIWsd0_...
GIPHY_API_KEY=IPYIeEv3x...

# ─── Meta / Instagram Integration ───
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=avyro_instagram_webhook_2026
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841401920784631
INSTAGRAM_ACCESS_TOKEN=IGABBgUfEyt...
INSTAGRAM_AUTO_REPLY_ENABLED=false
INSTAGRAM_APP_SECRET=
```

---

## 10. Roadmap & Próximos Passos

1. **OAuth do Instagram ("Instagram API with Instagram Login"):**
   - Implementar botão "Conectar Conta do Instagram" no painel para permitir que novos usuários vinculem suas contas automaticamente via OAuth 2.0 sem precisar copiar tokens manualmente.
2. **App Review na Meta Developers:**
   - Solicitar submissão para aprovação das permissões `instagram_manage_messages` e `instagram_manage_comments` em modo público.
3. **Automações Avançadas por IA:**
   - Integração com LLMs (OpenAI/Gemini) para gerar respostas personalizadas dinâmicas quando nenhuma palavra-chave for encontrada.
4. **Agendamento de Posts & Stories:**
   - Extensão do dashboard para permitir publicação programada de mídias no Instagram.

---

*Documento mantido e atualizado pela equipe técnica da Avyro Growth Company.*
