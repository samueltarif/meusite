<script setup lang="ts">
useSeoMeta({
  title: 'Política de Privacidade | Avyro Growth Company',
  description: 'Política de Privacidade da Avyro Growth Company. Saiba como coletamos, utilizamos e protegemos seus dados e integrações com o Instagram em conformidade com a LGPD e diretrizes da Meta.',
  ogTitle: 'Política de Privacidade | Avyro Growth Company',
  ogDescription: 'Saiba como a Avyro trata e protege seus dados e integrações do Instagram em conformidade com a LGPD e políticas da Meta.',
  ogImage: 'https://www.avyro.com.br/favicon.png',
})
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-800">
    <!-- Header Hero Banner -->
    <header class="bg-[#060318] text-white border-b border-purple-900/30 px-6 py-12">
      <div class="max-w-4xl mx-auto space-y-4">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white transition-colors">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Voltar para o site principal
        </NuxtLink>

        <div class="space-y-2">
          <span class="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            Conformidade LGPD & Meta Platform Policies
          </span>
          <h1 class="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Política de Privacidade
          </h1>
          <p class="text-sm text-purple-200/80 max-w-2xl">
            Avyro Growth Company (CNPJ 66.818.617/0001-27). Última atualização: 30 de Julho de 2026.
          </p>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700">
        
        <!-- Section 1 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">shield</span>
            1. Introdução e Compromisso com a Privacidade
          </h2>
          <p>
            A <strong>Avyro Growth Company</strong> ("Avyro", "nós" ou "nosso"), inscrita no CNPJ sob o nº 66.818.617/0001-27, opera o site oficial <a href="https://www.avyro.com.br" class="text-purple-600 font-bold hover:underline">avyro.com.br</a> e a plataforma de criação de sites, páginas de Link-in-Bio e automações para redes sociais.
          </p>
          <p>
            Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, bem como seus direitos em relação a esses dados, em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</strong> e as políticas e diretrizes da <strong>Meta Platform (Facebook/Instagram APIs)</strong>.
          </p>
        </section>

        <hr class="border-slate-100" />

        <!-- Section 2 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">database</span>
            2. Coleta de Informações
          </h2>
          <p>Coletamos informações necessárias para a prestação e aprimoramento de nossos serviços SaaS:</p>
          <ul class="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Informações de Cadastro:</strong> Nome completo, endereço de e-mail, senha criptografada e dados de contato.</li>
            <li><strong>Informações do Perfil Público:</strong> Título da bio, links personalizados, fotos de avatar, imagens de produtos do catálogo e preferências estéticas de temas.</li>
            <li><strong>Dados de Acesso e Navegação:</strong> Endereço IP, tipo de navegador, sistema operacional, páginas visitadas e dados de cliques obtidos via ferramentas de analytics integradas.</li>
            <li><strong>Dados de Pagamento:</strong> Processados de forma segura e tokenizada via parceiros homologados (Stripe e Mercado Pago). A Avyro não armazena dados completos de cartão de crédito.</li>
          </ul>
        </section>

        <hr class="border-slate-100" />

        <!-- Section 3 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">smart_toy</span>
            3. Integração com Instagram e Meta Graph API
          </h2>
          <p>
            Para oferecer o recurso de <strong>Instagram Auto Reply</strong> e captura de leads, a Avyro utiliza as APIs oficiais da <strong>Meta Graph API (Instagram Login for Business)</strong> e Webhooks.
          </p>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <h3 class="font-bold text-purple-950 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-purple-600 text-base">verified</span>
              Princípios de Proteção de Dados da API do Instagram:
            </h3>
            <ul class="list-disc list-inside space-y-1 text-purple-900 text-xs">
              <li><strong>Finalidade Exclusiva:</strong> Os dados de mensagens diretas (DMs) e comentários recebidos via Webhook da Meta são processados exclusivamente para executar as regras de resposta automática por palavra-chave configuradas ativamente pelo usuário.</li>
              <li><strong>Proteção de Tokens de Acesso:</strong> Os tokens de acesso (Access Tokens) concedidos são mantidos estritamente em ambiente server-side seguro, criptografados e protegidos por políticas RLS (Row Level Security). NUNCA expomos ou enviamos tokens para o navegador/frontend.</li>
              <li><strong>Não Comercialização de Dados:</strong> A Avyro NUNCA vende, aluga, compartilha ou transfere dados obtidos das APIs da Meta a terceiros para fins de publicidade, marketing de terceiros ou treinamento de modelos de inteligência artificial.</li>
              <li><strong>Anti-Loop e Segurança:</strong> Implementamos mecanismos de segurança que impedem respostas em cascata ou uso indevido das APIs de mensagens.</li>
            </ul>
          </div>
        </section>

        <hr class="border-slate-100" />

        <!-- Section 4 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">lock</span>
            4. Armazenamento e Segurança dos Dados
          </h2>
          <p>
            Empregamos medidas técnicas e organizacionais avançadas para proteger suas informações contra acesso não autorizado, perda, alteração ou destruição:
          </p>
          <ul class="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Banco de Dados Criptografado (Supabase):** Comunicação via SSL/TLS com Row Level Security (RLS) habilitado para garantir isolamento multi-tenant absoluto entre usuários.</li>
            <li><strong>Armazenamento de Mídia (Cloudflare R2):** Upload de arquivos e fotos em infraestrutura isolada com links seguros.</li>
            <li><strong>Execução Serverless (Vercel):** Handlers de API com proteção contra ataques e sanitização de requisições.</li>
          </ul>
        </section>

        <hr class="border-slate-100" />

        <!-- Section 5 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">gavel</span>
            5. Direitos do Titular dos Dados (LGPD)
          </h2>
          <p>Conforme a LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:</p>
          <ul class="list-disc list-inside space-y-1.5 pl-2">
            <li>Confirmar a existência de tratamento de dados;</li>
            <li>Acessar seus dados pessoais a qualquer momento pelo painel de controle;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a eliminação dos dados pessoais ou revogação do consentimento.</li>
          </ul>
        </section>

        <hr class="border-slate-100" />

        <!-- Section 6: Data Deletion Instructions -->
        <section id="exclusao-de-dados" class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">delete_forever</span>
            6. Instruções de Exclusão de Dados e Desconexão do Instagram
          </h2>
          <p>
            Respeitamos o seu controle total sobre seus dados e integrações. Se você desejar remover sua conta ou desconectar o Instagram da plataforma Avyro, siga as instruções abaixo:
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 class="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                <span class="material-symbols-outlined text-purple-600 text-base">link_off</span>
                Opção A: Desconectar Instagram via Painel
              </h3>
              <ol class="list-decimal list-inside text-xs space-y-1 text-slate-600">
                <li>Acesse seu painel em <a href="https://www.avyro.com.br/dashboard/instagram" class="text-purple-600 font-bold hover:underline">/dashboard/instagram</a>;</li>
                <li>Clique no botão <strong>Desconectar</strong> no card de status da conta;</li>
                <li>Os tokens de acesso serão invalidados e desativados imediatamente no banco de dados.</li>
              </ol>
            </div>

            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 class="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                <span class="material-symbols-outlined text-purple-600 text-base">mail</span>
                Opção B: Solicitação de Exclusão por E-mail
              </h3>
              <p class="text-xs text-slate-600">
                Para solicitar a exclusão definitiva e permanente de todo o seu cadastro, conta e histórico de dados da Avyro, envie um e-mail para:
              </p>
              <a href="mailto:contato@avyro.com.br?subject=Solicitação de Exclusão de Dados - LGPD" class="inline-block font-mono text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200">
                contato@avyro.com.br
              </a>
              <p class="text-[11px] text-slate-400">Sua solicitação será atendida no prazo máximo de 5 dias úteis.</p>
            </div>
          </div>
        </section>

        <hr class="border-slate-100" />

        <!-- Section 7 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">cookie</span>
            7. Cookies e Tecnologias de Sessão
          </h2>
          <p>
            Utilizamos cookies essenciais estritamente necessários para manter sua sessão de autenticação ativa e segura (tokens de sessão do Supabase Auth). Não utilizamos cookies de terceiros para rastreamento invasivo sem o seu consentimento.
          </p>
        </section>

        <hr class="border-slate-100" />

        <!-- Section 8 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">mail</span>
            8. Contato e Encarregado de Dados (DPO)
          </h2>
          <p>
            Se você tiver dúvidas, solicitações ou esclarecimentos sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, entre em contato com nossa equipe de suporte:
          </p>
          <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <p class="font-bold text-sm">Avyro Growth Company</p>
            <p class="text-xs text-slate-300 font-mono">CNPJ: 66.818.617/0001-27</p>
            <p class="text-xs text-purple-300">E-mail: <a href="mailto:contato@avyro.com.br" class="underline font-bold">contato@avyro.com.br</a></p>
            <p class="text-xs text-purple-300">Suporte WhatsApp: (11) 95137-2631</p>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>
