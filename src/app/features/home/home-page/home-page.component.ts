import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  computed,
  signal,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, ProjectStatus, ProjectType } from '../../../core/models/project.model';
import { experienceSummary } from '../../../content/experience';
import { externalLinks } from '../../../content/external-links';
import { profile } from '../../../content/profile';
import { technologyGroups } from '../../../content/technologies';
import { ProjectContentService } from '../../projects/services/project-content.service';
import { IntroLoaderComponent } from '../../../layout/intro-loader/intro-loader.component';
import { SeoService } from '../../../core/services/seo.service';
import { publicRouteMetadata, siteConfig } from '../../../content/site-config';

interface HomeStage {
  number: string;
  label: string;
  id: string;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, IntroLoaderComponent],
  template: `
    <aside class="home-progress" aria-label="Progresso da apresentação">
      <div class="progress-list">
        @for (stage of stages; track stage.number) {
          <a
            class="progress-item"
            [class.is-active]="activeStage() === stage.number"
            [href]="'#' + stage.id"
            [attr.aria-current]="activeStage() === stage.number ? 'step' : null"
          >
            <span class="progress-number">{{ stage.number }}</span>
            <span class="progress-label">{{ stage.label }}</span>
          </a>
        }
      </div>
      <p class="visually-hidden" aria-live="polite">Etapa atual: {{ activeStageLabel() }}</p>
    </aside>

    <section id="introducao" class="stage stage-introduction" data-stage="01" aria-labelledby="introduction-title">
      <div class="hero-tech-scene" aria-hidden="true">
        <svg class="hero-tech-structure" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice">
          <g class="hero-tech-lines">
            <path d="M30 168h220m-140 32h320m-390 34h240m450-66h310m-390 34h460m-510 36h300M80 520h280m-190 34h410m-320 38h230m300-70h360m-190 34h280" />
            <path d="M220 74v180m48-220v290m700-210v260m54-200v300M120 350h180m650 0h210" />
            <path class="hero-tech-grid" d="M300 150h510v360H300zM330 185h450M330 220h450M330 255h450M330 290h450M330 325h450M330 360h450M330 395h450M330 430h450M330 465h450M360 150v360M410 150v360M460 150v360M510 150v360M560 150v360M610 150v360M660 150v360M710 150v360M760 150v360" />
          </g>
          <g class="hero-tech-fragments">
            <rect x="156" y="136" width="30" height="9" /><rect x="246" y="474" width="54" height="11" /><rect x="822" y="184" width="42" height="8" /><rect x="900" y="452" width="62" height="10" />
            <rect x="180" y="574" width="18" height="18" /><rect x="910" y="108" width="16" height="16" /><rect x="1010" y="520" width="28" height="12" />
          </g>
          <g class="hero-tech-nodes">
            <circle cx="300" cy="150" r="6" /><circle cx="810" cy="510" r="6" /><circle cx="218" cy="520" r="5" /><circle cx="942" cy="350" r="5" /><circle cx="760" cy="185" r="4" />
          </g>
        </svg>
      </div>
      <app-intro-loader (finished)="onIntroFinished()" />
      <div class="container introduction-grid">
        <div class="reveal-block">
          <p class="stage-number">01 / Introdução</p>
          <h1 id="introduction-title">{{ profile.name }}</h1>
          <p class="role hero-role">{{ profile.title }}</p>
          <p class="lead">{{ profile.introduction }}</p>
          <p class="introduction-meta">Desenvolvimento de software desde {{ profile.experienceSince }}</p>
        </div>
      </div>
    </section>

    <section id="sobre-experiencia" class="stage stage-about" data-stage="02" aria-labelledby="about-title">
      <div class="container about-grid reveal-block">
        <div>
          <p class="stage-number">02 / Sobre / Experiência</p>
          <h2 id="about-title">{{ profile.aboutTitle }}</h2>
        </div>
        <div class="about-copy">
          <p class="section-copy">{{ profile.aboutDescription }}</p>
          <ul class="area-list" aria-label="Áreas de atuação">
            @for (area of experienceSummary.areas; track area) {
              <li>{{ area }}</li>
            }
          </ul>
        </div>
      </div>
    </section>

    <section id="tecnologias-praticas" class="stage stage-technologies" data-stage="03" aria-labelledby="technologies-title">
      <div class="container">
        <div class="reveal-block">
          <p class="stage-number">03 / Tecnologias / Práticas</p>
          <h2 id="technologies-title">{{ profile.technologiesTitle }}</h2>
        </div>
        <div class="technology-groups">
          @for (group of technologyGroups; track group.id) {
            <div class="technology-group reveal-block" [style.--reveal-delay.ms]="$index * 70">
              <span>{{ group.label }}</span>
              <div class="technology-list">
                @for (technology of group.technologies; track technology.name) {
                  <strong [class.is-primary]="technology.primary">{{ technology.name }}</strong>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section id="projetos" class="stage stage-work" data-stage="04" aria-labelledby="selected-work-title">
      <div class="container work-showcase" tabindex="0" aria-label="Vitrine de projetos" (keydown)="onShowcaseKeydown($event)">
        <div class="work-showcase-heading">
          <div class="work-context">
            <p class="stage-number">04 / Projetos</p>
            <h2 id="selected-work-title">{{ profile.selectedWorkTitle }}</h2>
          </div>
          <p class="context-copy">{{ profile.selectedWorkDescription }}</p>
        </div>

        <div class="work-paginator" role="tablist" aria-label="Selecionar projeto">
          @for (project of featuredProjects; track project.slug; let index = $index) {
            <button
              type="button"
              class="work-paginator-item"
              [class.is-active]="activeProjectIndex() === index"
              [attr.aria-current]="activeProjectIndex() === index ? 'true' : null"
              [attr.aria-label]="'Selecionar ' + project.title"
              (click)="selectProject(index)"
            >
              <span>{{ (index + 1).toString().padStart(2, '0') }}</span>
              <strong>{{ project.title }}</strong>
            </button>
          }
        </div>

        @if (activeProject(); as project) {
          <article class="work-showcase-panel reveal-block is-visible" [class.is-switching]="projectTransitioning()" aria-live="polite">
            <div class="work-visual" [attr.aria-label]="project.coverImage?.alt || project.coverAlt || 'Área visual reservada para ' + project.title">
              @if (project.coverImage || project.thumbnail) {
                <img
                  [src]="project.coverImage?.src || project.thumbnail"
                  [alt]="project.coverImage?.alt || project.coverAlt || 'Imagem de ' + project.title"
                  [style.object-position]="project.coverImage?.position || 'center'"
                  [attr.width]="project.coverImage?.width || null"
                  [attr.height]="project.coverImage?.height || null"
                  loading="eager"
                />
              } @else {
                <div class="work-visual-fallback" aria-hidden="true">
                  <span class="work-visual-index">{{ (activeProjectIndex() + 1).toString().padStart(2, '0') }}</span>
                  <span class="work-visual-category">{{ projectTypeLabel(project.type) }}</span>
                  <strong>{{ project.showcase?.title || project.title }}</strong>
                  <i></i><i></i><i></i>
                </div>
              }
            </div>

            <div class="work-showcase-info">
              <div class="work-item-topline">
                <span>{{ projectTypeLabel(project.type) }}</span>
                <span>{{ projectStatusLabel(project.status) }}</span>
              </div>
              <h3>{{ project.showcase?.title || project.title }}</h3>
              <p>{{ project.showcase?.description || project.shortDescription }}</p>
              <div class="showcase-stack" aria-label="Tecnologias do projeto">
                @for (technology of project.showcase?.technologies || project.technologies.slice(0, 4); track technology) {
                  <span>{{ technology }}</span>
                }
              </div>
              <a [routerLink]="['/projetos', project.slug]">Ver projeto <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        }

        <div class="work-controls">
          <button type="button" class="work-control" aria-label="Projeto anterior" (click)="selectPreviousProject()">←</button>
          <span>{{ (activeProjectIndex() + 1).toString().padStart(2, '0') }} / {{ featuredProjects.length.toString().padStart(2, '0') }}</span>
          <button type="button" class="work-control" aria-label="Próximo projeto" (click)="selectNextProject()">→</button>
        </div>
      </div>
    </section>

    <section id="contato" class="stage stage-contact" data-stage="05" aria-labelledby="contact-title">
      <div class="container contact-content reveal-block">
        <p class="stage-number">05 / Contato</p>
        <h2 id="contact-title">{{ profile.contactTitle }}</h2>
        <p class="section-copy">{{ profile.contactDescription }}</p>
        @if (contactLinks.length > 0) {
          <div class="contact-links">
            @for (link of contactLinks; track link.id) {
              <a
                class="contact-icon-link"
                [class.is-email]="link.id === 'email'"
                [class.is-linkedin]="link.id === 'linkedin'"
                [class.is-github]="link.id === 'github'"
                [class.is-whatsapp]="link.id === 'whatsapp'"
                [class.is-resume]="link.id === 'resume'"
                [href]="link.url"
                [attr.target]="link.kind === 'email' ? null : '_blank'"
                [attr.rel]="link.kind === 'email' ? null : 'noopener noreferrer'"
                [attr.aria-label]="contactAriaLabel(link.id)"
                [attr.data-tooltip]="link.label"
              >
                @switch (link.id) {
                  @case ('email') {
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
                  }
                  @case ('linkedin') {
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.8 3.5h14.4A1.3 1.3 0 0 1 20.5 4.8v14.4a1.3 1.3 0 0 1-1.3 1.3H4.8a1.3 1.3 0 0 1-1.3-1.3V4.8a1.3 1.3 0 0 1 1.3-1.3Z" /><path d="M7.3 10v6.8M7.3 7.2v.1M11.1 16.8V10m0 2.1a2.6 2.6 0 0 1 5.2 0v4.7" /></svg>
                  }
                  @case ('github') {
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.5c-2.4.5-2.9-1-2.9-1-.4-1-.9-1.2-.9-1.2-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2 1 2.5.8.1-.6.3-1 .5-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.2 0 0 .8-.3 2.3.9a8 8 0 0 1 4.2 0c1.5-1.2 2.3-.9 2.3-.9.5 1.1.2 2 .1 2.2.6.6.9 1.4.9 2.3 0 3.2-2 4-3.9 4.2.3.3.5.8.5 1.6v2.3c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5Z" /></svg>
                  }
                  @case ('whatsapp') {
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-7.2 13.1L3.8 20.2l3.8-1a8.5 8.5 0 1 0 4.4-15.7Z" /><path d="M8.7 8.6c.2-.3.4-.4.7-.3l1 .2c.2.1.3.2.4.5l.5 1.2c.1.2.1.4-.1.6l-.6.7c-.1.1-.1.3 0 .5.5.9 1.2 1.6 2.1 2 .2.1.4.1.5-.1l.7-.8c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.3.3.5-.1.5-.3.9-.7 1.2-.4.3-.9.4-1.4.2-2.7-.8-4.9-2.9-5.8-5.5-.2-.5-.1-1 .2-1.5Z" /></svg>
                  }
                  @case ('resume') {
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4M9 12h6M9 15.5h4.5" /></svg>
                  }
                }
              </a>
            }
          </div>
        } @else {
          <p class="contact-note">{{ profile.contactUnavailableMessage }}</p>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .stage { position: relative; scroll-margin-top: 6rem; }
    .stage-number { margin-bottom: var(--space-4); color: var(--color-accent); font-size: .78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .stage-introduction { position: relative; display: grid; min-height: min(68vh, 46rem); align-items: center; isolation: isolate; overflow: hidden; padding-block: 6rem 5rem; background: var(--home-introduction-base); }
    .stage-introduction::before, .stage-introduction::after { position: absolute; z-index: -1; inset: 0; content: ''; pointer-events: none; }
    .stage-introduction::before { background-image: var(--asset-introduction-current); background-position: var(--home-introduction-asset-position); background-size: var(--home-introduction-asset-size); background-repeat: no-repeat; opacity: var(--home-introduction-asset-opacity); }
    .stage-introduction::after { background: var(--home-introduction-overlay); }
    .introduction-grid { position: relative; z-index: 3; display: grid; max-width: 58rem; gap: var(--space-7); align-items: end; }
    h1 { max-width: 50rem; }
    .role { margin-top: var(--space-3); color: var(--color-accent-strong); font-size: clamp(1.25rem, 3vw, 1.8rem); font-weight: 600; }
    .lead { max-width: 42rem; margin-top: var(--space-4); color: var(--color-text-muted); font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.5; }
    .introduction-meta { display: inline-flex; align-items: center; gap: .65rem; margin-top: var(--space-5); color: var(--color-text-muted); font-size: .95rem; }

    .stage-work { position: relative; padding-block: 7rem 10rem; background: linear-gradient(180deg, var(--color-surface-base), var(--color-surface-emphasis) 24rem); }
    .stage-work > * { position: relative; z-index: 1; }
    .work-showcase { outline: none; }
    .work-showcase:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 1rem; }
    .work-showcase-heading { display: flex; justify-content: space-between; gap: var(--space-7); align-items: end; }
    .work-context { align-self: start; }
    .work-context h2 { max-width: 34rem; }
    .context-copy { max-width: 30rem; margin: 0; color: var(--color-text-muted); }
    .work-paginator { display: flex; flex-wrap: wrap; gap: .4rem 1.5rem; margin-top: var(--space-7); border-bottom: 1px solid var(--color-border); }
    .work-paginator-item { display: inline-flex; align-items: baseline; gap: .55rem; padding: 0 0 .85rem; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--color-text-muted); cursor: pointer; font: inherit; text-align: left; transition: color 220ms ease, border-color 220ms ease; }
    .work-paginator-item span { color: var(--color-text-muted); font-size: .75rem; font-variant-numeric: tabular-nums; }
    .work-paginator-item strong { font-size: .9rem; font-weight: 700; }
    .work-paginator-item:hover, .work-paginator-item:focus-visible { color: var(--color-text); }
    .work-paginator-item.is-active { border-bottom-color: var(--color-accent); color: var(--color-text); }
    .work-paginator-item.is-active span { color: var(--color-accent); }
    .work-showcase-panel { display: grid; gap: var(--space-5); margin-top: var(--space-7); transition: opacity 260ms ease, transform 260ms ease; }
    .work-showcase-panel.is-switching { opacity: .38; transform: translateY(.35rem); }
    .work-visual { width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid color-mix(in srgb, var(--color-accent) 42%, var(--color-border)); border-radius: var(--radius-sm); background: var(--color-surface-emphasis); }
    .work-visual img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .work-visual-fallback { position: relative; display: grid; min-height: 0; height: 100%; align-content: space-between; overflow: hidden; padding: clamp(1.5rem, 4vw, 3rem); background: radial-gradient(circle at 72% 42%, color-mix(in srgb, var(--color-accent) 15%, transparent), transparent 28%), linear-gradient(135deg, color-mix(in srgb, var(--color-surface-emphasis) 82%, transparent), var(--color-surface-base)); }
    .work-visual-fallback::before, .work-visual-fallback::after { position: absolute; content: ''; pointer-events: none; }
    .work-visual-fallback::before { inset: 16% 10%; border: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent); transform: skewX(-18deg); }
    .work-visual-fallback::after { top: 50%; right: -10%; left: 25%; height: 1px; background: var(--color-accent); opacity: .42; box-shadow: 0 -4rem 0 color-mix(in srgb, var(--color-accent) 20%, transparent), 0 4rem 0 color-mix(in srgb, var(--color-accent) 20%, transparent); }
    .work-visual-fallback > * { position: relative; z-index: 1; }
    .work-visual-index { color: var(--color-accent); font-size: clamp(3rem, 7vw, 6rem); font-weight: 700; line-height: 1; }
    .work-visual-category { color: var(--color-text-muted); font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; }
    .work-visual-fallback strong { max-width: 18rem; font-size: clamp(1.4rem, 3vw, 2.5rem); }
    .work-visual-fallback i { position: absolute; width: .45rem; height: .45rem; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 0 .3rem color-mix(in srgb, var(--color-accent) 18%, transparent); }
    .work-visual-fallback i:nth-of-type(1) { top: 25%; right: 18%; }
    .work-visual-fallback i:nth-of-type(2) { top: 62%; left: 17%; }
    .work-visual-fallback i:nth-of-type(3) { right: 32%; bottom: 20%; }
    .work-showcase-info { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: clamp(1.5rem, 5vw, 6rem); align-items: start; min-width: 0; padding-top: var(--space-4); border-top: 1px solid var(--color-border); }
    .work-item-topline { grid-column: 1 / -1; display: flex; justify-content: space-between; gap: 1rem; color: var(--color-text-muted); font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; }
    .work-showcase-info h3 { grid-column: 1; margin-top: var(--space-5); font-size: clamp(1.8rem, 4vw, 3.1rem); }
    .work-showcase-info p { grid-column: 2; grid-row: 2; max-width: 34rem; margin-top: var(--space-5); color: var(--color-text-muted); font-size: 1.05rem; line-height: 1.55; }
    .showcase-stack { grid-column: 2; display: flex; flex-wrap: wrap; gap: .45rem .8rem; margin-top: var(--space-4); color: var(--color-text); font-size: .86rem; }
    .showcase-stack span + span::before { margin-right: .8rem; color: var(--color-accent); content: '·'; }
    .work-showcase-info a { grid-column: 2; display: inline-block; align-self: start; margin-top: var(--space-5); color: var(--color-accent); font-weight: 700; text-decoration: none; }
    .work-showcase-info a:hover { color: var(--color-accent-strong); }
    .work-controls { display: flex; align-items: center; gap: 1rem; margin-top: var(--space-5); color: var(--color-text-muted); font-size: .8rem; }
    .work-control { display: grid; width: 2.6rem; height: 2.6rem; place-items: center; border: 1px solid var(--color-border); border-radius: .65rem; background: transparent; color: var(--color-text); cursor: pointer; font: inherit; font-size: 1.2rem; transition: border-color 180ms ease, color 180ms ease, transform 180ms ease; }
    .work-control:hover, .work-control:focus-visible { border-color: var(--color-accent); color: var(--color-accent); transform: translateY(-2px); }

    .stage-about, .stage-technologies, .stage-contact { padding-block: 8rem; }
    .stage-about { background: var(--color-surface-base); }
    .about-grid { display: grid; gap: var(--space-7); }
    .about-copy { max-width: 42rem; }
    .section-copy { max-width: 38rem; color: var(--color-text-muted); font-size: 1.1rem; }
    .area-list { display: grid; gap: .6rem; margin: var(--space-5) 0 0; padding: 0; color: var(--color-text-muted); list-style: none; }
    .area-list li { padding-left: 1.1rem; position: relative; }
    .area-list li::before { content: '—'; position: absolute; left: 0; color: var(--color-accent); }
    .stage-technologies { background: color-mix(in srgb, var(--color-surface-emphasis) 42%, var(--color-surface-base)); }
    .technology-groups { display: grid; gap: var(--space-3); margin-top: var(--space-7); }
    .technology-group { display: grid; gap: .7rem; padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
    .technology-group > span { color: var(--color-accent); font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    .technology-list { display: flex; flex-wrap: wrap; gap: .45rem .8rem; }
    .technology-list strong { color: var(--color-text-muted); font-size: 1rem; font-weight: 500; }
    .technology-list strong.is-primary { color: var(--color-text); font-size: 1.1rem; font-weight: 700; }
    .stage-contact { background: var(--color-surface-base); }
    .contact-content { min-height: 25rem; display: grid; align-content: center; }
    .contact-links { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: var(--space-6); }
    .contact-icon-link {
      --contact-icon-color: var(--color-accent);
      position: relative;
      display: inline-grid;
      width: 3rem;
      height: 3rem;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--contact-icon-color) 42%, var(--color-border));
      border-radius: .75rem;
      background: color-mix(in srgb, var(--contact-icon-color) 4%, transparent);
      color: color-mix(in srgb, var(--contact-icon-color) 78%, var(--color-text-muted));
      text-decoration: none;
      transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
    }
    .contact-icon-link.is-email, .contact-icon-link.is-resume { --contact-icon-color: var(--color-accent); }
    .contact-icon-link.is-linkedin { --contact-icon-color: #0a66c2; }
    .contact-icon-link.is-github { --contact-icon-color: var(--color-text); }
    .contact-icon-link.is-whatsapp { --contact-icon-color: #25d366; }
    .contact-icon-link svg { width: 1.5rem; height: 1.5rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.7; }
    .contact-icon-link.is-github svg { fill: currentColor; stroke: none; }
    .contact-icon-link:hover, .contact-icon-link:focus-visible { border-color: var(--contact-icon-color); background: color-mix(in srgb, var(--contact-icon-color) 9%, transparent); box-shadow: 0 0 0 .2rem color-mix(in srgb, var(--contact-icon-color) 10%, transparent); color: var(--contact-icon-color); transform: translateY(-2px); }
    .contact-icon-link::after { position: absolute; z-index: 2; bottom: calc(100% + .55rem); left: 50%; padding: .35rem .5rem; border: 1px solid var(--color-border); border-radius: .35rem; background: var(--color-surface-elevated); color: var(--color-text); content: attr(data-tooltip); font-size: .72rem; font-weight: 600; line-height: 1; opacity: 0; pointer-events: none; transform: translate(-50%, .25rem); transition: opacity 150ms ease, transform 150ms ease; white-space: nowrap; }
    .contact-icon-link:hover::after, .contact-icon-link:focus-visible::after { opacity: 1; transform: translate(-50%, 0); }
    .contact-note { margin-top: var(--space-5); color: var(--color-text-muted); font-size: .95rem; }

    .reveal-block { opacity: 1; transform: translateY(0); transition: opacity 240ms ease var(--reveal-delay, 0ms), transform 240ms ease var(--reveal-delay, 0ms); }
    .reveal-block.reveal-pending { opacity: 0; transform: translateY(1rem); }
    .reveal-block.is-visible { opacity: 1; transform: translateY(0); }
    .home-progress { position: fixed; z-index: 8; top: 50%; left: 1.25rem; display: none; transform: translateY(-50%); }
    .progress-list { display: grid; gap: .65rem; }
    .progress-item { display: flex; align-items: center; gap: .65rem; color: var(--color-text-muted); font-size: .72rem; text-decoration: none; transition: color 180ms ease; }
    .progress-item:hover { color: var(--color-text); }
    .progress-item:focus-visible { outline: 2px solid var(--color-accent); outline-offset: .35rem; }
    .progress-number { min-width: 1.5rem; color: var(--color-text); font-variant-numeric: tabular-nums; opacity: .52; }
    .progress-label { white-space: nowrap; font-weight: 700; }
    .progress-item.is-active { color: var(--color-text); }
    .progress-item.is-active .progress-number { color: var(--color-accent); opacity: 1; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

    @media (min-width: 48rem) {
      .about-grid { grid-template-columns: minmax(0, 1fr) auto; }
    }

    @media (min-width: 48rem) and (max-width: 89.99rem) {
      .home-progress { left: .75rem; display: block; }
      .progress-list { gap: .75rem; }
      .progress-item { position: relative; width: 2rem; justify-content: center; gap: 0; }
      .progress-number { min-width: 0; }
      .progress-label { position: absolute; left: calc(100% + .65rem); padding: .25rem .45rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface-elevated); opacity: 0; pointer-events: none; transform: translateX(-.35rem); transition: opacity 160ms ease, transform 160ms ease; }
      .progress-item:hover .progress-label, .progress-item:focus-visible .progress-label { opacity: 1; transform: translateX(0); }
    }

    @media (min-width: 90rem) {
      .home-progress { display: block; }
    }

    @media (max-width: 47.99rem) {
      .home-progress { position: fixed; top: 4.5rem; right: 0; left: 0; display: block; }
      .progress-list { display: none; }
      .stage-introduction { min-height: 68vh; padding-top: 5rem; }
      .stage-introduction::before { background-position: var(--home-introduction-asset-position-mobile); background-size: var(--home-introduction-asset-size-mobile); opacity: var(--home-introduction-asset-opacity-mobile, var(--home-introduction-asset-opacity)); }
      .work-showcase-heading { display: block; }
      .context-copy { margin-top: var(--space-4); }
      .work-paginator { flex-wrap: nowrap; overflow-x: auto; margin-right: calc(var(--space-4) * -1); padding-right: var(--space-4); scrollbar-width: thin; }
      .work-paginator-item { flex: 0 0 auto; }
      .work-showcase-panel { gap: var(--space-5); }
      .work-visual, .work-visual-fallback { min-height: 0; height: auto; }
      .work-visual { aspect-ratio: 16 / 9; }
      .work-showcase-info { display: block; padding-top: var(--space-4); }
      .work-showcase-info h3 { margin-top: var(--space-4); }
      .work-showcase-info p { margin-top: var(--space-4); }
      .showcase-stack { margin-top: var(--space-4); }
      .work-showcase-info a { margin-top: var(--space-5); }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-block, .work-paginator-item, .work-control { transition: none; }
      .stage-introduction::before { opacity: 0.08; }
      .contact-icon-link { transition: none; }
      .contact-icon-link:hover, .contact-icon-link:focus-visible { transform: none; }
      .reveal-block, .reveal-block.reveal-pending { opacity: 1; transform: none; }
    }
  `,
})
export class HomePageComponent implements AfterViewInit, OnDestroy {
  protected readonly profile = profile;
  protected readonly experienceSummary = experienceSummary;
  protected readonly technologyGroups = technologyGroups;
  protected readonly contactLinks = [...externalLinks]
    .filter((link) => this.hasValidUrl(link.url))
    .sort((a, b) => ['email', 'linkedin', 'github', 'whatsapp', 'resume'].indexOf(a.id) - ['email', 'linkedin', 'github', 'whatsapp', 'resume'].indexOf(b.id));
  protected readonly featuredProjects = inject(ProjectContentService).getFeatured();
  protected readonly stages: HomeStage[] = [
    { number: '01', label: 'Introdução', id: 'introducao' },
    { number: '02', label: 'Sobre / Experiência', id: 'sobre-experiencia' },
    { number: '03', label: 'Tecnologias / Práticas', id: 'tecnologias-praticas' },
    { number: '04', label: 'Projetos', id: 'projetos' },
    { number: '05', label: 'Contato', id: 'contato' },
  ];

