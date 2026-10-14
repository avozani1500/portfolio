import { generatedSiteUrl } from './site-url.generated';

export const siteConfig = {
  name: 'Natan Avozani',
  title: 'Natan Avozani — Desenvolvedor Full Stack',
  description: 'Portfólio de Natan Avozani, desenvolvedor Full Stack com experiência em Java, Spring Boot, Angular, PostgreSQL, APIs REST e sistemas web.',
  locale: 'pt_BR',
  language: 'pt-BR',
  siteUrl: generatedSiteUrl,
  ogImage: '/assets/brand/og/portfolio-og.png',
} as const;

export const publicRouteMetadata = {
  home: {
    title: siteConfig.title,
    description: siteConfig.description,
    path: '/',
  },
  projects: {
    title: 'Projetos — Natan Avozani',
    description: 'Projetos selecionados de desenvolvimento web, sistemas full stack e software open source de Natan Avozani.',
    path: '/projetos',
  },
  notFound: {
    title: 'Página não encontrada — Natan Avozani',
    description: 'A página solicitada não foi encontrada.',
    path: '',
  },
} as const;
