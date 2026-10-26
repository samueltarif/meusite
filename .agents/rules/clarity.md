---
description: Regra obrigatória de rastreamento do Microsoft Clarity em todas as páginas e novas páginas do site
globs: ["app/pages/**", "app/layouts/**", "nuxt.config.ts"]
---

# Rastreamento Microsoft Clarity

- O rastreamento do **Microsoft Clarity** (`z0y9ky79tm`) deve estar ativo em **todas as páginas do site e em novas páginas**.
- O script está configurado globalmente em `nuxt.config.ts` (`app.head.script`) e no plugin `app/plugins/clarity.client.ts`.
- Qualquer nova página ou alteração de layout deve preservar este rastreamento e não bloquear o carregamento do script do Clarity.
