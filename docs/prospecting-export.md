# Exportação completa para análise

## Onde baixar

- Empresas cadastradas e Configurações: **Baixar toda a base para análise**. Consulta novamente o banco e inclui empresas arquivadas, independentemente dos filtros.
- Ficha da empresa: **Baixar todos os dados desta empresa**, com a ficha carregada no painel.
- Formulário de cadastro/edição: exporta os valores atuais, incluindo campos ainda não salvos. O arquivo indica que é um rascunho. Baixar não salva nem altera o cadastro.

## Formatos

**JSON completo:** mantém todas as chaves e valores dos cadastros, inclusive vazios, null, números adicionais, histórico e datas. Também inclui nomes legíveis dos campos e contexto para análise. Na exportação da base, inclui meta e investimento. Este é o formato preferível para uma análise fiel de todos os detalhes.

**Excel (.xlsx):** abas Empresas, Telefones, Historico, Configuracoes, Classificacao, Dicionario e Leia-me. O ID relaciona empresas, telefones e interações. Telefones são texto; valores e indicadores mantêm seus tipos. Textos que começam com = não são fórmulas. As observações não são truncadas: se um campo exceder o limite do Excel, a exportação informa o problema e orienta usar JSON.

O histórico é separado por interação para não condensar ou perder textos longos em uma célula. Cadastros arquivados são incluídos; empresas excluídas definitivamente não estão mais no banco e não podem ser exportadas. O download não envia informações ao ChatGPT: o usuário anexa o arquivo no chat em que deseja a análise.

Não é necessário executar SQL para esta funcionalidade. A consulta da base percorre todas as páginas de empresas e interações para não exportar somente a primeira página do banco. Se a consulta falhar, a exportação completa falha em vez de gerar um arquivo parcial.

## Verificação

`node scripts/verify-prospecting-export.mjs`: compara todos os campos JSON e XLSX após reabrir o arquivo, testa telefones, histórico longo, rascunho, arquivadas, base vazia, fórmulas literais e paginação com mais de 1.000 registros.
