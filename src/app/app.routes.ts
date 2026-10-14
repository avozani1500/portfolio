import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page/home-page.component').then(
        ({ HomePageComponent }) => HomePageComponent,
      ),
  },
  {
    path: 'projetos',
    loadComponent: () =>
      import('./features/projects/project-list-page/project-list-page.component').then(
        ({ ProjectListPageComponent }) => ProjectListPageComponent,
      ),
  },
  {
    path: 'projetos/:slug',
    loadComponent: () =>
      import('./features/projects/project-detail-page/project-detail-page.component').then(
        ({ ProjectDetailPageComponent }) => ProjectDetailPageComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found-page.component').then(
        ({ NotFoundPageComponent }) => NotFoundPageComponent,
      ),
  },
];
