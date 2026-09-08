# Reformulação da campanha de sites

Prévia local: http://127.0.0.1:3000/

## Escopo
Home e catálogo de exemplos com orçamento personalizado por WhatsApp, manutenção mensal opcional e painel administrativo como possibilidade de contratação. Nenhum painel novo, agendamento real ou envio de cotação de equipamento foi implementado. O produto Link-in-Bio e suas rotas existentes permanecem separados da campanha.

## Referências de composição
- BellaNails: https://www.unhascariocas.com.br/ — serviços de beleza, fotografia e cuidado pessoal.
- ArchStudio: https://mk27.com/ — hierarquia editorial, fotografia ampla e apresentação de projetos.
- AutoElite: https://am.boschcarservice.com/br/pt/ — organização dos serviços e jornada de atendimento.
- Atlas Industrial: https://www.qualitecinstrumentos.com.br/ e https://www.wika.com/pt-br/pagina_inicial.WIKA — aplicações e famílias de produtos.
- Catálogo: https://catalogo-tecnico-qualitec.vercel.app/catalogo — consulta por produto e documentação técnica.

As quatro empresas demonstrativas não são clientes ou parceiros declarados. Fotografias ilustrativas; fontes dos arquivos em campaign-assets.json.

## Conferência de produtos
As fichas vinculadas prevalecem sobre resumos da página de referência. O regulador 591 foi identificado como Qualitec 591.250: entrada 250 bar, saída até 206 bar e temperatura −30 a +70 °C. O GDR tem limites de saída diferentes para GDR-500 e GDR-1000, indicados no resumo. Válvulas HEROSE mantêm o zero inicial do modelo; DN 20 não foi confundido com as conexões de saída.

BPRX: ficha Generant SA.SL.BPRX001.B.6342 disponibilizada pela HEROSE em https://products.herose.com/de/produkte/bprx.html. WIKA: fichas PM 02.12 (213.53) e PE 81.60 (A-10). As especificações são referências de demonstração; a configuração completa deve ser consultada nos PDFs originais.

## Verificação
- npm run build: compilação de produção.
- node scripts/verify-campaign.mjs: sete páginas, arquivos vinculados, ausência de preços e Link-in-Bio na campanha, busca por modelo/fabricante, acentos, famílias e resultados vazios.
- Validação automática sem teste visual ou interação manual no navegador.
- Publicação não realizada; entrega para revisão local.

## Modelos adicionais — setembro de 2026

Cinco modelos acrescentados; nove demonstrações disponíveis em /modelos-site. A home continua com quatro destaques para preservar a proposta clean, com acesso ao catálogo completo.

| Modelo | Referência consultada | Direção própria | Interação |
|---|---|---|---|
| Brisa / climatização | https://www.daikin.com.br/aplicacao-casa | Azul acinzentado, tipografia ampla, ambientes como ponto de entrada | Seleção de casa, negócio ou vários ambientes; conteúdo e imagem correspondentes |
| Serena / odontologia | https://www.oralsin.com.br/ | Verde sálvia, tipografia editorial, acolhimento e primeira visita | Exploração das áreas de cuidado sem diagnóstico ou agendamento real |
| Nexo / contabilidade | https://www.contabilizei.com.br/ | Verde profundo e lima, organização por momento do negócio | Roteiros distintos para abertura, migração e acompanhamento |
| Veio / marcenaria | https://florense.com.br/pt | Fotografia imersiva, tons de madeira, foco em ambientes e matéria | Seleção de ambientes e paleta de acabamentos independentes |
| Prumo / engenharia | https://www.infraconsultoria.com/ | Composição modular, contraste concreto/oliva, foco na execução | Etapas de obra com entregas específicas e FAQ |

Atlas Industrial recebeu comparação entre dois modelos com união dos campos técnicos, indicação de informação ausente e aviso para seleção do mesmo produto. A comparação não implica equivalência técnica.

As referências foram usadas para organização do conteúdo; não foram copiados textos, logotipos, avaliações, registros profissionais ou alegações de resultados. Fotografias são ilustrativas e suas fontes constam em campaign-assets.json. Não há preços, contato com empresas fictícias ou coleta de informações pessoais nos modelos.

Verificação adicional: node scripts/verify-sector-interactions.mjs confere a mudança de cada seleção, índices inválidos e comparação de características de produtos diferentes. O roteiro verify-campaign.mjs foi ampliado para 12 páginas.

## Seções exclusivas por demonstração

- Brisa: checklist interativo para preparar a visita, com progresso.
- Serena: preferências de acolhimento, com seleção múltipla.
- Nexo: quadro de organização com cartões que avançam de etapa e reinício.
- Veio: caderno de briefing por ambientes e prioridade.
- Prumo: linha de trabalho ilustrativa com faixas selecionáveis; períodos não representam prazos prometidos.
- ArchStudio: pontos exploráveis sobre fotografia de referência.
- BellaNails: caderno editorial de inspirações com composição assimétrica.
- AutoElite: diário local com data, quilometragem, validação e remoção de registros.
- Atlas: lista de produtos com quantidades, remoção e limpeza, sem enviar cotações.

Todas as interações permanecem locais à visita. Não foram adicionados serviços externos, autenticação ou armazenamento persistente. Testes adicionais cobrem validação e ordenação do diário, agrupamento de produtos, limites de quantidade e limpeza da lista.

## Lume — modelo para fotografia

Décima demonstração em /exemplos/fotografia, integrada ao catálogo de modelos. Direção visual: fotografia ampla, fundo carvão, superfícies de papel e detalhe terracota; coleções editoriais com ritmos e proporções diferentes.

Referências consultadas:
- https://www.stevemccurry.com/ — organização em Selected Works e categorias de imagens.
- https://fineart.jimmynelson.com/ — apresentação de obras como coleção e narrativa do olhar.
- https://rankin.co.uk/ — navegação concisa por linguagens de trabalho. A página de fotografia vinculada não foi acessível na pesquisa; não foi usada como base visual verificada.

Não há ranking objetivo dos maiores fotógrafos. A seleção considera autores reconhecidos internacionalmente e páginas acessíveis durante a pesquisa. Nenhuma fotografia ou biografia desses autores foi copiada para a demonstração.

Fotografias de referência: Eugenia Pan’kiv, Ionela Mat, Fotógrafo Samuel Cruz, Anna Vi, Willian Justen de Vasconcellos e Simon Peel, com créditos e links no portfólio e fontes em campaign-assets.json. Lume é um estúdio fictício. Os títulos das coleções são editoriais da demonstração, não títulos atribuídos pelos fotógrafos.

Recursos: abertura com troca manual de imagem; filtros por coleção; favoritos temporários com estado vazio; galeria ampliada com imagem inteira, fechamento por Escape e navegação por botões/setas; ensaio visual; apresentação da experiência e contato para criação do site. Nenhuma seleção é enviada ou persistida.

Verificação: 13 rotas, 37 arquivos e testes de filtros, favoritos e navegação circular. Sem teste visual de navegador, conforme fluxo de prévia local.
