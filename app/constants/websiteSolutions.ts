import type { WebsiteSolution } from '~/types/websiteSolutions'
export const websiteSolutions: WebsiteSolution[] = [
  {
    path: '/criacao-de-landing-pages', label: 'Landing pages',
    title: 'Criação de landing pages para campanhas',
    description: 'Landing pages sob medida para apresentar uma oferta e receber contatos. Design responsivo, conteúdo claro e mensuração definida com a Avyro.',
    intro: 'Uma campanha precisa de uma página que continue a conversa iniciada no anúncio. Criamos landing pages com uma oferta bem explicada, informações para decidir e um caminho direto para o contato.',
    heading: 'Uma oferta, uma jornada de decisão.',
    sections: [
      { title: 'Quando escolher uma landing page', text: 'É indicada para divulgar um serviço específico, lançamento ou campanha com um público definido. Uma empresa de climatização, por exemplo, pode apresentar instalação comercial separadamente da manutenção residencial. Quando o visitante precisa conhecer várias áreas da empresa, um site institucional costuma organizar melhor essa exploração.' },
      { title: 'O que precisa aparecer na página', text: 'A oferta deve explicar para quem é o serviço, o que ele contempla, como funciona o atendimento e qual é o próximo passo. Fotos próprias, projetos autorizados e dúvidas frequentes ajudam a sustentar a decisão. O formulário pode pedir apenas as informações necessárias para iniciar a conversa.' },
      { title: 'Como acompanhar os contatos', text: 'Definimos quais ações serão medidas, como envio de formulário ou clique no WhatsApp. Um clique indica interesse; a equipe comercial ainda precisa confirmar se houve contato qualificado e venda. A configuração de conversões e consentimento é combinada no projeto, de acordo com as ferramentas utilizadas.' },
    ],
    checklist: ['Oferta e público da campanha', 'Região real de atendimento', 'Imagens e provas autorizadas', 'Destino dos contatos e responsável pelo retorno'],
    question: 'Landing page também pode aparecer na busca orgânica?',
    answer: 'Pode, se estiver publicada de forma acessível aos buscadores e trouxer conteúdo útil para aquela pesquisa. Comprar anúncios não garante posicionamento orgânico. A página deve resolver a dúvida do visitante; repetir termos ou criar cópias para várias cidades não substitui conteúdo próprio.',
  },
  {
    path: '/manutencao-de-sites', label: 'Manutenção de sites',
    title: 'Manutenção de sites com acompanhamento mensal',
    description: 'Manutenção de sites com atualizações, suporte e melhorias conforme o projeto. Conheça o acompanhamento mensal opcional da Avyro para empresas.',
    intro: 'Novos serviços, mudanças de equipe e campanhas precisam chegar ao seu site. A manutenção mensal opcional organiza essas atualizações e o acompanhamento técnico em um escopo adequado à rotina da empresa.',
    heading: 'Seu negócio muda. O site precisa acompanhar.',
    sections: [
      { title: 'Atualizações de conteúdo', text: 'Troca de fotos, revisão de textos, inclusão de serviços e organização de produtos podem fazer parte do acompanhamento. Uma floricultura pode preparar uma coleção sazonal; uma indústria pode atualizar documentos técnicos. Frequência, volume e materiais necessários são definidos antes da contratação.' },
      { title: 'Cuidados técnicos combinados', text: 'A rotina pode contemplar verificação de formulários, links, dependências e cópias de segurança, conforme a tecnologia e os acessos disponíveis. Hospedagem, domínio e serviços de terceiros têm responsabilidades próprias, que precisam constar na proposta. A manutenção não deve depender de credenciais compartilhadas sem controle.' },
      { title: 'Melhorias com escopo claro', text: 'Ajustar uma página existente é diferente de desenvolver um novo catálogo ou integrar um sistema. Registramos a necessidade para avaliar prioridade, prazo e se a demanda está contemplada no acompanhamento. Isso permite planejar a evolução do site sem confundir manutenção com desenvolvimento ilimitado.' },
    ],
    checklist: ['Endereço do site e tecnologia, se conhecida', 'Quem administra domínio e hospedagem', 'Mudanças mais frequentes', 'Necessidade de suporte e prioridades'],
    question: 'Vocês podem manter um site feito por outra empresa?',
    answer: 'Avaliamos primeiro a tecnologia, os acessos, a documentação e o estado do projeto. Essa análise define a viabilidade e eventuais ajustes iniciais. A contratação mensal é opcional; atividades, prazos de atendimento e custos de terceiros ficam claros na proposta.',
  },
  {
    path: '/sites-com-painel-administrativo', label: 'Sites com painel administrativo',
    title: 'Criação de sites com painel administrativo',
    description: 'Sites com painel para atualizar produtos, fotos, serviços e projetos. Recursos e permissões sob medida para a rotina da sua empresa, com a Avyro.',
    intro: 'Um painel administrativo permite cuidar do conteúdo que muda com frequência. Planejamos os campos, as permissões e o fluxo de atualização para que sua equipe tenha autonomia nas tarefas que realmente utiliza.',
    heading: 'Autonomia para atualizar, estrutura para organizar.',
    sections: [
      { title: 'Defina o que a equipe precisa editar', text: 'Produtos podem precisar de nome, categoria, fotos e ficha técnica. Um portfólio pode precisar de localização, descrição e galeria. Começamos por essas rotinas para evitar um painel cheio de campos sem utilidade e manter a apresentação pública consistente.' },
      { title: 'Acesso e publicação', text: 'Login, recuperação de acesso e permissões devem acompanhar a responsabilidade de cada usuário. Quando necessário, o projeto pode separar rascunho e publicação. A proteção precisa existir também no servidor e no banco de dados, e não apenas na tela de login.' },
      { title: 'Integrações e limites', text: 'Conectar estoque, agenda ou CRM depende das APIs e permissões dos sistemas envolvidos. Atualizar um catálogo manualmente é um escopo diferente de sincronizar preços e disponibilidade com um ERP. Essas dependências são avaliadas antes da implementação.' },
    ],
    checklist: ['Conteúdos que precisam de atualização', 'Quem edita e quem aprova', 'Volume de produtos, projetos ou arquivos', 'Sistemas que precisam se conectar'],
    question: 'Todo site precisa de painel?',
    answer: 'Não. Se o conteúdo muda pouco, solicitar alterações pontuais ou contratar manutenção pode ser suficiente. Um painel faz mais sentido quando a equipe atualiza informações com frequência. Podemos combinar painel e manutenção para dividir o cuidado com conteúdo e tecnologia.',
  },
]
