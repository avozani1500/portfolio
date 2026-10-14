import { Component, HostListener, inject, signal } from '@angular/core';
import { PaletteId, ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-palette-picker',
  standalone: true,
  template: `
    <div class="palette-picker" (click)="$event.stopPropagation()">
      <button
        class="palette-trigger"
        type="button"
        aria-label="Escolher paleta de cores"
        aria-controls="palette-options"
        [attr.aria-expanded]="isOpen()"
        (click)="toggle()"
      >
        <span class="palette-trigger-swatch" aria-hidden="true"></span>
        <span class="visually-hidden">Paleta: {{ activePaletteLabel() }}</span>
      </button>

      @if (isOpen()) {
        <div id="palette-options" class="palette-menu" role="menu" aria-label="Paletas de cores">
          <p class="palette-menu-title">Paleta de cores</p>
          @for (palette of themeService.palettes; track palette.id) {
            <button
              class="palette-option"
              type="button"
              role="menuitemradio"
              [attr.aria-checked]="themeService.palette() === palette.id"
              [class.is-selected]="themeService.palette() === palette.id"
              (click)="select(palette.id)"
            >
              <span class="palette-swatches" aria-hidden="true">
                <span [style.background-color]="palette.lightSwatch"></span>
                <span [style.background-color]="palette.darkSwatch"></span>
              </span>
              <span class="palette-option-copy">
                <strong>{{ palette.label }}</strong>
                <small>{{ palette.description }}</small>
              </span>
              @if (themeService.palette() === palette.id) {
                <span class="palette-check" aria-hidden="true">✓</span>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: inline-flex; }
    .palette-picker { position: relative; }
    .palette-trigger {
      display: inline-grid;
      width: 2.25rem;
      height: 2.25rem;
      place-items: center;
      border: 1px solid var(--color-border);
      border-radius: .65rem;
      background: transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
    }
    .palette-trigger:hover, .palette-trigger:focus-visible { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 7%, transparent); color: var(--color-accent); transform: translateY(-1px); }
    .palette-trigger-swatch {
      display: block;
      width: 1rem;
      height: 1rem;
      border: 2px solid var(--color-surface-elevated);
      border-radius: .35rem;
      background: var(--color-accent);
      box-shadow: 0 0 0 1px var(--color-accent);
    }
    .palette-menu {
      position: absolute;
      z-index: 20;
      top: calc(100% + .65rem);
      right: 0;
      display: grid;
      width: min(17rem, calc(100vw - 2rem));
      gap: .3rem;
      padding: .55rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface-elevated);
      box-shadow: var(--shadow-subtle);
      pointer-events: auto;
    }
    .palette-menu-title {
      margin: .3rem .55rem .45rem;
      color: var(--color-text-muted);
      font-size: .7rem;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
    }
    .palette-option {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: .7rem;
      width: 100%;
      padding: .65rem .55rem;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--color-text);
      text-align: left;
      cursor: pointer;
    }
    .palette-option:hover,
    .palette-option.is-selected { border-color: var(--color-border); background: var(--color-accent-soft); }
    .palette-swatches { display: inline-flex; gap: .2rem; }
    .palette-swatches span { width: .75rem; height: 1.35rem; border-radius: .25rem; }
    .palette-option-copy { display: grid; gap: .15rem; }
    .palette-option-copy strong { font-size: .82rem; }
    .palette-option-copy small { color: var(--color-text-muted); font-size: .68rem; line-height: 1.3; }
    .palette-check { color: var(--color-accent); font-weight: 700; }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    @media (prefers-reduced-motion: reduce) {
      .palette-trigger, .palette-option { transition: none; }
      .palette-trigger:hover, .palette-trigger:focus-visible { transform: none; }
    }
  `,
})
export class PalettePickerComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly isOpen = signal(false);

  protected activePaletteLabel(): string {
    return this.themeService.palettes.find((palette) => palette.id === this.themeService.palette())?.label ?? 'Azul técnico';
  }

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected select(palette: PaletteId): void {
    this.themeService.setPalette(palette);
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click')
  protected closeOnDocumentClick(): void {
    this.isOpen.set(false);
  }
}
