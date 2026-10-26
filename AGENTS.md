# AGENTS.md — Regras do Projeto (Avyro / Meu Site)

Este arquivo define diretrizes e regras obrigatórias para agentes de IA (Antigravity, Cursor, Claude Code, Codex, etc.) atuando neste repositório.

---

## 1. Rastreamento e Analytics — Microsoft Clarity Obrigatório

- **Regra Geral:** O rastreamento do **Microsoft Clarity** (ID: `z0y9ky79tm`) deve estar sempre ativo em **todas as páginas do site** e em **quaisquer novas páginas** que forem criadas.
- **Configuração Global:**
  - O Clarity está configurado globalmente no arquivo [nuxt.config.ts](file:///d:/avyro1/nuxt.config.ts) (em `app.head.script`) e no plugin client-side [app/plugins/clarity.client.ts](file:///d:/avyro1/app/plugins/clarity.client.ts).
  - O ID padrão é exposto em `runtimeConfig.public.microsoftClarityId`, permitindo customização via variável de ambiente `MICROSOFT_CLARITY_ID` com fallback para `'z0y9ky79tm'`.
- **Criação de Novas Páginas e Manutenção:**
  - **Nunca remover nem desabilitar** o script global do Microsoft Clarity.
  - Novas páginas criadas em `app/pages/` (sejam landing pages, fluxos de campanha ou painéis) herdam automaticamente o rastreamento do Clarity.
  - Ao configurar `useHead` ou `useSeoMeta` em novas páginas, certifique-se de não sobrescrever ou bloquear os scripts do `head` global.
  - Caso uma página ou template utilize renderização isolada (ex.: layout customizado sem o head padrão ou iframe/preview), garanta explicitamente a inclusão da tag do Clarity.
  - Caso precise acionar eventos customizados no Clarity no lado do cliente, use com segurança verificando `if (typeof window !== 'undefined' && (window as any).clarity)`.
