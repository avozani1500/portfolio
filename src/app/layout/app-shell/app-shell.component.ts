import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from '../site-header/site-header.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';
import { SkipLinkComponent } from '../skip-link/skip-link.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent, SkipLinkComponent],
  template: `
    <app-skip-link />
    <app-site-header />
    <main id="main-content" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styles: `
    :host { display: block; min-height: 100dvh; }
    main { min-height: 60vh; }
  `,
})
export class AppShellComponent {}
