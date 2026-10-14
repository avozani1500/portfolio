export type ProjectType = 'professional' | 'personal' | 'freelance' | 'open-source';

export type ProjectStatus =
  | 'in-development'
  | 'active'
  | 'completed'
  | 'maintenance'
  | 'archived';

export type ProjectVisibility = 'public' | 'limited';

export type CaseStudySectionType =
  | 'overview'
  | 'current-state'
  | 'implemented-features'
  | 'context'
  | 'challenge'
  | 'architecture'
  | 'technical-decisions'
  | 'features'
  | 'audits'
  | 'performance'
  | 'results'
  | 'roadmap'
  | 'next-steps'
  | 'learnings'
  | 'gallery';

export interface ProjectLink {
  label: string;
  url: string;
  kind: 'repository' | 'workshop' | 'demo' | 'documentation';
}

export interface ProjectImage {
  src: string;
  alt: string;
  position?: string;
  width?: number;
  height?: number;
}

export interface ProjectGalleryImage extends ProjectImage {
  caption?: string;
}

export interface CaseStudyDiagram {
  nodes: string[];
  branches?: Array<{ label: string; nodes: string[]; note?: string }>;
  note?: string;
}

export interface ProjectAvailability {
  publicSourceCode: boolean;
  publicDemo: boolean;
  publicDocumentation: boolean;
  liveUrl?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
}

export interface CaseStudySection {
  type: CaseStudySectionType;
  title: string;
  state?: 'available' | 'planned';
  content?: string;
  items?: string[];
  metrics?: Array<{ label: string; value: string; description?: string }>;
  images?: ProjectGalleryImage[];
  diagram?: CaseStudyDiagram;
}

export interface Project {
  slug: string;
  title: string;
  caseStudyTitle?: string;
  shortDescription: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  release?: string;
  visibility: ProjectVisibility;
  featured: boolean;
  role?: string;
  period?: string;
  technologies: string[];
  thumbnail?: string;
  coverImage?: ProjectImage;
  coverAlt?: string;
  showcase?: {
    title?: string;
    description: string;
    technologies: string[];
  };
  availability: ProjectAvailability;
  externalLinks?: ProjectLink[];
  caseStudy: CaseStudySection[];
}
