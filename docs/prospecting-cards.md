# Cards e etapas de pesquisa

- Pendente: empresa em pesquisa, ainda sem abordagem. Usa o valor existente `Selecionado` no banco.
- Aprovado para contato: decisão interna de abordar o lead, sem registrar interação ou aumentar a meta de contatadas. Usa o novo valor `Aprovado`.
- Em contato: primeira abordagem realizada; usa o valor existente `Contatado`.
- Etapas seguintes e históricos existentes foram preservados.

No cadastro ou em Editar, uma empresa em pesquisa pode alternar entre Pendente e Aprovado. Para entrar em contato, abra a ficha e registre a interação real. Nome do dono/responsável é opcional: deixe vazio quando desconhecido, em vez de escrever “Pendente”. Texto já preenchido nos registros antigos não é apagado automaticamente.

Cards mostram separadamente etapa comercial, prioridade, dono e evidência de contato. Se uma empresa antiga estiver em uma etapa avançada sem histórico, o painel mostra “Sem contato registrado no histórico”, sem afirmar que ela nunca foi contatada.

## Banco e publicação

Execute `docs/sql/prospecting-approval.sql` no Supabase antes de publicar esta versão. O script amplia as restrições de etapa, preservando registros, autenticação e RLS. Não é necessário criar colunas para o dono, pois `person` já existe e aceita texto vazio.

O SQL não foi executado no banco remoto. Registros existentes não foram modificados. O script é transacional e pode ser repetido; se houver um esquema diferente (por exemplo, stage como enum), a execução deve ser revista antes de continuar.

Animações de entrada, filtros e movimentação respeitam a preferência de redução de movimento. Formulários aguardam confirmação do servidor e mantêm os dados quando o salvamento falha.
