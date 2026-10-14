import { ExternalLink } from '../core/models/portfolio-content.model';

// Fonte única dos links profissionais. Componentes só renderizam entradas com URL.
export const externalLinks: ExternalLink[] = [
  { id: 'resume', label: 'Currículo', kind: 'resume', url: '/assets/documents/natan-avozani-curriculo.pdf' },
  { id: 'github', label: 'GitHub', kind: 'github', url: 'https://github.com/avozani1500' },
  { id: 'linkedin', label: 'LinkedIn', kind: 'linkedin', url: 'https://www.linkedin.com/in/natan-luiz-avozani/' },
  { id: 'whatsapp', label: 'WhatsApp', kind: 'other', url: 'https://wa.me/5546999186028' },
  { id: 'email', label: 'E-mail', kind: 'email', url: 'mailto:avozani19@gmail.com' },
];
