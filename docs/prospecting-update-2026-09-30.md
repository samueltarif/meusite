# Atualização do painel de prospecção — 30/09/2026

Antes de publicar esta versão, execute `docs/sql/prospecting-multiple-phones.sql` no SQL Editor do Supabase do projeto. O script não foi executado automaticamente. Ele adiciona `additional_phones` com lista vazia, preservando `phone`, dados existentes e permissões. Pode ser executado novamente. O banco já deve conter as tabelas e autenticação usadas pela versão atual do painel. Não executar novamente o script antigo de criação das tabelas.

O cadastro agora aparece na lista e no indicador de empresas cadastradas após confirmação do servidor, com filtros limpos e ordenação por mais recentes. A etapa interna `Selecionado` continua compatível com o banco e aparece como “Cadastrada”. Cadastrar ou agendar não registra contato realizado.

Cada empresa aceita um telefone principal e nove adicionais. Backups antigos continuam válidos. Os links de WhatsApp oferecem escolha de número, assumem Brasil para números com DDD e aceitam código internacional com +. Abrir WhatsApp não envia mensagem nem registra interação.

A lista compacta, os cartões e o funil compartilham filtros e ordenação por cadastro (recente/antigo), atualização, nome (A–Z/Z–A), nota (maior/menor) e próximo retorno. Avaliações ausentes ficam por último; empates de nota priorizam quantidade de avaliações.

Retornos: atrasados, hoje, sem agendamento e próximos dias. Arquivadas e etapas encerradas não entram nessas filas. Agendamento rápido mantém a etapa e o histórico. O funil mantém todas as etapas visíveis.

Resultados: todo o histórico, semana atual (segunda a domingo, até hoje), mês atual e intervalo personalizado. Cadastros usam a data de criação local. Interações são filtradas pela data registrada; empresas anteriores podem aparecer no período por novas interações. Valores fechados consideram a etapa atual e registro de fechamento dentro do intervalo. São valores informados, não pagamentos. Investimento e custo por contatada permanecem totais históricos, pois não há datas de despesas no modelo.

Verificação: `node scripts/verify-prospecting-workspace.mjs` e `node scripts/verify-prospecting-stages.mjs`.
