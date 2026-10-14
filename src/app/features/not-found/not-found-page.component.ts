import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { publicRouteMetadata } from '../../content/site-config';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="section" aria-labelledby="not-found-title">
      <div class="container"><p class="eyebrow">404</p><h1 id="not-found-title">Página não encontrada.</h1><a routerLink="/">Voltar ao início</a></div>
    </section>
  `,
  styles: `
    h1 { margin-bottom: var(--space-5); }
    a { color: var(--color-accent); font-weight: 700; }
  `,
})
export class NotFoundPageComponent {
  constructor(seo: SeoService) { seo.setPage({ ...publicRouteMetadata.notFound, noIndex: true }); }
}
