import { Injectable } from '@angular/core';
import { Project } from '../../../core/models/project.model';
import { projects } from '../../../content/projects';

@Injectable({ providedIn: 'root' })
export class ProjectContentService {
  getAll(): Project[] { return projects; }
  getFeatured(): Project[] { return this.getAll().filter((project) => project.featured); }
  getBySlug(slug: string): Project | undefined { return this.getAll().find((project) => project.slug === slug); }
}
