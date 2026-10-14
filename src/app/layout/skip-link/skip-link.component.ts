import { Component } from '@angular/core';

@Component({
  selector: 'app-skip-link',
  template: `<a class="skip-link" href="#main-content">Pular para o conteúdo</a>`,
  styles: `
    .skip-link {
      position: fixed;
      z-index: 20;
      top: 1rem;
      left: 1rem;
      padding: 0.65rem 0.9rem;
      border-radius: 0.5rem;
      background: var(--color-text);
      color: var(--color-page);
      transform: translateY(-180%);
      transition: transform 160ms ease;
    }
    .skip-link:focus { transform: translateY(0); }
  `,
})
export class SkipLinkComponent {}
