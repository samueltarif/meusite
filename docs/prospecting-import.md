# Importação JSON e Excel

Acesse Empresas cadastradas ou Configurações > Importar cadastros. Escolha o arquivo, confira a quantidade e as primeiras empresas e clique em Confirmar importação.

Formatos: uma ficha JSON, uma lista de fichas JSON, um objeto com leads (incluindo exportações individuais/completas do painel) ou Excel .xlsx com a aba Empresas. Os arquivos exportados pelo painel são modelos completos. .xls não é suportado. Limites: 10 MB, 5.000 empresas e 500 interações por empresa.

Campos obrigatórios para novos registros: company (empresa), city (cidade) e segment (segmento). Os demais campos do cadastro podem ser preenchidos. Identificadores ausentes são gerados durante a conferência; IDs informados precisam ser UUIDs válidos. Campos desconhecidos e dados inválidos geram erro antes da gravação.

Excel: a aba Empresas contém os dados principais. Telefones contém os números adicionais, associados pelo ID; o telefone principal da aba Empresas prevalece sobre sua cópia na aba Telefones. Historico contém as interações associadas pelo ID. Preserve cabeçalhos e IDs ao editar um arquivo exportado. Telefones devem ser texto, datas de contato AAAA-MM-DD, horários texto HH:mm e valores numéricos sem fórmulas. Meta e investimento atuais não são substituídos por Configuracoes do arquivo.

Qualquer duplicidade por ID, nome de empresa, responsável, telefone (principal ou adicional), e-mail, site, Instagram ou Google Maps bloqueia o arquivo inteiro. Inclui registros arquivados e conflitos internos ao arquivo. Nome é comparado sem acentos, caixa, espaços ou pontuação; telefone sem formatação, tratando +55 e DDD brasileiro como equivalentes. Cidade, segmento, prioridade, status e valores iguais não são identificadores. O erro identifica as empresas e o campo em comum. O banco verifica novamente dentro da transação, com bloqueio de escrita para evitar concorrência durante a checagem. Nenhum item do lote é salvo em caso de conflito.

## Supabase

Execute docs/sql/prospecting-import-duplicates.sql ANTES de publicar esta versão, mesmo que a migration anterior já tenha sido executada. O script é completo e substitui a função anterior de importação. O script adiciona colunas complementares se ausentes e instala a função de importação transacional. Apenas o servidor autenticado com verificação de acesso ao CRM pode chamá-la; a execução direta por anon e authenticated é revogada. O script não importa nem exclui cadastros ao ser executado. Requer as tabelas atuais de prospecção e as etapas já utilizadas pelo painel.

Cada chamada grava empresas e históricos em uma única transação: falhas de validação do banco cancelam todo o lote. Histórico de uma empresa existente não é modificado. Toda importação nova recebe imported_at definido pelo banco; o selo Importado aparece nos cards, na lista e na ficha, com a data no título do selo. Edições manuais posteriores preservam a origem. Importações anteriores sem essa informação não são rotuladas automaticamente; não há como inferir sua origem com segurança. A migration não foi executada pelo assistente.

## Validação

- scripts/verify-prospecting-import.mjs: arquivos JSON individuais/lote e ida e volta XLSX com todos os campos, status, telefones, datas e histórico.
- scripts/verify-prospecting-import-api.mjs: API com banco simulado, acesso restrito, validação e erros de migration/transação.
- scripts/verify-prospecting-export.mjs: regressão das exportações.

A gravação real no Supabase deve ser validada após executar a migration.
