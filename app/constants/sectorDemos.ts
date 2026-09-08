export const climateEnvironments = [
  { name: 'Minha casa', title: 'Conforto que acompanha a sua rotina.', text: 'Quartos, salas e ambientes integrados pedem um projeto que considere o uso de cada espaço.', items: ['Dimensões e exposição solar', 'Posição das unidades e drenagem', 'Ruído e facilidade de manutenção'], image: '/images/campaign/architecture-2.jpg' },
  { name: 'Meu negócio', title: 'Um ambiente agradável também recebe melhor.', text: 'Lojas, escritórios e consultórios têm ocupação e horários próprios. A solução começa entendendo essa rotina.', items: ['Quantidade de pessoas e equipamentos', 'Horários de funcionamento', 'Distribuição do ar entre os ambientes'], image: '/images/campaign/dental.jpg' },
  { name: 'Vários ambientes', title: 'Planejamento para o conjunto.', text: 'Uma visão integrada dos ambientes ajuda a organizar instalação, operação e acesso para manutenção.', items: ['Levantamento dos ambientes', 'Infraestrutura disponível', 'Sequência de instalação'], image: '/images/campaign/architecture-1.jpg' },
] as const
export const dentalCare = [
  { name: 'Prevenção', title: 'Cuidar começa antes de incomodar.', text: 'Uma consulta para conhecer sua saúde bucal, conversar sobre sua rotina e planejar os próximos cuidados.', steps: ['Conversa sobre o seu histórico', 'Avaliação individual', 'Orientações para a rotina'] },
  { name: 'Reabilitação', title: 'Cada sorriso tem um ponto de partida.', text: 'A avaliação de dentes ausentes e da função mastigatória orienta a conversa sobre possibilidades de reabilitação.', steps: ['Entendimento da sua necessidade', 'Avaliação e exames, quando indicados', 'Discussão das possibilidades de tratamento'] },
  { name: 'Ortodontia', title: 'Um plano que respeita o seu sorriso.', text: 'A posição dos dentes e a mordida são avaliadas para discutir as opções de acompanhamento ortodôntico.', steps: ['Avaliação da mordida', 'Documentação individual', 'Planejamento com o profissional'] },
  { name: 'Estética', title: 'Naturalidade começa com uma boa conversa.', text: 'Suas expectativas e a condição dos dentes fazem parte da avaliação antes de qualquer proposta estética.', steps: ['Escuta das suas expectativas', 'Avaliação da saúde bucal', 'Apresentação das opções indicadas'] },
] as const
export const businessStages = [
  { name: 'Vou abrir uma empresa', title: 'Comece com as perguntas certas.', label: 'ABERTURA', text: 'Organize as informações do negócio para conversar sobre a formalização com um contador.', checklist: ['Atividades que pretende oferecer', 'Cidade e local de funcionamento', 'Participação de sócios', 'Previsão de equipe e operação'], delivery: 'Uma conversa sobre atividade, estrutura e próximos passos.' },
  { name: 'Quero trocar de contador', title: 'Uma transição começa com organização.', label: 'MIGRAÇÃO', text: 'Entenda o momento da empresa e reúna o que o novo escritório precisa conhecer.', checklist: ['Situação cadastral da empresa', 'Rotina de documentos e relatórios', 'Pendências a esclarecer', 'Data desejada para a transição'], delivery: 'Um roteiro de transição combinado entre os envolvidos.' },
  { name: 'Preciso organizar a rotina', title: 'Mais clareza para acompanhar o negócio.', label: 'ACOMPANHAMENTO', text: 'Documentos, equipe e informações contábeis precisam de um fluxo que faça sentido para sua operação.', checklist: ['Forma de envio dos documentos', 'Pessoas responsáveis por cada etapa', 'Relatórios que precisa acompanhar', 'Dúvidas recorrentes da gestão'], delivery: 'Uma rotina de comunicação e entregas definida com você.' },
] as const
export const woodRooms = [
  { name: 'Cozinhas', title: 'Tudo encontra o seu lugar.', image: '/images/campaign/wood-kitchen.jpg', detail: 'Fluxo de preparo, armazenamento e encontros. Uma cozinha desenhada a partir de como você vive.', features: ['Organização interna', 'Integração com eletrodomésticos', 'Bancadas e circulação'] },
  { name: 'Estar', title: 'Espaço para ficar.', image: '/images/campaign/architecture-2.jpg', detail: 'Painéis, estantes e volumes que acomodam objetos e deixam espaço para o cotidiano.', features: ['Livros e objetos', 'Passagem de cabos', 'Composição com iluminação'] },
  { name: 'Ambientes integrados', title: 'A casa conversa por inteiro.', image: '/images/campaign/architecture-3.jpg', detail: 'Uma linguagem de materiais e proporções que conecta os ambientes sem apagar a identidade de cada um.', features: ['Continuidade visual', 'Mobiliário sob medida', 'Circulação entre ambientes'] },
] as const
export const woodFinishes = [
  { name: 'Carvalho natural', color: '#b88e62', text: 'Tons quentes para composições acolhedoras. A amostra física orienta a escolha final.' },
  { name: 'Areia fosco', color: '#d4c9b5', text: 'Uma base clara para equilibrar madeira, pedra e luz. Textura definida no projeto.' },
  { name: 'Verde oliva', color: '#777b60', text: 'Cor em diálogo com materiais naturais. A combinação é estudada para cada ambiente.' },
  { name: 'Grafite', color: '#454541', text: 'Profundidade e contraste em detalhes ou grandes superfícies. Acabamento a definir.' },
] as const
export const constructionStages = [
  { name: 'Levantamento', title: 'Antes da obra, entender o lugar.', text: 'Necessidades, condições do imóvel e limites do projeto entram no levantamento inicial.', deliverables: ['Registro das condições existentes', 'Definição dos ambientes envolvidos', 'Mapa inicial de necessidades'], tag: 'DIAGNÓSTICO DO PROJETO' },
  { name: 'Planejamento', title: 'Cada decisão precisa de uma sequência.', text: 'Escopo, compras, equipe e dependências são organizados antes de começar a execução.', deliverables: ['Escopo de serviços', 'Sequência de execução', 'Planejamento de compras'], tag: 'PREPARAÇÃO DA OBRA' },
  { name: 'Execução', title: 'Acompanhar é parte de construir.', text: 'O andamento é registrado para que decisões, ajustes e próximos passos sejam compreensíveis.', deliverables: ['Registro de evolução', 'Coordenação das frentes de trabalho', 'Comunicação de ajustes'], tag: 'ACOMPANHAMENTO' },
  { name: 'Entrega', title: 'Conferir os detalhes. Fechar o ciclo.', text: 'A conclusão inclui a conferência do escopo e a organização das informações do que foi executado.', deliverables: ['Vistoria de conclusão', 'Conferência dos itens combinados', 'Orientações de uso e conservação'], tag: 'CONCLUSÃO' },
] as const
