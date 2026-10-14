import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      class="theme-toggle"
      type="button"
      [attr.aria-label]="themeService.isDark() ? 'Usar tema claro' : 'Usar tema escuro'"
      [attr.aria-pressed]="themeService.isDark()"
      (click)="themeService.toggle()"
    >
      <span aria-hidden="true">{{ themeService.isDark() ? '☀' : '☾' }}</span>
    </button>
  `,
  styles: `
    .theme-toggle { display: inline-grid; width: 2.25rem; height: 2.25rem; place-items: center; border: 1px solid var(--color-border); border-radius: .65rem; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 1rem; transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, transform 180ms ease; }
    .theme-toggle:hover, .theme-toggle:focus-visible { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 7%, transparent); color: var(--color-accent); transform: translateY(-1px); }
    @media (prefers-reduced-motion: reduce) { .theme-toggle { transition: none; } .theme-toggle:hover, .theme-toggle:focus-visible { transform: none; } }
  `,
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
