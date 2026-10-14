export interface ProfileContent {
  name: string;
  title: string;
  experienceSince: number;
  introduction: string;
  selectedWorkTitle: string;
  selectedWorkDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  technologiesTitle: string;
  contactTitle: string;
  contactDescription: string;
  contactUnavailableMessage: string;
}

export interface ExperienceSummary {
  description: string;
  areas: string[];
}

export interface TechnologyItem {
  name: string;
  primary?: boolean;
}

export interface TechnologyGroup {
  id: string;
  label: string;
  technologies: TechnologyItem[];
}

export interface ExternalLink {
  id: string;
  label: string;
  url?: string;
  kind: 'github' | 'linkedin' | 'email' | 'resume' | 'other';
}