  protected readonly activeStage = signal('01');
  protected readonly activeProjectIndex = signal(0);
  protected readonly activeProject = computed(() => this.featuredProjects[this.activeProjectIndex()] ?? this.featuredProjects[0]);
  protected readonly projectTransitioning = signal(false);
  protected readonly introFinished = signal(false);
  private revealObserver?: IntersectionObserver;
  private stageObserver?: IntersectionObserver;
  private projectTransitionTimer?: number;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object, seo: SeoService) {
    seo.setPage({
      ...publicRouteMetadata.home,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: siteConfig.name,
        jobTitle: 'Full Stack Software Developer',
        ...(siteConfig.siteUrl ? { url: siteConfig.siteUrl } : {}),
        sameAs: externalLinks.filter((link) => ['github', 'linkedin'].includes(link.id)).map((link) => link.url),
      },
    });
  }

  protected activeStageLabel(): string {
    return this.stages.find((stage) => stage.number === this.activeStage())?.label ?? 'Introdução';
  }

  protected onIntroFinished(): void { this.introFinished.set(true); }

  protected selectProject(index: number): void {
    if (index < 0 || index >= this.featuredProjects.length || index === this.activeProjectIndex()) return;
    this.projectTransitioning.set(true);
    this.activeProjectIndex.set(index);
    if (isPlatformBrowser(this.platformId)) {
      if (this.projectTransitionTimer !== undefined) window.clearTimeout(this.projectTransitionTimer);
      this.projectTransitionTimer = window.setTimeout(() => {
        this.projectTransitioning.set(false);
        this.projectTransitionTimer = undefined;
      }, 260);
    }
  }

  protected selectPreviousProject(): void {
    const nextIndex = (this.activeProjectIndex() - 1 + this.featuredProjects.length) % this.featuredProjects.length;
    this.selectProject(nextIndex);
  }

  protected selectNextProject(): void {
    const nextIndex = (this.activeProjectIndex() + 1) % this.featuredProjects.length;
    this.selectProject(nextIndex);
  }

  protected onShowcaseKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.selectPreviousProject();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.selectNextProject();
    }
  }

  protected projectTypeLabel(type: ProjectType): string {
    return { professional: 'Projeto profissional', personal: 'Projeto pessoal', freelance: 'Freelance', 'open-source': 'Open source' }[type];
  }

  protected projectStatusLabel(status: ProjectStatus): string {
    return { 'in-development': 'Em desenvolvimento', active: 'Publicado', completed: 'Concluído', maintenance: 'Em manutenção', archived: 'Arquivado' }[status];
  }

  protected contactAriaLabel(id: string): string {
    return {
      email: 'Enviar e-mail',
      linkedin: 'Abrir LinkedIn',
      github: 'Abrir GitHub',
      whatsapp: 'Abrir WhatsApp',
      resume: 'Abrir currículo',
    }[id] ?? 'Abrir contato';
  }

  private hasValidUrl(url: string | undefined): boolean {
    return !!url && /^(https?:\/\/|mailto:)/.test(url);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          entry.target.classList.add('is-visible');
          this.revealObserver?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll<HTMLElement>('.reveal-block').forEach((element) => {
      element.classList.add('reveal-pending');
      this.revealObserver?.observe(element);
    });

    const markerRootMargin = '-38% 0px -61% 0px';
    this.stageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const stage = entry.target.getAttribute('data-stage');
        if (stage) this.activeStage.set(stage);
      });
    }, { rootMargin: markerRootMargin, threshold: 0 });
    document.querySelectorAll<HTMLElement>('[data-stage]').forEach((element) => {
      this.stageObserver?.observe(element);
    });

  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.revealObserver?.disconnect();
    this.stageObserver?.disconnect();
    if (this.projectTransitionTimer !== undefined) window.clearTimeout(this.projectTransitionTimer);
  }
}
