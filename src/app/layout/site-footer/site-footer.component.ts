import { Component } from '@angular/core';
import { externalLinks } from '../../content/external-links';
import { siteContent } from '../../content/site';

@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="site-footer">
      <div class="container footer-inner">
        <p>{{ content.footerMessage }}</p>
        <nav class="footer-links" aria-label="Links profissionais">
          @for (link of professionalLinks; track link.id) {
            <a [href]="link.url" [attr.target]="link.kind === 'email' ? null : '_blank'" [attr.rel]="link.kind === 'email' ? null : 'noopener noreferrer'">{{ link.label }}</a>
          }
        </nav>
        <p>© {{ year }} {{ content.copyrightName }}</p>
      </div>
    </footer>
  `,
  styles: `
    .site-footer { border-top: 1px solid var(--color-border); }
    .footer-inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding-block: 1.5rem; color: var(--color-text-muted); font-size: 0.9rem; }
    .footer-links { display: inline-flex; flex-wrap: wrap; gap: 1rem; }
    .footer-links a { color: inherit; text-decoration: none; }
    .footer-links a:hover { color: var(--color-text); }
  `,
})
export class SiteFooterComponent {
  protected readonly content = siteContent;
  protected readonly professionalLinks = externalLinks.filter((link) =>
    ['github', 'linkedin', 'email'].includes(link.id) && !!link.url,
  );
  protected readonly year = new Date().getFullYear();
}
