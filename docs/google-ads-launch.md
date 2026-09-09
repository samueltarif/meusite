# Avyro — preparação de campanhas

## Páginas de destino

Use /criacao-de-sites como índice e /criacao-de-sites/{segmento} para campanhas segmentadas. Segmentos: floriculturas, marcenarias, arquitetos, industrias, fotografos, climatizacao, odontologia, contabilidade, engenharia, oficinas e beleza. Cada página tem conteúdo setorial, dúvidas próprias, demonstração relacionada e contato comercial com a Avyro. As páginas /exemplos continuam noindex, follow.

## Configuração do domínio

NUXT_PUBLIC_SITE_URL=https://avyro.com.br

Esse é o domínio padrão que já aparecia nos metadados da home. Confirme o domínio principal e configure redirecionamento 301 da variante www/sem www na hospedagem antes de publicar. Canonical, sitemap e robots usam o mesmo valor de configuração. A entrega desta tarefa é local, sem publicação nem submissão ao Search Console.

## Medição

Variáveis pendentes do proprietário da conta:

NUXT_PUBLIC_GOOGLE_ADS_ID=AW-<ID real>
NUXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=<rótulo real>

Não use exemplos como valores de produção. O rastreamento fica desativado sem uma configuração válida e em localhost/127.0.0.1. Não há ID ou evento de conversão inventado.

A ação implementada é exclusivamente clique para o WhatsApp comercial da Avyro. Não é conversa confirmada, lead qualificado, orçamento ou venda. Configure essa ação como secundária para observação até existir uma estratégia de objetivos definida na conta; não some o mesmo clique por outra tag. Leads efetivos exigem confirmação no CRM/atendimento e integração ou importação própria, fora da capacidade do clique no navegador.

Modo básico de consentimento: a tag do Google só carrega após a permissão do visitante. Recusar mantém o site e os links funcionando. A preferência pode ser alterada pela interface. Personalização de anúncios e analytics permanecem negados. Não enviamos texto de mensagem, nome ou telefone do visitante em parâmetros personalizados. A tag Google usa seus próprios mecanismos de atribuição após consentimento. Os destinos abrem em outra aba, sem atrasar o contato.

## Validação após conectar e publicar

1. Conferir domínio principal, canonical, sitemap e robots na hospedagem.
2. Medir desempenho mobile com PageSpeed Insights da versão publicada; o build local não equivale a métricas reais de Core Web Vitals.
3. No Tag Assistant, conferir que não há tag antes do consentimento, que recusar impede a conversão e que um clique autorizado dispara somente a ação configurada.
4. Conferir a recepção do evento no Google Ads e a categoria secundária da ação de clique.
5. Enviar sitemap ao Search Console e acompanhar indexação das páginas comerciais.

## SEO e carregamento

Metadados sociais completos, cartão 1200×630, canonical sem parâmetros de campanha, dados estruturados Organization/Service sem preços ou avaliações inventadas, sitemap das 14 páginas comerciais e rotas inexistentes com 404. Fontes de personalização do restante do aplicativo deixaram de ser carregadas na campanha; o import CSS duplicado foi removido. Fotografias secundárias usam lazy loading; o 3D continua carregando apenas após interação.

Referências técnicas: https://developers.google.com/tag-platform/security/guides/consent e https://support.google.com/google-ads/answer/6331304.
