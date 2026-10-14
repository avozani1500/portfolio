import { RenderMode, ServerRoute } from '@angular/ssr';
import { projects } from './content/projects';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projetos/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => projects.map(({ slug }) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
