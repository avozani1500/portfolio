import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

type Theme = 'light' | 'dark';
export type PaletteId = 'technical' | 'copper' | 'sage' | 'terracotta' | 'violet' | 'amber';

export interface PaletteDefinition {
  id: PaletteId;
  label: string;
  description: string;
  lightSwatch: string;
  darkSwatch: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'portfolio-theme';
  private readonly paletteStorageKey = 'portfolio-palette';
  readonly palettes: readonly PaletteDefinition[] = [
    {
      id: 'technical',
      label: 'Azul técnico',
      description: 'A paleta original do portfólio.',
      lightSwatch: '#245a8d',
      darkSwatch: '#79b8f3',
    },
    {
      id: 'copper',
      label: 'Cobre',
      description: 'Neutros quentes com destaque cobre.',
      lightSwatch: '#9a6044',
      darkSwatch: '#d09a68',
    },
    {
      id: 'sage',
      label: 'Sálvia',
      description: 'Neutros naturais com destaque verde sálvia.',
      lightSwatch: '#647d62',
      darkSwatch: '#9bb58d',
    },
    {
      id: 'terracotta',
      label: 'Terracota',
      description: 'Uma variação quente, sóbria e acolhedora.',
      lightSwatch: '#a8543f',
      darkSwatch: '#d4876f',
    },
    {
      id: 'violet',
      label: 'Violeta',
      description: 'Contraste frio com um accent mais expressivo.',
      lightSwatch: '#7655a6',
      darkSwatch: '#b69ae8',
    },
    {
      id: 'amber',
      label: 'Âmbar',
      description: 'Neutros suaves com destaque dourado.',
      lightSwatch: '#a36b1f',
      darkSwatch: '#d7a95b',
    },
  ];
  readonly isDark = signal(this.resolveInitialTheme() === 'dark');
  readonly palette = signal<PaletteId>(this.resolveInitialPalette());

  constructor() {
    this.apply(this.isDark() ? 'dark' : 'light');
    this.applyPalette(this.palette());
  }

  toggle(): void {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    this.isDark.set(next === 'dark');
    this.apply(next);
  }

  setPalette(palette: PaletteId): void {
    if (!this.palettes.some((option) => option.id === palette)) return;
    this.palette.set(palette);
    this.applyPalette(palette);
  }

  private resolveInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'dark';
    try {
      const saved = window.localStorage.getItem(this.storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  }

  private resolveInitialPalette(): PaletteId {
    if (!isPlatformBrowser(this.platformId)) return 'technical';
    try {
      const saved = window.localStorage.getItem(this.paletteStorageKey);
      if (saved === 'technical' || saved === 'copper' || saved === 'sage' || saved === 'terracotta' || saved === 'violet' || saved === 'amber') return saved;
    } catch {
      // Use the default palette when storage is unavailable.
    }
    return 'technical';
  }

  private apply(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
    if (isPlatformBrowser(this.platformId)) {
      try {
        window.localStorage.setItem(this.storageKey, theme);
      } catch {
        // Theme remains active for the current session when storage is unavailable.
      }
    }
  }

  private applyPalette(palette: PaletteId): void {
    this.document.documentElement.setAttribute('data-palette', palette);
    if (isPlatformBrowser(this.platformId)) {
      try {
        window.localStorage.setItem(this.paletteStorageKey, palette);
      } catch {
        // Palette remains active for the current session when storage is unavailable.
      }
    }
  }
}
