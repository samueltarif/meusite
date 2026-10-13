<script setup lang="ts">
useSeoMeta({
  title: 'Termos de Serviço | Avyro Growth Company',
  description: 'Termos de Serviço e Condições de Uso da plataforma e soluções da Avyro Growth Company. Saiba mais sobre direitos, deveres e políticas de contratação.',
  ogTitle: 'Termos de Serviço | Avyro Growth Company',
  ogDescription: 'Condições de uso, contratação e termos de serviço das soluções digitais e campanhas da Avyro Growth Company.',
  ogImage: 'https://www.avyro.com.br/favicon.png'
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
            Termos e Condições Gerais
          </span>
          <h1 class="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Termos de Serviço
          </h1>
          <p class="text-sm text-purple-200/80 max-w-2xl">
            Avyro Growth Company (CNPJ 66.818.617/0001-27). Última atualização: Outubro de 2026.
          </p>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-sm leading-relaxed text-slate-700">

        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">gavel</span>
            1. Aceitação dos Termos
          </h2>
          <p>
            Estes Termos de Serviço regem o uso do site e das aplicações da <strong>Avyro Growth Company</strong> ("Avyro", "nós"), inscrita no CNPJ sob o nº 66.818.617/0001-27, com sede virtual em <a href="https://www.avyro.com.br" class="text-purple-600 font-bold hover:underline">avyro.com.br</a>.
          </p>
          <p>
            Ao utilizar nossos serviços, criar uma conta, contratar planos ou interagir com nossas páginas de campanha (como a página de <NuxtLink to="/campanha/telas-mosquiteiras" class="text-purple-600 font-bold hover:underline">campanhas comerciais de parceiros</NuxtLink>), você manifesta sua concordância integral com estes termos e com a nossa <NuxtLink to="/politica-de-privacidade" class="text-purple-600 font-bold hover:underline">Política de Privacidade</NuxtLink>.
          </p>
        </section>

        <hr class="border-slate-100" />

        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">layers</span>
            2. Descrição dos Serviços
          </h2>
          <p>A Avyro desenvolve soluções digitais completas para empresas e profissionais, incluindo:</p>
          <ul class="list-disc list-inside space-y-1.5 pl-2">
            <li>Criação de websites profissionais, páginas institucionais e páginas de Link-in-Bio;</li>
            <li>Desenvolvimento e hospedagem de landing pages interativas de alta conversão para campanhas publicitárias;</li>
            <li>Automação de atendimento e integrações autorizadas via Meta Graph API e Google Ads;</li>
            <li>Sistemas de gestão de leads e orçamentos para parceiros comerciais homologados.</li>
          </ul>
        </section>

        <hr class="border-slate-100" />

        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">campaign</span>
            3. Campanhas Específicas e Parceiros Homologados
          </h2>
          <p>
            Para páginas de campanhas específicas operadas em nossa infraestrutura (por exemplo, a campanha da parceira GMK para Telas Mosquiteiras em Alumínio), aplicam-se regras complementares específicas de produto, garantia e visita técnica, acessíveis diretamente na página de <NuxtLink to="/campanha/telas-mosquiteiras/termos-de-servico" class="text-purple-600 font-bold hover:underline">Termos de Serviço da Campanha GMK</NuxtLink>.
          </p>
        </section>

        <hr class="border-slate-100" />

        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">security</span>
            4. Segurança, Uso Aceitável e Responsabilidades
          </h2>
          <p>
            O usuário concorda em utilizar as plataformas e canais disponibilizados pela Avyro exclusivamente para fins lícitos, abstendo-se de praticar engenharia reversa, tentar violar sistemas de segurança, disseminar malware ou fornecer informações fraudulentas em formulários e orçamentos.
          </p>
        </section>

        <hr class="border-slate-100" />

        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">mail</span>
            5. Contato e Suporte
          </h2>
          <p>Para dúvidas sobre nossos termos ou solicitações de suporte, entre em contato:</p>
          <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <p class="font-bold text-sm">Avyro Growth Company</p>
            <p class="text-xs text-slate-300 font-mono">CNPJ: 66.818.617/0001-27</p>
            <p class="text-xs text-purple-300">E-mail: <a href="mailto:samuel.tarif@gmail.com" class="underline font-bold">samuel.tarif@gmail.com</a></p>
            <p class="text-xs text-purple-300">WhatsApp: (11) 95137-2631</p>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>
