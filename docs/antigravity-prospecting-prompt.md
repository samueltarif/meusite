# Prompt para o Antigravity

Use o MCP do Supabase para criar a estrutura do painel de prospecção da Avyro no projeto `mwrtluebbiyrmjrqwhut` (`assessoriatarif@gmail.com's Project`). A pasta do projeto local é `D:\meu site`.

Execute esta tarefa como uma migration aditiva de banco, sem conectar o frontend ainda. Estou autorizando a criação dos objetos novos descritos abaixo. Não adicione autenticação nesta etapa.

## 1. Inspeção antes de aplicar

- Confirme pelo MCP o ID e o nome do projeto. O resumo anterior é uma fotografia do banco, não uma garantia do estado atual.
- Consulte estrutura e migrations existentes, sem extrair registros de clientes, tokens, credenciais ou dados de contas Instagram.
- Verifique se já existem `public.prospecting_leads`, `public.prospecting_interactions`, `public.prospecting_settings` ou a função `public.prospecting_touch_updated_at()`.
- Se já houver objetos equivalentes, compare a estrutura e a migration aplicada antes de agir. Se tudo já estiver aplicado, apenas valide. Se houver divergência, não apague nem recrie: informe o conflito e proponha uma migration incremental que preserve os dados.

## 2. Fonte do contrato

Leia estes arquivos locais:

- `D:\meu site\docs\sql\prospecting-schema.sql` — SQL preparado para a migration.
- `D:\meu site\app\types\prospecting.ts` — campos do painel.
- `D:\meu site\app\validation\prospecting.ts` — limites e valores aceitos.
- `D:\meu site\app\utils\prospecting.ts` — classificação e regras de histórico.

Se você não conseguir ler o SQL local, peça o conteúdo desse arquivo. Não improvise uma estrutura resumida que deixe campos de fora.

O contrato contém:

- `prospecting_leads`: empresa, pessoa, cidade, segmento, origem, Maps, Instagram, site, telefone, e-mail, situação do site, atividade, boas avaliações, fotos recentes, apresentação profissional, nota e quantidade de avaliações, prioridade manual, oportunidade, personalização, etapa, próxima ação, retorno, notas, valor do projeto, mensalidade, arquivamento e timestamps.
- `prospecting_interactions`: UUID, empresa relacionada, data do contato, canal, etapa, nota e timestamp. Histórico normalizado, com chave estrangeira e proteção contra exclusão acidental da empresa que tem histórico.
- `prospecting_settings`: uma linha de configuração do painel, meta inicial 30 e investimento inicial zero.

## 3. Aplicação e isolamento

- Use a ferramenta de migration do MCP (por exemplo `apply_migration`, se disponível) com o nome `avyro_prospecting_v1`, preservando o conteúdo do SQL. Evite `execute_sql` para DDL quando existir a ferramenta própria de migration.
- O arquivo contém BEGIN/COMMIT. Caso a ferramenta já faça a transação, remova somente esses delimitadores externos e mantenha a execução atômica.
- Não altere `profiles`, `links`, `link_clicks`, `page_views` ou qualquer tabela, função, policy ou integração Instagram existente. O alerta anterior de RLS em `link_clicks` é fora do escopo; apenas relate sua existência se aparecer na inspeção.
- Mantenha RLS ativado nas três tabelas novas, sem policies permissivas. Revogue privilégios de PUBLIC, anon e authenticated sobre os novos objetos, conforme o SQL. As contas do aplicativo atual não devem ganhar acesso ao CRM.
- Não crie policies `using (true)` ou `with check (true)` para contornar a ausência de login. Não desative RLS nem altere privilégios globais do schema.
- Nunca coloque service_role ou secret key no navegador, em variável NUXT_PUBLIC, no repositório ou na resposta. Uma futura API com chave de serviço também precisará de controle de acesso; uma API pública sem autenticação não torna os contatos privados.
- Não crie usuários, não associe o painel a um profile arbitrário e não importe dados do localStorage nesta etapa.
- Não crie leads fictícios permanentes. Apenas a configuração padrão prevista no SQL pode ser inserida.

## 4. Validação obrigatória

- Confirme tabelas, colunas, tipos, defaults, checks, FK, índices e triggers pelo catálogo do Postgres.
- Confirme `relrowsecurity = true` nas três tabelas e ausência de policies abertas.
- Verifique os privilégios efetivos de SELECT, INSERT, UPDATE e DELETE para anon e authenticated: devem estar bloqueados. Verifique também que PUBLIC não fornece acesso indireto. Confirme os privilégios previstos para service_role.
- Faça testes transacionais com dados fictícios e ROLLBACK, sem deixar registros: criar empresa e interação, validar FK, rejeitar nota fora de 0–5, valor negativo, etapa inválida, segunda linha de settings e empresa vazia; conferir que atualizar uma empresa altera updated_at.
- Em testes de operações negadas ou constraints, use transações separadas ou savepoints para não esconder resultados por causa de uma transação já abortada.
- Valide que a migration não modificou objetos fora do prefixo prospecting_. Não exporte conteúdo das tabelas antigas para fazer essa verificação.

## 5. Entrega

Informe o projeto confirmado, nome da migration, tabelas e colunas criadas, resultado de cada verificação e qualquer divergência encontrada. Mostre somente metadados e resultados sintéticos, sem segredos ou dados pessoais.

Explique que o banco foi preparado, mas o painel `/prospeccao` continua salvando no navegador até uma tarefa posterior de integração. Não anuncie sincronização como concluída.

Para a integração futura, preserve UUIDs existentes quando válidos, converta campos camelCase para snake_case e datas vazias para NULL. Backups com IDs não UUID precisam de mapeamento consistente entre empresa e histórico; não descarte esses contatos. Use transações para registrar interação e atualizar o estado atual, respeitando a regra de que uma interação retroativa não regride a etapa ou o retorno. Esse trabalho fica fora desta migration.
