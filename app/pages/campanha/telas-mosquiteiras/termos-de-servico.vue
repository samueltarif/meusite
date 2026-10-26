<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Termos de Serviço | GMK Telas Mosquiteiras',
  description: 'Termos de Serviço da campanha de Telas Mosquiteiras em Alumínio Sob Medida GMK. Condições de uso, orçamento, visita técnica gratuita e 2 anos de garantia.',
  ogTitle: 'Termos de Serviço | GMK Telas Mosquiteiras',
  ogDescription: 'Conheça os Termos de Serviço da GMK e Avyro para a campanha de telas mosquiteiras em alumínio sob medida.',
  themeColor: '#010133'
})

const LOGO = 'https://media.avyro.com.br/imagens%20campanha%20gmk/otimizadas/logo-gmk.webp'
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
            <p class="text-xs text-white/70 mt-1">Condições Gerais de Uso e Prestação de Serviços</p>
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <h1 class="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Termos de Serviço
          </h1>
          <p class="text-sm text-sky-100/80 max-w-2xl">
            Regras de uso da plataforma de orçamento, visita técnica gratuita e garantia de 2 anos para telas mosquiteiras em alumínio.
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
              <CampanhaIcon name="description" :size="20" />
            </span>
            1. Aceitação e Visão Geral
          </h2>
          <p>
            Bem-vindo à página de campanha de Telas Mosquiteiras em Alumínio Sob Medida da <strong>GMK</strong>, acessível através do endereço <a href="https://www.avyro.com.br/campanha/telas-mosquiteiras" class="text-sky-700 font-bold hover:underline">avyro.com.br/campanha/telas-mosquiteiras</a>, mantida e operada tecnicamente pela <strong>Avyro Growth Company</strong> (CNPJ 66.818.617/0001-27).
          </p>
          <p>
            Ao utilizar nosso quiz interativo de orçamento, solicitar atendimento via WhatsApp ou agendar uma visita técnica presencial, você concorda expressamente com os presentes Termos de Serviço e com nossa <NuxtLink to="/campanha/telas-mosquiteiras/politica-de-privacidade" class="text-sky-700 font-bold hover:underline">Política de Privacidade</NuxtLink>. Caso não concorde com qualquer disposição aqui estabelecida, recomendamos que não utilize a plataforma.
          </p>
        </section>

        <hr class="border-slate-100">

        <!-- Section 2 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="hardware" :size="20" />
            </span>
            2. Objeto e Serviços Oferecidos
          </h2>
          <p>
            A GMK atua na fabricação sob medida, fornecimento e instalação profissional de telas mosquiteiras com perfis de alumínio reforçado e malha de fibra de vidro revestida em PVC (lavável e resistente a intempéries).
          </p>
          <p>Os serviços abrangem soluções personalizadas para:</p>
          <ul class="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Janelas:</strong> Telas de correr em alumínio, fixas, removíveis e basculantes;</li>
            <li><strong>Portas de Giro:</strong> Portas mosquiteiras de abrir com dobradiças e fechamento automático com mola ou ímã;</li>
            <li><strong>Portas-Balcão e Sacadas:</strong> Folhas deslizantes para grandes vãos;</li>
            <li><strong>Casas e Apartamentos Completos:</strong> Projetos integrados para todas as aberturas do imóvel.</li>
          </ul>
        </section>

        <hr class="border-slate-100">

        <!-- Section 3 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="event_available" :size="20" />
            </span>
            3. Estimativa de Orçamento e Visita Técnica Gratuita
          </h2>
          <p>
            As estimativas de preços fornecidas inicialmente pelo quiz ou pelo atendimento preliminar no WhatsApp são estimativas de referência com base nas quantidades e tipos de vão declarados pelo usuário.
          </p>
          <div class="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
            <h3 class="font-bold text-sky-950 flex items-center gap-1.5 text-sm">
              <CampanhaIcon name="straighten" :size="18" />
              Compromisso da Visita Técnica GMK:
            </h3>
            <ul class="list-disc list-inside space-y-1 text-xs text-sky-900">
              <li><strong>Gratuidade Total:</strong> A visita técnica para medição exata no local é 100% gratuita dentro da região metropolitana atendida e sem nenhuma obrigação de contratação;</li>
              <li><strong>Validação Precisa:</strong> O técnico avalia o nivelamento do vão, os trilhos existentes e apresenta amostras reais das cores dos perfis de alumínio (branco, preto, bronze, fosco);</li>
              <li><strong>Orçamento Definitivo:</strong> O valor final formal e a forma de pagamento são acordados com total transparência após a medição no local.</li>
            </ul>
          </div>
        </section>

        <hr class="border-slate-100">

        <!-- Section 4 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="verified_user" :size="20" />
            </span>
            4. Garantia de 2 Anos
          </h2>
          <p>
            A GMK concede <strong>2 (dois) anos de garantia</strong> integral para as telas mosquiteiras instaladas pela equipe autorizada, contados a partir da data de entrega da instalação.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div class="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
              <p class="font-bold text-emerald-900 flex items-center gap-1">
                <CampanhaIcon name="check_circle" :size="16" /> O que a garantia cobre:
              </p>
              <ul class="list-disc list-inside space-y-1 text-emerald-800">
                <li>Defeitos de fabricação dos perfis de alumínio;</li>
                <li>Roldanas, travas, borrachas e escovas de vedação;</li>
                <li>Problemas de fixação e montagem realizados pela equipe.</li>
              </ul>
            </div>
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <p class="font-bold text-slate-900 flex items-center gap-1">
                <CampanhaIcon name="cancel" :size="16" /> O que a garantia não cobre:
              </p>
              <ul class="list-disc list-inside space-y-1 text-slate-600">
                <li>Cortes mecânicos provocados por facas, tesouras ou animais domésticos na malha;</li>
                <li>Impactos físicos severos ou reformas posteriores que desalinhem as esquadrias;</li>
                <li>Uso de solventes químicos abrasivos na limpeza dos perfis.</li>
              </ul>
            </div>
          </div>
        </section>

        <hr class="border-slate-100">

        <!-- Section 5 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="person" :size="20" />
            </span>
            5. Obrigações e Responsabilidades do Usuário
          </h2>
          <p>Para o adequado atendimento, o usuário se compromete a:</p>
          <ul class="list-disc list-inside space-y-1.5 pl-2 text-xs">
            <li>Fornecer informações de contato (nome e WhatsApp) verídicas e atualizadas;</li>
            <li>Garantir acesso ao local onde as medições ou instalações serão realizadas no horário combinado;</li>
            <li>Notificar a equipe com antecedência razoável caso necessite reagendar a data da visita técnica.</li>
          </ul>
        </section>

        <hr class="border-slate-100">

        <!-- Section 6 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="copyright" :size="20" />
            </span>
            6. Propriedade Intelectual
          </h2>
          <p>
            Todos os direitos sobre a landing page, logotipos, fotos de projetos reais, depoimentos, códigos, marcas GMK e Avyro Growth Company são protegidos pela legislação de propriedade intelectual e direitos autorais. É vedada a reprodução, cópia, distribuição ou exploração comercial de qualquer conteúdo sem prévia autorização por escrito.
          </p>
        </section>

        <hr class="border-slate-100">

        <!-- Section 7 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="gavel" :size="20" />
            </span>
            7. Legislação Aplicável e Foro
          </h2>
          <p>
            Estes Termos de Serviço são regidos e interpretados em conformidade com as leis da República Federativa do Brasil, em particular o <strong>Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong> e o <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong>.
          </p>
          <p>
            Fica eleito o foro da Comarca do domicílio do consumidor ou da capital do Estado para dirimir quaisquer controvérsias decorrentes destes termos.
          </p>
        </section>

        <hr class="border-slate-100">

        <!-- Section 8 -->
        <section class="space-y-3">
          <h2 class="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <CampanhaIcon name="help" :size="20" />
            </span>
            8. Central de Atendimento e Suporte
          </h2>
          <p>
            Em caso de dúvidas, solicitações de garantia ou esclarecimentos sobre estes Termos de Serviço, estamos à disposição:
          </p>
          <div class="p-5 rounded-2xl bg-[#010133] text-white space-y-2">
            <p class="font-bold text-sm">GMK Telas Mosquiteiras · Avyro Growth Company</p>
            <p class="text-xs text-slate-300 font-mono">CNPJ: 66.818.617/0001-27</p>
            <p class="text-xs text-sky-300">
              E-mail: <a href="mailto:samuel.tarif@gmail.com" class="underline font-bold">samuel.tarif@gmail.com</a>
            </p>
            <p class="text-xs text-sky-300">WhatsApp Comercial: (11) 95137-2631</p>
            <p class="text-xs text-slate-400 pt-1">
              Página oficial: <a href="https://www.avyro.com.br/campanha/telas-mosquiteiras" class="underline text-sky-200">https://www.avyro.com.br/campanha/telas-mosquiteiras</a>
            </p>
          </div>
        </section>

        <!-- Links no rodapé interno -->
        <div class="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <NuxtLink to="/campanha/telas-mosquiteiras/politica-de-privacidade" class="font-bold text-sky-700 hover:underline">
            ← Consulte também nossa Política de Privacidade
          </NuxtLink>
          <NuxtLink to="/campanha/telas-mosquiteiras" class="hover:text-slate-900">
            © {{ new Date().getFullYear() }} GMK · Telas Mosquiteiras Sob Medida
          </NuxtLink>
        </div>

      </div>
    </main>
  </div>
</template>
