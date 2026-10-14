import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { externalLinks } from '../../content/external-links';
import { PalettePickerComponent } from '../palette-picker/palette-picker.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, PalettePickerComponent, ThemeToggleComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent implements AfterViewInit, OnDestroy {
  protected readonly externalLinks = externalLinks.filter((link) =>
    ['github', 'linkedin'].includes(link.id) && !!link.url && /^(https?:\/\/|mailto:)/.test(link.url),
  );
  protected readonly isScrolled = signal(false);
  private scrollFrame?: number;
  private readonly handleScroll = (): void => {
    if (this.scrollFrame !== undefined) return;
    this.scrollFrame = window.requestAnimationFrame(() => {
      this.isScrolled.set(window.scrollY > 16);
      this.scrollFrame = undefined;
    });
  };

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.handleScroll);
    if (this.scrollFrame !== undefined) window.cancelAnimationFrame(this.scrollFrame);
  }
}
