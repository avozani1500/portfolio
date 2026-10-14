import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project, ProjectStatus, ProjectType } from '../../../core/models/project.model';
import { ProjectContentService } from '../services/project-content.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-project-detail-page',
  imports: [RouterLink],
  template: `
    @if (project) {
      <main class="case-page">
        <section class="case-hero" aria-labelledby="project-title">
          <div class="container case-hero-content">
            <a class="back-link" routerLink="/projetos">← Todos os projetos</a>
            <div class="project-meta">
              <span>{{ projectTypeLabel(project.type) }}</span>
              <span>{{ projectStatusLabel(project.status) }}</span>
            </div>
            <p class="case-project-label">{{ project.title }}</p>
            <h1 id="project-title">{{ project.caseStudyTitle || project.title }}</h1>
            <p class="hero-description">{{ project.description }}</p>
            <div class="hero-facts">
              @if (project.role) { <span><strong>Atuação</strong>{{ project.role }}</span> }
              @if (project.period) { <span><strong>Período</strong>{{ project.period }}</span> }
              @if (project.release) { <span><strong>Release</strong>{{ project.release }}</span> }
              <span><strong>Visibilidade</strong>{{ project.visibility === 'public' ? 'Pública' : 'Limitada' }}</span>
            </div>
            <div class="hero-stack" aria-label="Tecnologias do projeto">
              @for (technology of project.showcase?.technologies || project.technologies.slice(0, 6); track technology) {
                <span>{{ technology }}</span>
              }
            </div>
          </div>
        </section>

        <div class="container case-layout">
          <aside class="case-navigation" aria-label="Navegação do case study">
            <p>Conteúdo do case</p>
            <nav>
              @for (section of project.caseStudy; track $index) {
                <button
                  type="button"
                  class="case-navigation-link"
                  [class.is-active]="activeSection() === 'case-section-' + $index"
                  [attr.aria-current]="activeSection() === 'case-section-' + $index ? 'location' : null"
                  (click)="scrollToSection($event, 'case-section-' + $index)"
                >{{ section.title }}</button>
              }
            </nav>
          </aside>

          <article class="case-content">
            @for (section of project.caseStudy; track $index) {
              <section class="case-section" [id]="'case-section-' + $index" [attr.aria-labelledby]="'case-section-title-' + $index">
                <div class="section-heading">
                  <span class="section-index">{{ ($index + 1).toString().padStart(2, '0') }}</span>
                  <h2 [id]="'case-section-title-' + $index">{{ section.title }}</h2>
                </div>
                @if (section.content) { <p class="section-content">{{ section.content }}</p> }
                @if (section.items?.length) {
                  <ul class="technical-list">
                    @for (item of section.items; track item) { <li>{{ item }}</li> }
                  </ul>
                }
                @if (section.metrics?.length) {
                  <div class="metrics-grid">
                    @for (metric of section.metrics; track metric.label) {
                      <div class="metric"><strong>{{ metric.value }}</strong><span>{{ metric.label }}</span>@if (metric.description) { <small>{{ metric.description }}</small> }</div>
                    }
                  </div>
                }
                @if (section.diagram) {
                  <div class="diagram" aria-label="Diagrama do pipeline de processamento">
                    <div class="diagram-flow">
                      @for (node of section.diagram.nodes; track node; let last = $last) {
                        <span class="diagram-node">{{ node }}</span>
                        @if (!last) { <span class="diagram-arrow" aria-hidden="true">→</span> }
                      }
                    </div>
                    @for (branch of section.diagram.branches || []; track branch.label) {
                      <div class="diagram-branch">
                        <strong>{{ branch.label }}</strong>
                        <div class="diagram-flow">
                          @for (node of branch.nodes; track node; let last = $last) {
                            <span class="diagram-node">{{ node }}</span>
                            @if (!last) { <span class="diagram-arrow" aria-hidden="true">→</span> }
                          }
                        </div>
                        @if (branch.note) { <p>{{ branch.note }}</p> }
                      </div>
                    }
                    @if (section.diagram.note) { <p class="diagram-note">{{ section.diagram.note }}</p> }
                  </div>
                }
                @if (section.type === 'gallery') {
                  @if (section.images?.length) {
                    <div class="gallery-grid">
                      @for (image of section.images; track image.src) {
                        <figure class="gallery-item">
                          <img [src]="image.src" [alt]="image.alt" [style.object-position]="image.position || 'center'" [attr.width]="image.width || null" [attr.height]="image.height || null" loading="lazy" />
                          @if (image.caption) { <figcaption>{{ image.caption }}</figcaption> }
                        </figure>
                      }
                    </div>
                  } @else {
                    <div class="media-placeholder">Área preparada para diagramas, screenshots ou imagens do projeto.</div>
                  }
                }
                @if ((section.title === 'Links' || section.title === 'Links externos') && project.externalLinks?.length) {
                  <div class="external-links">
                    @for (link of project.externalLinks; track link.url) {
                      <a [href]="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }} <span aria-hidden="true">↗</span></a>
                    }
                  </div>
                }
                @if (section.state === 'planned') { <p class="section-status">Conteúdo técnico a detalhar em uma próxima etapa.</p> }
              </section>
            }
          </article>
        </div>

        <nav class="project-navigation container" aria-label="Navegação entre projetos">
          @if (previousProject) { <a [routerLink]="['/projetos', previousProject.slug]">← {{ projectDisplayTitle(previousProject) }}</a> } @else { <span></span> }
          @if (nextProject) { <a class="next-project" [routerLink]="['/projetos', nextProject.slug]">{{ projectDisplayTitle(nextProject) }} →</a> }
        </nav>
      </main>
    } @else {
      <section class="not-found-case" aria-labelledby="not-found-title">
        <div class="container">
          <p class="eyebrow">Case study</p>
          <h1 id="not-found-title">Projeto não encontrado</h1>
          <a class="back-link" routerLink="/projetos">Voltar para projetos</a>
      </div>
      </section>
    }
  `,
  styles: `
    .case-page { background: var(--color-page); }
    .case-hero { padding-block: clamp(5rem, 12vw, 9rem) clamp(4rem, 9vw, 7rem); background: linear-gradient(120deg, var(--color-surface-base), var(--color-surface-emphasis)); }
    .case-hero-content { max-width: 58rem; }
    .back-link { display: inline-block; color: var(--color-accent); font-weight: 700; text-decoration: none; }
    .back-link:hover { color: var(--color-accent-strong); }
    .project-meta { display: flex; flex-wrap: wrap; gap: .7rem 1.25rem; margin-top: var(--space-7); color: var(--color-text-muted); font-size: .78rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .case-project-label { margin-top: var(--space-5); color: var(--color-accent); font-size: .9rem; font-weight: 700; }
    h1 { max-width: 54rem; margin-top: var(--space-4); }
    .hero-description { max-width: 44rem; margin-top: var(--space-5); color: var(--color-text-muted); font-size: clamp(1.1rem, 2vw, 1.35rem); }
    .hero-facts { display: flex; flex-wrap: wrap; gap: var(--space-5) var(--space-7); margin-top: var(--space-7); }
    .hero-facts span { display: grid; gap: .15rem; color: var(--color-text-muted); font-size: .9rem; }
    .hero-facts strong { color: var(--color-text); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; }
    .hero-stack { display: flex; flex-wrap: wrap; gap: .45rem .8rem; margin-top: var(--space-5); color: var(--color-text-muted); font-size: .86rem; }
    .hero-stack span + span::before { margin-right: .8rem; color: var(--color-accent); content: '·'; }
    .case-layout { display: grid; gap: var(--space-8); padding-block: clamp(4rem, 9vw, 7rem); }
    .case-navigation { align-self: start; }
    .case-navigation > p { color: var(--color-accent); font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    .case-navigation nav { display: grid; gap: .55rem; margin-top: var(--space-4); }
    .case-navigation-link { display: block; width: 100%; padding: 0 0 0 .7rem; border: 0; border-left: 2px solid transparent; background: transparent; color: var(--color-text-muted); cursor: pointer; font: inherit; font-size: .92rem; text-align: left; transition: color 180ms ease, border-color 180ms ease; }
    .case-navigation-link:hover { color: var(--color-accent); }
    .case-navigation-link.is-active { border-left-color: var(--color-accent); color: var(--color-text); font-weight: 700; }
    .case-content { min-width: 0; }
    .case-section { scroll-margin-top: 8rem; padding-block: var(--space-7); border-top: 1px solid color-mix(in srgb, var(--color-border) 68%, transparent); }
    .case-section:first-child { padding-top: 0; border-top: 0; }
    .section-heading { display: flex; gap: var(--space-4); align-items: baseline; }
    .section-index { color: var(--color-accent); font-size: .78rem; font-weight: 700; letter-spacing: .08em; }
    .section-heading h2 { font-size: clamp(1.45rem, 3vw, 2.15rem); }
    .section-content { max-width: 46rem; margin-top: var(--space-5); color: var(--color-text-muted); font-size: 1.06rem; }
    .technical-list { display: grid; gap: .75rem; max-width: 46rem; margin: var(--space-5) 0 0; padding: 0; color: var(--color-text-muted); list-style: none; }
    .technical-list li { padding-left: 1.2rem; position: relative; }
    .technical-list li::before { position: absolute; left: 0; color: var(--color-accent); content: '—'; }
    .section-status { margin-top: var(--space-5); color: var(--color-text-muted); font-size: .86rem; font-style: italic; }
    .metrics-grid { display: grid; gap: var(--space-3); margin-top: var(--space-5); }
    .metric { display: grid; gap: .2rem; padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface-elevated); }
    .metric strong { color: var(--color-text); font-size: 1.5rem; }
    .metric span, .metric small { color: var(--color-text-muted); }
    .diagram { display: grid; gap: var(--space-5); margin-top: var(--space-6); padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-elevated); }
    .diagram-flow { display: flex; flex-wrap: wrap; align-items: center; gap: .55rem; }
    .diagram-node { padding: .55rem .7rem; border: 1px solid color-mix(in srgb, var(--color-accent) 35%, var(--color-border)); border-radius: var(--radius-sm); color: var(--color-text); font-size: .82rem; }
    .diagram-arrow { color: var(--color-accent); font-weight: 700; }
    .diagram-branch { display: grid; gap: .7rem; padding-top: var(--space-4); border-top: 1px solid var(--color-border); }
    .diagram-branch strong { color: var(--color-accent); font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; }
    .diagram-branch p, .diagram-note { color: var(--color-text-muted); font-size: .88rem; }
    .gallery-grid { display: grid; gap: var(--space-4); margin-top: var(--space-5); }
    .gallery-grid img { display: block; width: 100%; height: auto; border-radius: var(--radius-sm); object-fit: contain; }
    .gallery-item { margin: 0; }
    .gallery-item figcaption { margin-top: .6rem; color: var(--color-text-muted); font-size: .86rem; }
    .media-placeholder { margin-top: var(--space-5); padding: var(--space-7); border: 1px dashed var(--color-border); border-radius: var(--radius-md); color: var(--color-text-muted); text-align: center; }
    .project-navigation { display: flex; justify-content: space-between; gap: var(--space-5); padding-block: var(--space-7) var(--space-8); border-top: 1px solid var(--color-border); }
    .project-navigation a { color: var(--color-accent); font-weight: 700; text-decoration: none; }
    .external-links { display: flex; flex-wrap: wrap; gap: 1rem 1.5rem; margin-top: var(--space-5); }
    .external-links a { color: var(--color-accent); font-weight: 700; text-decoration: none; }
    .next-project { text-align: right; }
    .not-found-case { padding-block: 8rem; }

    @media (min-width: 48rem) {
      .case-layout { grid-template-columns: minmax(12rem, .34fr) minmax(0, 1fr); align-items: start; }
      .case-navigation { position: sticky; top: 6rem; }
      .metrics-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (prefers-reduced-motion: reduce) {
      .case-navigation-link, .back-link { transition: none; }
    }
  `,
})
export class ProjectDetailPageComponent implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectContentService);
  private readonly seo = inject(SeoService);
  protected readonly project: Project | undefined = this.projectService.getBySlug(this.route.snapshot.paramMap.get('slug') ?? '');
  private readonly projectIndex = this.project ? this.projectService.getAll().findIndex((item) => item.slug === this.project?.slug) : -1;
  protected readonly previousProject = this.projectIndex > 0 ? this.projectService.getAll()[this.projectIndex - 1] : undefined;
  protected readonly nextProject = this.projectIndex >= 0 ? this.projectService.getAll()[this.projectIndex + 1] : undefined;
  protected readonly activeSection = signal('case-section-0');
  private removeScrollListener?: () => void;
  private scrollFrame?: number;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    if (this.project) {
      const descriptions: Record<string, string> = {
        'item-rarity': 'Mod open source para Project Zomboid que adiciona raridade aos itens com base no loot e em características de utilidade.',
        'baito-barbearia': 'Website institucional desenvolvido para uma barbearia local, com Angular, responsividade, SEO e publicação em produção.',
        'clinic-management': 'Projeto pessoal full stack para gestão de pacientes e residentes, desenvolvido com Java, Spring Boot, Angular e PostgreSQL.',
      };
      this.seo.setPage({ title: `${this.project.showcase?.title || this.project.title} — Natan Avozani`, description: descriptions[this.project.slug] || this.project.shortDescription, path: `/projetos/${this.project.slug}` });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.project) return;

    const onScroll = (): void => {
      if (this.scrollFrame !== undefined) return;

      this.scrollFrame = window.requestAnimationFrame(() => {
        this.scrollFrame = undefined;
        this.updateActiveSection();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.removeScrollListener = () => window.removeEventListener('scroll', onScroll);
    this.updateActiveSection();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.removeScrollListener?.();
      if (this.scrollFrame !== undefined) window.cancelAnimationFrame(this.scrollFrame);
    }
  }

  private updateActiveSection(): void {
    const header = document.querySelector<HTMLElement>('.site-header');
    const activationLine = (header?.getBoundingClientRect().bottom ?? 72) + 48;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.case-section'));
    let currentSection = sections[0]?.id;

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= activationLine) {
        currentSection = section.id;
      } else {
        break;
      }
    }

    if (currentSection) this.activeSection.set(currentSection);
  }

  protected scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    const header = document.querySelector<HTMLElement>('.site-header');
    const headerHeight = header?.getBoundingClientRect().height ?? 72;
    const topOffset = headerHeight + 36;
    const targetTop = Math.max(0, section.getBoundingClientRect().top + window.scrollY - topOffset);

    window.scrollTo({ top: targetTop, behavior: 'auto' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${sectionId}`);
    this.activeSection.set(sectionId);
  }

  protected projectTypeLabel(type: ProjectType): string {
    return { professional: 'Projeto profissional', personal: 'Projeto pessoal', freelance: 'Freelance', 'open-source': 'Open source' }[type];
  }

  protected projectDisplayTitle(project: Project): string {
    return project.showcase?.title || project.title;
  }

  protected projectStatusLabel(status: ProjectStatus): string {
    return { 'in-development': 'Em desenvolvimento', active: 'Publicado', completed: 'Concluído', maintenance: 'Em manutenção', archived: 'Arquivado' }[status];
  }
}
