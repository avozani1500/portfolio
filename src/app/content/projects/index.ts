import { Project } from '../../core/models/project.model';

export const itemRarityProject: Project = {
  slug: 'item-rarity',
  title: 'Item Rarity para Project Zomboid',
  caseStudyTitle: 'Sistema de classificação dinâmica de raridade para Project Zomboid',
  shortDescription:
    'Projeto técnico para classificação dinâmica de raridade de itens com base na disponibilidade de loot e nas características dos itens.',
  description:
    'Item Rarity é um mod para Project Zomboid criado para diferenciar visualmente itens com diferentes níveis de raridade e utilidade, tornando o loot mais fácil de interpretar e dando maior sensação de progressão.',
  type: 'personal',
  status: 'active',
  release: '1.0.0',
  visibility: 'public',
  featured: true,
  coverImage: {
    src: '/assets/projects/item-rarity/cover.webp',
    alt: 'Inventário do Project Zomboid com itens classificados por raridade, tooltip detalhado e tier Epic.',
    position: 'center left',
    width: 884,
    height: 549,
  },
  showcase: {
    title: 'Item Rarity',
    description: 'Mod para Project Zomboid que adiciona uma camada de raridade aos itens com base no loot e em características de utilidade.',
    technologies: ['Lua', 'Project Zomboid', 'Open Source'],
  },
  technologies: [],
  availability: {
    publicSourceCode: true,
    publicDemo: false,
    publicDocumentation: false,
    repositoryUrl: 'https://github.com/avozani1500/ItemRarity',
  },
  externalLinks: [
    { label: 'GitHub', url: 'https://github.com/avozani1500/ItemRarity', kind: 'repository' },
    { label: 'Steam Workshop', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3801386617', kind: 'workshop' },
  ],
  caseStudy: [
    {
      type: 'challenge',
      title: 'Problema',
      state: 'available',
      content: 'Itens com disponibilidade, utilidade e importância muito diferentes eram apresentados visualmente da mesma maneira. A motivação foi tornar valor e raridade perceptíveis, aumentar a sensação de progressão durante o loot e tornar descobertas incomuns mais significativas.',
    },
    {
      type: 'overview',
      title: 'Solução',
      state: 'available',
      content: 'Item Rarity 1.0.0 é um sistema de classificação dinâmica para Project Zomboid. Ele combina a disponibilidade estrutural do loot com o valor mecânico de cada categoria e apresenta cinco tiers: Common, Uncommon, Rare, Epic e Exotic.',
    },
    {
      type: 'context',
      title: 'Como funciona',
      state: 'available',
      content: 'Em vez de manter uma lista fixa de raridades, o sistema observa as distribuições finais carregadas pelo jogo após o merge de conteúdo vanilla e mods. A classificação é construída a partir do universo efetivamente analisado.',
      items: [
        'Distribuições finais são coletadas e agregadas por fullType.',
        'Scarcity representa disponibilidade estrutural.',
        'Utility adiciona valor mecânico específico por categoria.',
        'A combinação produz o FinalRarityTier exibido na interface.',
      ],
    },
    {
      type: 'features',
      title: 'Scarcity',
      state: 'available',
      content: 'A Strategy D / RouteWeighted estima a disponibilidade estrutural observando ocorrência, pesos, rolls, pools, rotas e exposição. Reachability, cobertura de rooms e cobertura de containers ajudam a representar o caminho pelo qual um item pode aparecer. O resultado é uma aproximação das tabelas de loot, não uma probabilidade exata de encontrar um item no mapa.',
      items: [
        'Common: percentil de disponibilidade entre 65 e 100.',
        'Uncommon: entre 35 e menor que 65.',
        'Rare: entre 15 e menor que 35.',
        'Epic: entre 5 e menor que 15.',
        'Exotic: entre 0 e menor que 5.',
      ],
    },
    {
      type: 'features',
      title: 'Utility',
      state: 'available',
      content: 'Utility não usa uma fórmula global. Cada categoria utiliza atributos adequados à sua função e aplica uma política conservadora quando os dados disponíveis não sustentam uma avaliação confiável.',
      items: [
        'Firearms consideram fatos estáticos de munição, recuo, mira, recarga e críticos.',
        'Melee considera dimensões como offense, efficiency, control e reliability.',
        'Clothing considera anatomia, cobertura e relações de equipamento.',
        'Food considera fome, humor, energia, preservação e conveniência.',
        'Medical considera efeitos de tratamento, infecção, dor, febre e toxicidade.',
      ],
    },
    {
      type: 'features',
      title: 'Compatibilidade com mods',
      state: 'available',
      content: 'O scanner trabalha sobre as distribuições finais carregadas pelo jogo, permitindo que conteúdo vanilla e conteúdo de mods participem da análise. O sistema prioriza sinais estruturais e relações declaradas, sem prometer suporte universal ou compatibilidade garantida com qualquer mod.',
    },
    {
      type: 'architecture',
      title: 'Arquitetura',
      state: 'available',
      content: 'A arquitetura separa processamento no host, publicação do registry e apresentação no client.',
      diagram: {
        nodes: ['Distribuições finais', 'Scanner', 'Scarcity / Utility', 'FinalRarityTier', 'Registry', 'UI'],
        branches: [
          { label: 'UTILITY_ONLY', nodes: ['Utility', 'FinalRarityTier'], note: 'Entra depois do scan normal e não inventa Scarcity para itens sem loot row.' },
        ],
        note: 'No produto, o host calcula e publica; inventory, tooltip e hotbar consomem o registry no client.',
      },
    },
    {
      type: 'audits',
      title: 'Validação',
      state: 'available',
      content: 'As auditorias são apresentadas aqui como evidências de engenharia, sempre identificadas pelo checkpoint ao qual pertencem.',
      metrics: [
        { label: 'RC1 — 2026-09-10', value: '3.505 tipos', description: '100.820 ocorrências' },
        { label: 'Checkpoint modded — 2026-10-06', value: '3 scans', description: '3.868 entries em cada scan' },
        { label: 'Estabilidade no checkpoint', value: '0 diferenças', description: 'registry, score e tier; 0 fatals' },
        { label: 'Firearm validation', value: '738/738', description: 'campos exatos em 123 firearms' },
      ],
    },
    {
      type: 'performance',
      title: 'Desempenho',
      state: 'available',
      content: 'O processamento evita trabalho repetido sem transformar a UI em um novo ponto de cálculo.',
      items: [
        'Reutilização de ScriptItem e caches locais de scan.',
        'Deduplicação de perfis mecânicos e facts estáticos de Firearm.',
        'Cache de apresentação por revision e generation.',
      ],
    },
    {
      type: 'results',
      title: 'Resultado',
      state: 'available',
      content: 'O Item Rarity transforma uma diferença visual simples em um sistema de classificação baseado em estrutura de loot, modelos específicos por domínio, suporte ao universo carregado de mods, validação e separação host/client. O resultado é uma camada de contexto para tornar escolhas e descobertas durante o loot mais perceptíveis.',
    },
    {
      type: 'learnings',
      title: 'Decisões e limites do modelo',
      state: 'available',
      content: 'Quando os dados disponíveis no runtime não são confiáveis o suficiente, o sistema prefere um fallback conservador a inventar precisão. A raridade é associada ao fullType e à estrutura de loot, não à condição ou a características aleatórias de uma instância específica.',
    },
    {
      type: 'technical-decisions',
      title: 'Tecnologias',
      state: 'available',
      content: 'Runtime: Lua no Kahlua de Project Zomboid e APIs do jogo. A bridge Lua/Java fornece acesso a ScriptItem, coleções e getters. PowerShell, Node.js, harnesses Java e Git são usados no tooling e na validação; Java e Node.js não são dependências do mod em gameplay.',
    },
    {
      type: 'gallery',
      title: 'Galeria / diagramas',
    state: 'available',
    images: [
      {
        src: '/assets/projects/item-rarity/weapons.webp',
        alt: 'Inventário do Project Zomboid com armas de diferentes raridades e tooltip Exótico.',
        caption: 'Armas com diferentes tiers de raridade',
        width: 751,
        height: 387,
      },
      {
        src: '/assets/projects/item-rarity/visual-settings.webp',
        alt: 'Configurações visuais do mod Item Rarity.',
        caption: 'Preferências visuais do mod',
        width: 1143,
        height: 249,
      },
    ],
    },
    {
      type: 'features',
      title: 'Links externos',
      state: 'available',
      content: 'Item Rarity 1.0.0 está disponível nos canais públicos abaixo.',
    },
  ],
};

itemRarityProject.caseStudy = [
  { type: 'overview', title: 'Visão geral', state: 'available', content: 'Item Rarity é um mod para Project Zomboid criado para diferenciar visualmente itens com diferentes níveis de raridade e utilidade, tornando o loot mais fácil de interpretar e dando maior sensação de progressão.' },
  { type: 'context', title: 'Como funciona', state: 'available', content: 'O sistema lê as distribuições finais de loot carregadas pelo jogo, classifica a scarcity, calcula utility por categoria e converte o resultado em tiers de raridade. A proposta combina sinais estruturais do loot com características adequadas ao tipo de item.' },
  { type: 'technical-decisions', title: 'Decisões técnicas', state: 'available', items: ['Análise estrutural das distribuições de loot.', 'Utility específica por categoria.', 'Comportamento determinístico.', 'Isolamento de erros por item.'] },
  { type: 'results', title: 'Resultado', state: 'available', content: 'Em um dos checkpoints de validação, três execuções consecutivas produziram o mesmo registry de 3.868 itens, sem diferenças de score ou tier e sem erros fatais.' },
  {
    type: 'gallery',
    title: 'Galeria / diagramas',
    state: 'available',
    images: [
      {
        src: '/assets/projects/item-rarity/weapons.webp',
        alt: 'Inventário do Project Zomboid com armas de diferentes raridades e tooltip Exótico.',
        caption: 'Armas com diferentes tiers de raridade',
        width: 751,
        height: 387,
      },
      {
        src: '/assets/projects/item-rarity/visual-settings.webp',
        alt: 'Configurações visuais do mod Item Rarity.',
        caption: 'Preferências visuais do mod',
        width: 1143,
        height: 249,
      },
    ],
  },
  { type: 'features', title: 'Links', state: 'available', content: 'Item Rarity 1.0.0 está disponível nos canais públicos abaixo.' },
];

export const baitoBarbeariaProject: Project = {
  slug: 'baito-barbearia',
  title: 'Baito Barbearia',
  caseStudyTitle: 'Website institucional para Baito Barbearia',
  shortDescription:
    'Website institucional desenvolvido para uma barbearia local, do desenvolvimento ao deploy.',
  description:
    'Website desenvolvido para uma barbearia local em Flor da Serra do Sul – PR, reunindo serviços, horários, localização, contato e imagens reais do estabelecimento.',
  type: 'freelance',
  status: 'completed',
  visibility: 'public',
  featured: true,
  coverImage: {
    src: '/assets/projects/baito/cover.webp',
    alt: 'Página inicial da Baito Barbearia com fachada, nome da barbearia e CTA principal.',
    position: 'center center',
    width: 1660,
    height: 984,
  },
  showcase: {
    description: 'Website institucional desenvolvido para uma barbearia local, com foco em responsividade, SEO e publicação em produção.',
    technologies: ['Angular', 'TypeScript', 'SCSS', 'SEO'],
  },
  role: 'Desenvolvimento freelance',
  technologies: [
    'Angular',
    'TypeScript',
    'SCSS',
    'HTML',
    'Responsive Web Design',
    'Angular Prerender / SSG',
  ],
  availability: {
    publicSourceCode: false,
    publicDemo: true,
    publicDocumentation: false,
    liveUrl: 'https://baitobarbearia.com.br/',
  },
  externalLinks: [
    {
      label: 'Ver site',
      url: 'https://baitobarbearia.com.br/',
      kind: 'demo',
    },
  ],
  caseStudy: [
    {
      type: 'context',
      title: 'Contexto',
      state: 'available',
      content:
        'Baito Barbearia é um website institucional desenvolvido para uma barbearia local em Flor da Serra do Sul – PR. O projeto foi realizado para Cleitom Dambros, com o objetivo de apresentar o negócio de forma clara no ambiente digital.',
    },
    {
      type: 'challenge',
      title: 'O objetivo',
      state: 'available',
      content:
        'A presença digital precisava comunicar a identidade do estabelecimento, seus serviços, preços, horários, localização, formas de contato e o ambiente real da barbearia sem criar uma experiência genérica ou excessivamente complexa.',
    },
    {
      type: 'overview',
      title: 'Solução',
      state: 'available',
      content:
        'A interface utiliza fotografias reais do ambiente, layout responsivo e uma estrutura simples para apresentar serviços, horários, localização e contato. A implementação também inclui prerender, imagens otimizadas e recursos de SEO para páginas públicas.',
    },
    {
      type: 'technical-decisions',
      title: 'Experiência responsiva',
      state: 'available',
      content:
        'A composição foi revisada em diferentes larguras para manter ausência de overflow horizontal, proporção adequada do Hero, legibilidade, navegação apropriada e apresentação consistente dos serviços e demais conteúdos.',
      items: ['Validações aproximadas em 390px, 768px, 1024px, 1440px e 1920px.'],
    },
    {
      type: 'features',
      title: 'SEO & publicação',
      state: 'available',
      content:
        'O projeto implementou metadata, Open Graph, Twitter Card, JSON-LD com schema adequado para Barbershop, sitemap, robots.txt e prerender da página pública. O site foi levado a produção e publicado utilizando Hostinger, sem pressupor resultados de indexação ou ranking.',
    },
    {
      type: 'technical-decisions',
      title: 'Stack',
      state: 'available',
      items: [
        'Angular standalone e TypeScript strict.',
        'SCSS com design tokens.',
        'Responsive Web Design e imagens responsivas em WebP.',
        'Angular Prerender / SSG.',
        'Dark/light theme e SEO estruturado.',
      ],
    },
    {
      type: 'results',
      title: 'Resultado',
      state: 'available',
      content:
        'O projeto foi levado do desenvolvimento ao deploy, resultando em um website funcional e publicado para um cliente real.',
    },
    {
      type: 'gallery',
      title: 'Galeria',
      state: 'planned',
      images: [],
    },
    {
      type: 'features',
      title: 'Links externos',
      state: 'available',
      content: 'O site público do projeto está disponível no link abaixo.',
    },
  ],
};

baitoBarbeariaProject.caseStudy = [
  { type: 'context', title: 'Contexto', state: 'available', content: 'Website desenvolvido para uma barbearia local em Flor da Serra do Sul – PR, reunindo serviços, horários, localização, contato e imagens reais do estabelecimento.' },
  { type: 'overview', title: 'Solução', state: 'available', content: 'A interface foi construída com Angular e foco em navegação simples, responsividade e apresentação direta do negócio.' },
  { type: 'technical-decisions', title: 'Desenvolvimento', state: 'available', items: ['Angular standalone.', 'TypeScript strict.', 'SCSS.', 'Imagens responsivas em WebP.', 'Prerender, SEO e dados estruturados.', 'Deploy na Hostinger.'] },
  { type: 'results', title: 'Resultado', state: 'available', content: 'O projeto foi desenvolvido e publicado para um cliente real, cobrindo desde a implementação da interface até o deploy da versão de produção.' },
  {
    type: 'gallery',
    title: 'Galeria',
    state: 'available',
    images: [
      {
        src: '/assets/projects/baito/services.webp',
        alt: 'Seção de serviços e preços da Baito Barbearia.',
        caption: 'Serviços e preços',
        width: 1663,
        height: 973,
      },
      {
        src: '/assets/projects/baito/gallery.webp',
        alt: 'Galeria de fotos do espaço da Baito Barbearia.',
        caption: 'Fotos reais do espaço',
        width: 1678,
        height: 980,
      },
      {
        src: '/assets/projects/baito/mobile.webp',
        alt: 'Página inicial da Baito Barbearia em dispositivo mobile.',
        caption: 'Experiência mobile',
        position: 'center top',
        width: 392,
        height: 854,
      },
    ],
  },
  { type: 'features', title: 'Links', state: 'available', content: 'O site público do projeto está disponível no link abaixo.' },
];

export const clinicManagementProject: Project = {
  slug: 'clinic-management',
  title: 'Sistema de Gestão de Clínica / ILPI',
  shortDescription:
    'Aplicação full stack para gestão de pacientes e residentes, desenvolvida como projeto pessoal em evolução.',
  description:
    'Projeto full stack desenvolvido para explorar a construção de um sistema de gestão voltado a clínicas e instituições de longa permanência, centralizando informações de pacientes, residentes e rotina assistencial.',
  type: 'personal',
  status: 'in-development',
  visibility: 'public',
  featured: true,
  coverImage: {
    src: '/assets/projects/clinic/cover.webp',
    alt: 'Dashboard do sistema de gestão de Clínica e ILPI com sidebar, indicadores e painel operacional.',
    position: 'center left',
    width: 1669,
    height: 979,
  },
  showcase: {
    title: 'Gestão de Clínica / ILPI',
    description: 'Aplicação full stack para gestão de pacientes e residentes, desenvolvida como projeto pessoal em evolução.',
    technologies: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL'],
  },
  technologies: [
    'Java 21',
    'Spring Boot',
    'Angular',
    'PostgreSQL',
    'Hibernate / JPA',
    'REST APIs',
    'TypeScript',
    'Geração de PDF',
  ],
  availability: {
    publicSourceCode: false,
    publicDemo: false,
    publicDocumentation: false,
  },
  caseStudy: [
    {
      type: 'context',
      title: 'Contexto',
      state: 'available',
      content: 'Projeto full stack desenvolvido para explorar a construção de um sistema de gestão voltado a clínicas e instituições de longa permanência, centralizando informações de pacientes, residentes e rotina assistencial.',
    },
    {
      type: 'features',
      title: 'Funcionalidades',
      state: 'available',
      items: [
        'Cadastro de pacientes e residentes.',
        'Documentos, anexos e comorbidades.',
        'Medicações, peso, altura e acompanhamento de IMC.',
        'Registro de sinais vitais e relatório diário de enfermagem.',
        'Gestão de funcionários.',
        'Exportação e geração de informações em PDF.',
      ],
    },
    {
      type: 'architecture',
      title: 'Arquitetura',
      state: 'available',
      content: 'A aplicação separa frontend, API, regras de negócio e persistência em uma estrutura full stack.',
      diagram: {
        nodes: ['Angular', 'REST API', 'Spring Boot', 'Service / Repository', 'Hibernate / JPA', 'PostgreSQL'],
      },
    },
    {
      type: 'technical-decisions',
      title: 'Tecnologias',
      state: 'available',
      items: [
        'Java 21 e Spring Boot no backend.',
        'Angular e TypeScript no frontend.',
        'APIs REST e DTOs para contratos.',
        'Persistência via Hibernate / JPA e PostgreSQL.',
        'Geração de documentos em PDF.',
      ],
    },
    {
      type: 'current-state',
      title: 'Estado atual',
      state: 'available',
      content: 'Projeto em desenvolvimento e utilizado como parte do portfólio para explorar uma aplicação web full stack com tecnologias próximas às utilizadas na experiência profissional.',
    },
    {
      type: 'gallery',
      title: 'Galeria',
      state: 'available',
      images: [
        {
          src: '/assets/projects/clinic/vital-signs.webp',
          alt: 'Módulo de acompanhamento de sinais vitais do VitaCare ILPI.',
          caption: 'Monitoramento de sinais vitais',
          width: 1665,
          height: 981,
        },
        {
          src: '/assets/projects/clinic/login.webp',
          alt: 'Tela de acesso do sistema VitaCare ILPI.',
          caption: 'Acesso seguro ao sistema',
          width: 1665,
          height: 984,
        },
      ],
    },
  ],
};

export const projects: Project[] = [itemRarityProject, baitoBarbeariaProject, clinicManagementProject];
