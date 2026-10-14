import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectStatus, ProjectType } from '../../../core/models/project.model';
import { ProjectContentService } from '../services/project-content.service';
import { SeoService } from '../../../core/services/seo.service';
import { publicRouteMetadata } from '../../../content/site-config';

@Component({
  selector: 'app-project-list-page',
  imports: [RouterLink],
  template: `
    <section class="section" aria-labelledby="projects-title">
      <div class="container">
        <p class="eyebrow">Projetos</p>
        <h1 id="projects-title">Projetos em destaque e estudos técnicos.</h1>
        <div class="project-list">
          @for (project of projects; track project.slug) {
            <article class="project-card">
              <div class="project-number">{{ ($index + 1).toString().padStart(2, '0') }}</div>
              <div class="project-meta"><span>{{ projectTypeLabel(project.type) }}</span><span>{{ projectStatusLabel(project.status) }}</span></div>
              <h2>{{ project.showcase?.title || project.title }}</h2>
              <p>{{ project.shortDescription }}</p>
              <div class="project-stack" aria-label="Tecnologias do projeto">
                @for (technology of project.showcase?.technologies || project.technologies.slice(0, 4); track technology) {
                  <span>{{ technology }}</span>
                }
              </div>
              <a [routerLink]="['/projetos', project.slug]">Ver projeto <span aria-hidden="true">↗</span></a>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    h1 { max-width: 48rem; }
    .project-list { display: grid; gap: var(--space-5); margin-top: var(--space-7); }
    .project-card { position: relative; padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }
    .project-number { color: var(--color-accent); font-size: .78rem; font-weight: 700; letter-spacing: .1em; }
    .project-meta { display: flex; justify-content: space-between; gap: 1rem; color: var(--color-text-muted); font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; }
    .project-card h2 { margin-top: var(--space-5); font-size: clamp(1.35rem, 3vw, 2rem); }
    .project-card p { max-width: 44rem; margin-top: var(--space-3); color: var(--color-text-muted); }
    .project-stack { display: flex; flex-wrap: wrap; gap: .45rem .8rem; margin-top: var(--space-4); color: var(--color-text-muted); font-size: .86rem; }
    .project-stack span + span::before { margin-right: .8rem; color: var(--color-accent); content: '·'; }
    .project-card a { display: inline-block; margin-top: var(--space-5); color: var(--color-accent); font-weight: 700; text-decoration: none; }
  `,
})
export class ProjectListPageComponent {
  private readonly projectService = inject(ProjectContentService);
  protected readonly projects = this.projectService.getAll();

  constructor(seo: SeoService) { seo.setPage(publicRouteMetadata.projects); }

  protected projectTypeLabel(type: ProjectType): string {
    return { professional: 'Projeto profissional', personal: 'Projeto pessoal', freelance: 'Freelance', 'open-source': 'Open source' }[type];
  }

  protected projectStatusLabel(status: ProjectStatus): string {
    return { 'in-development': 'Em desenvolvimento', active: 'Publicado', completed: 'Concluído', maintenance: 'Em manutenção', archived: 'Arquivado' }[status];
  }
}
