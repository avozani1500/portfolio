import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { siteConfig } from '../../content/site-config';

export interface SeoMetadata {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);

  setPage(metadata: SeoMetadata): void {
    this.document.title = metadata.title;
    this.setDescription(metadata.description);
    this.setRobots(metadata.noIndex === true);
    this.setCanonical(metadata.path);
    this.setMeta('og:title', metadata.title, 'property');
    this.setMeta('og:description', metadata.description, 'property');
    this.setMeta('og:type', 'website', 'property');
    this.setMeta('og:site_name', siteConfig.name, 'property');
    this.setMeta('og:locale', siteConfig.locale, 'property');
    this.setMeta('twitter:card', 'summary_large_image', 'name');
    this.setMeta('twitter:title', metadata.title, 'name');
    this.setMeta('twitter:description', metadata.description, 'name');
    this.removeMeta('og:url', 'property');
    this.removeMeta('twitter:image', 'name');
    this.removeJsonLd();

    if (siteConfig.siteUrl && metadata.path !== undefined) {
      this.setMeta('og:url', this.absoluteUrl(metadata.path), 'property');
    }
    if (siteConfig.siteUrl && siteConfig.ogImage) {
      this.setMeta('twitter:image', this.absoluteUrl(siteConfig.ogImage), 'name');
      this.setMeta('og:image', this.absoluteUrl(siteConfig.ogImage), 'property');
    } else {
      this.removeMeta('og:image', 'property');
    }
    if (metadata.jsonLd) this.setJsonLd(metadata.jsonLd);
  }

  setDescription(description: string): void {
    let tag = this.document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = this.document.createElement('meta');
      tag.name = 'description';
      this.document.head.appendChild(tag);
    }
    tag.content = description;
  }

  private setCanonical(path?: string): void {
    const existing = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    existing?.remove();
    if (!siteConfig.siteUrl || path === undefined) return;
    const link = this.document.createElement('link');
    link.rel = 'canonical';
    link.href = this.absoluteUrl(path);
    this.document.head.appendChild(link);
  }

  private setRobots(noIndex: boolean): void {
    this.setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow', 'name');
  }

  private setMeta(key: string, content: string, attribute: 'name' | 'property'): void {
    let tag = this.document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!tag) {
      tag = this.document.createElement('meta');
      tag.setAttribute(attribute, key);
      this.document.head.appendChild(tag);
    }
    tag.content = content;
  }

  private removeMeta(key: string, attribute: 'name' | 'property'): void {
    this.document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)?.remove();
  }

  private setJsonLd(data: Record<string, unknown>): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'portfolio-jsonld';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private removeJsonLd(): void { this.document.head.querySelector('#portfolio-jsonld')?.remove(); }

  private absoluteUrl(path: string): string { return `${siteConfig.siteUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`; }
}
