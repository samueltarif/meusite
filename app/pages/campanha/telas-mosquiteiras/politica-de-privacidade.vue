<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Política de Privacidade | GMK Telas Mosquiteiras',
  description: 'Política de Privacidade da campanha de Telas Mosquiteiras em Alumínio Sob Medida GMK. Saiba como tratamos seus dados e respeitamos a LGPD e as diretrizes do Google.',
  ogTitle: 'Política de Privacidade | GMK Telas Mosquiteiras',
  ogDescription: 'Saiba como a GMK e a Avyro tratam e protegem seus dados na campanha de telas mosquiteiras sob medida em conformidade com a LGPD.',
  themeColor: '#010133'
})

const LOGO = encodeURI('/imagens campanha gmk/otimizadas/logo-gmk.webp')
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-800">
    <!-- Header Hero Banner -->
    <header class="bg-[#010133] text-white border-b border-white/10 px-6 py-10 sm:py-12">
      <div class="max-w-4xl mx-auto space-y-4">
        <NuxtLink
          to="/campanha/telas-mosquiteiras"
          class="inline-flex items-center gap-2 text-xs font-bold text-sky-300 hover:text-white transition-colors"
        >
          <CampanhaIcon name="arrow_back" :size="16" />
          Voltar para a página da campanha GMK
        </NuxtLink>

        <div class="flex items-center gap-4 pt-2">
          <img :src="LOGO" alt="GMK" width="120" height="100" class="h-12 w-auto object-contain brightness-110">
          <div class="border-l border-white/20 pl-4">
            <span class="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-sky-200 text-[11px] font-semibold uppercase tracking-wider">
              GMK Telas Mosquiteiras · Avyro
            </span>
            <p class="text-xs text-white/70 mt-1">Conformidade com a LGPD & Diretrizes do Google</p>
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <h1 class="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Política de Privacidade
          </h1>
          <p class="text-sm text-sky-100/80 max-w-2xl">
            Campanha Telas Mosquiteiras em Alumínio Sob Medida. Operada tecnicamente pela Avyro Growth Company (CNPJ 66.818.617/0001-27) para GMK.
          </p>
          <p class="text-xs text-white/50">
            Última atualização: Outubro de 2026.
          </p>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700">

        <!-- Section 1 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="shield" :size="20" />
            </span>
            1. Identificação e Compromisso com a Privacidade
          </h2>
          <p>
            Esta Política de Privacidade aplica-se à página oficial da campanha de Telas Mosquiteiras em Alumínio Sob Medida da <strong>GMK</strong>, disponível no endereço <a href="https://www.avyro.com.br/campanha/telas-mosquiteiras" class="text-sky-700 font-bold hover:underline">avyro.com.br/campanha/telas-mosquiteiras</a>, operada tecnicamente pela <strong>Avyro Growth Company</strong> (CNPJ sob o nº 66.818.617/0001-27).
          </p>
          <p>
            Temos o compromisso de proteger sua privacidade e assegurar total transparência no tratamento das informações coletadas durante sua interação com nosso quiz interativo, solicitação de orçamentos e agendamento de visitas técnicas, em rigorosa observância à <strong>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</strong> e às políticas de privacidade e proteção ao usuário do Google.
          </p>
        </section>

        <hr class="border-slate-100">

        <!-- Section 2 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="quiz" :size="20" />
            </span>
            2. Dados Coletados e Finalidade do Tratamento
          </h2>
          <p>
            Coletamos apenas os dados estritamente necessários para viabilizar a elaboração de estimativas comerciais sob medida, atendimento personalizado e realização da visita técnica gratuita:
          </p>
          <ul class="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Dados de Contato:</strong> Nome e telefone celular com DDD (WhatsApp). <em>Finalidade:</em> entrar em contato em até 15 minutos (ou no próximo horário comercial) para apresentar a estimativa de valores, tirar dúvidas e confirmar o agendamento da visita técnica gratuita.
            </li>
            <li>
              <strong>Características do Projeto:</strong> Tipo de vão/abertura (janela de correr, basculante, porta de giro, porta-balcão/sacada ou residência inteira) e quantidade estimada de telas. <em>Finalidade:</em> direcionar o catálogo técnico adequado e estimar a quantidade de perfis de alumínio e malha mosquiteira.
            </li>
            <li>
              <strong>Localização Aproximada:</strong> Bairro, condomínio ou cidade informados voluntariamente no quiz. <em>Finalidade:</em> verificar se a residência ou empresa está dentro do raio de cobertura logística de visitas e instalação presencial da equipe da GMK.
            </li>
          </ul>
          <p class="text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-600">
            <strong>Base Legal (LGPD):</strong> O tratamento desses dados fundamenta-se no consentimento expresso do titular (Art. 7º, I) e na execução de procedimentos preliminares a pedido do próprio titular para formulação de proposta contratual e comercial (Art. 7º, V da Lei 13.709/2018).
          </p>
        </section>

        <hr class="border-slate-100">

        <!-- Section 3 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="chat" :size="20" />
            </span>
            3. Comunicação via WhatsApp e Atendimento
          </h2>
          <p>
            Ao preencher o quiz ou clicar nos botões de atendimento direto via WhatsApp, você autoriza nossa equipe comercial a iniciar uma conversa para tratar exclusivamente da sua solicitação de orçamento de telas mosquiteiras.
          </p>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-xs">
            <li>Não enviamos mensagens em massa não solicitadas (SPAM).</li>
            <li>Não repassamos seu número de telefone a outras empresas ou listas de contatos de terceiros.</li>
            <li>Você pode solicitar o encerramento do atendimento e a remoção de qualquer contato futuro respondendo diretamente na conversa a qualquer momento.</li>
          </ul>
        </section>

        <hr class="border-slate-100">

        <!-- Section 4 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="analytics" :size="20" />
            </span>
            4. Medição de Campanhas e Cookies do Google Ads
          </h2>
          <p>
            Para avaliar o desempenho dos nossos anúncios no Google e entender a eficácia de nossas campanhas de marketing, utilizamos recursos de medição de conversão:
          </p>
          <div class="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 text-xs text-slate-700">
            <h3 class="font-bold text-sky-950 flex items-center gap-1.5 text-sm">
              <CampanhaIcon name="verified_user" :size="18" />
              Diretrizes de Rastreamento Responsável:
            </h3>
            <ul class="list-disc list-inside space-y-1">
              <li><strong>Identificadores de Campanha:</strong> Parâmetros de URL como <code>gclid</code>, <code>gbraid</code>, <code>wbraid</code> e parâmetros UTM são mantidos temporariamente na sessão do seu navegador apenas para atribuir o clique ao anúncio correto.</li>
              <li><strong>Eventos Medidos:</strong> Medimos apenas eventos de navegação, como o clique para abrir o WhatsApp e o envio do formulário/quiz. O teor privado de mensagens trocadas no WhatsApp não é compartilhado com plataformas de anúncios.</li>
              <li><strong>Privacidade Preservada:</strong> Não utilizamos cookies invasivos para rastrear sua atividade fora de nossas páginas de campanha. A personalização de anúncios de terceiros baseada em dados pessoais identificáveis fica desativada.</li>
            </ul>
          </div>
        </section>

        <hr class="border-slate-100">

        <!-- Section 5 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="lock" :size="20" />
            </span>
            5. Armazenamento Seguro e Retenção de Dados
          </h2>
          <p>
            Seus dados são armazenados em infraestrutura de banco de dados protegida com criptografia de ponta a ponta em trânsito (protocolos SSL/TLS) e políticas rigorosas de controle de acesso (Row Level Security - RLS).
          </p>
          <p>
            Os dados de leads e orçamentos são retidos apenas pelo tempo necessário para a realização do atendimento comercial, conclusão da medição e garantia do serviço prestado (2 anos de garantia). Decorrido o período ou após solicitação do cliente, os dados são descartados de maneira segura.
          </p>
        </section>

        <hr class="border-slate-100">

        <!-- Section 6 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="gavel" :size="20" />
            </span>
            6. Seus Direitos (LGPD) e Como Solicitar Exclusão de Dados
          </h2>
          <p>
            Em conformidade com o artigo 18 da LGPD, você tem direito a, a qualquer momento e mediante requisição:
          </p>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-xs">
            <li>Confirmar a existência de tratamento de seus dados;</li>
            <li>Acessar seus dados arquivados;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a eliminação completa dos dados pessoais coletados com o seu consentimento.</li>
          </ul>

          <div class="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 class="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
              <CampanhaIcon name="delete_forever" :size="18" />
              Como solicitar a exclusão de seus dados:
            </h3>
            <p class="text-xs text-slate-600">
              Para revogar seu consentimento ou solicitar a exclusão de seu número de telefone e registros de orçamento, envie um e-mail com o assunto <strong>"Exclusão de Dados - Campanha GMK"</strong> para:
            </p>
            <a
              href="mailto:samuel.tarif@gmail.com?subject=Exclusão de Dados - Campanha GMK"
              class="inline-block font-mono text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200"
            >
              samuel.tarif@gmail.com
            </a>
            <p class="text-[11px] text-slate-400">
              Sua solicitação de remoção é processada em até 5 dias úteis sem qualquer custo.
            </p>
          </div>
        </section>

        <hr class="border-slate-100">

        <!-- Section 7 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="contact_support" :size="20" />
            </span>
            7. Contato e Encarregado de Proteção de Dados (DPO)
          </h2>
          <p>
            Para esclarecer dúvidas sobre esta Política de Privacidade ou sobre as práticas de proteção de dados adotadas pela GMK e pela Avyro Growth Company, entre em contato:
          </p>
          <div class="p-5 rounded-2xl bg-[#010133] text-white space-y-2">
            <p class="font-bold text-sm">GMK Telas Mosquiteiras · Avyro Growth Company</p>
            <p class="text-xs text-slate-300 font-mono">CNPJ: 66.818.617/0001-27</p>
            <p class="text-xs text-sky-300">
              E-mail do DPO: <a href="mailto:samuel.tarif@gmail.com" class="underline font-bold">samuel.tarif@gmail.com</a>
            </p>
            <p class="text-xs text-sky-300">Atendimento WhatsApp: (11) 95137-2631</p>
            <p class="text-xs text-slate-400 pt-1">
              Endereço da campanha: <a href="https://www.avyro.com.br/campanha/telas-mosquiteiras" class="underline text-sky-200">https://www.avyro.com.br/campanha/telas-mosquiteiras</a>
            </p>
          </div>
        </section>

        <!-- Links no rodapé interno -->
        <div class="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <NuxtLink to="/campanha/telas-mosquiteiras/termos-de-servico" class="font-bold text-sky-700 hover:underline">
            Consulte também nossos Termos de Serviço →
          </NuxtLink>
          <NuxtLink to="/campanha/telas-mosquiteiras" class="hover:text-slate-900">
            © {{ new Date().getFullYear() }} GMK · Telas Mosquiteiras Sob Medida
          </NuxtLink>
        </div>

      </div>
    </main>
  </div>
</template>
