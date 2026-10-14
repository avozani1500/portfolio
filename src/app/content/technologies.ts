import { TechnologyGroup } from '../core/models/portfolio-content.model';

export const technologyGroups: TechnologyGroup[] = [
  {
    id: 'backend',
    label: 'Backend',
    technologies: [
      { name: 'Java', primary: true },
      { name: 'Spring Boot', primary: true },
      { name: 'Hibernate / JPA' },
      { name: 'REST APIs' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    technologies: [
      { name: 'Angular', primary: true },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Angular Material' },
      { name: 'JSF' },
      { name: 'PrimeFaces' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    technologies: [
      { name: 'PostgreSQL', primary: true },
      { name: 'MySQL' },
      { name: 'SQL' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    technologies: [
      { name: 'Keycloak' },
      { name: 'OAuth2' },
      { name: 'JWT' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Ecosystem',
    technologies: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Maven' },
      { name: 'Docker' },
      { name: 'IntelliJ IDEA' },
    ],
  },
  {
    id: 'reporting',
    label: 'Reporting & Documents',
    technologies: [
      { name: 'JasperReports' },
      { name: 'iText' },
    ],
  },
  {
    id: 'agile-delivery',
    label: 'Agile & Delivery',
    technologies: [
      { name: 'Metodologias ágeis' },
      { name: 'Sprints semanais' },
      { name: 'Story Points' },
      { name: 'Planejamento de tarefas' },
      { name: 'Acompanhamento de backlog/pendências' },
    ],
  },
];
