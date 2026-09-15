# SEO nacional da Avyro

## Marca e endereços

Recomendação: manter **Avyro** e **avyro.com.br**. Usar “Avyro — Criação de sites profissionais” como descrição comercial, mantendo o nome da marca consistente. Não foi feita alteração de domínio, redirecionamento de produção ou publicação nesta revisão.

A palavra-chave no domínio, isoladamente, tem pouco efeito no posicionamento. Uma troca exigiria uma migração com redirecionamentos, atualização dos links e acompanhamento da indexação. Não há evidência de benefício que justifique isso agora.

Conservar `/criacao-de-sites`, seus segmentos e `/modelos-site`. As novas URLs atendem intenções diferentes:

| URL | Necessidade atendida |
| --- | --- |
| `/` | Conhecer a Avyro e a criação de sites para empresas |
| `/criacao-de-sites` | Escolher uma solução por segmento |
| `/criacao-de-landing-pages` | Criar uma página para uma oferta ou campanha |
| `/manutencao-de-sites` | Atualizar e acompanhar um site existente |
| `/sites-com-painel-administrativo` | Administrar conteúdo com autonomia |

## Implementado no código

- H1 e descrição da home com o serviço explícito; atendimento online nacional explicado em conteúdo visível.
- Três páginas com orientações próprias, preparação do briefing, limites de escopo e links relacionados.
- Navegação de serviços na home e no rodapé.
- Dados estruturados WebSite e Organization na home, BreadcrumbList nas páginas comerciais e Service nas novas páginas. Esses dados descrevem o conteúdo; não prometem apresentação especial no Google.
- Sitemap ampliado para 17 páginas comerciais; URLs de demonstração continuam fora dele.
- Canonicals sem parâmetros de campanha e metadados de compartilhamento preservados.

## Próximas ações após publicar

1. Validar qual host será o principal (`avyro.com.br` ou `www.avyro.com.br`). O projeto está configurado sem www. Confirmar no ambiente publicado que o outro host e HTTP redirecionam para a versão escolhida, sem ciclos. Não foi possível verificar o domínio pela ferramenta de pesquisa nesta revisão.
2. Verificar a propriedade de domínio no Google Search Console, enviar `/sitemap.xml` e inspecionar a home e as três páginas novas. Conferir o canonical escolhido pelo Google e eventuais bloqueios de indexação.
3. Medir Core Web Vitals e PageSpeed na versão publicada, especialmente em celular. Esta revisão não atribui pontuação de desempenho nem afirma ganho de posições.
4. Publicar estudos de projetos reais: problema inicial, decisões, telas autorizadas e resultados comprováveis. Identificar claramente os modelos demonstrativos e evitar apresentar empresas fictícias como clientes.
5. Criar conteúdo a partir de dúvidas comerciais reais: como preparar um catálogo industrial; quais informações enviar para o orçamento de um site; quando um painel é necessário. Revisar com quem executa o serviço e ligar cada conteúdo à solução correspondente.
6. Acompanhar páginas e consultas no Search Console: impressões, cliques, CTR e contatos orgânicos qualificados. Priorizar temas com demanda observada, sem assumir que um segmento tem o maior volume de pesquisa. Não há acesso às métricas nesta revisão.

Não criar dezenas de páginas iguais trocando apenas o nome da cidade. O atendimento nacional pode ser descrito em páginas úteis por serviço e segmento. Páginas locais só fazem sentido com conteúdo e atuação local reais. Não comprar links nem prometer primeira posição.

## Fontes

- [Guia de SEO do Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Nome do site na Pesquisa Google](https://developers.google.com/search/docs/appearance/site-names)
- [Políticas de spam: abuso de páginas de entrada](https://developers.google.com/search/docs/essentials/spam-policies)

Validação: build de produção concluído. Verificação HTTP da versão de produção aprovada nas 17 páginas comerciais: resposta 200, um H1, canonical sem UTM, metadados, dados estruturados, links para os serviços, sitemap e resposta 404 para segmento inexistente. Não foi realizada medição de desempenho nem validação visual em dispositivos nesta revisão.

Revisão: 14 de setembro de 2026. Alterações locais; publicação e Search Console pendentes.
