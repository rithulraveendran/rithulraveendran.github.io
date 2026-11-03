/**
 * Structured Content Types for Safe AI-Assisted Maintenance
 * Source of Truth: portfolio-revamp-plan.md
 */

export interface ProjectVisuals {
  /** Relative path to hero visual inside public/ (e.g. 'assets/projects/manas-ai/preview.webp') */
  hero?: string;
  /** Optional secondary gallery items or architecture schematics */
  gallery?: string[];
  /** Optional short descriptive caption */
  caption?: string;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  caseStudy?: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  tagline: string;
  description: string;
  problem?: string;
  role?: string;
  category?: string;
  technologies: string[];
  visuals?: ProjectVisuals;
  links: ProjectLinks;
  architectureFlow?: string[];
  featured?: boolean;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  period: {
    start: string;
    end: string | 'Present';
  };
  /** Text-only bulleted engineering deliverables (no images) */
  description: string[];
  technologies: string[];
}

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  issueDate: string; // YYYY-MM or display date
  /** Relative path to certificate image or PDF preview inside public/assets/certs/ */
  image?: string;
  credentialUrl?: string;
  verificationId?: string;
  validity?: string;
  hours?: number;
  category?: 'professional' | 'academic' | 'hackathon';
  note?: string;
}

export interface DigitalBadgeEntry {
  id: string;
  title: string;
  issuer: string;
  category: 'aws' | 'oracle' | 'cisco' | 'googlecloud' | 'leetcode';
  /** Relative path inside public/ (e.g. 'assets/badges/aws/cloud-foundations.png') */
  image: string;
  verificationUrl?: string;
  level?: string;
  issueDate?: string;
}

export interface AchievementEntry {
  id: string;
  title: string;
  event: string;
  date: string;
  category: 'hackathon' | 'competition' | 'contribution' | 'milestone';
  description: string;
  /** Relative path to supporting evidence inside public/assets/achievements/ */
  evidenceImage?: string;
  externalLink?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export type ContributionStatus = 'merged' | 'open' | 'closed';
export type ContributionType = 'feature' | 'bugfix' | 'refactor' | 'documentation';

export interface OpenSourceContribution {
  id: string;
  repository: string;
  repositoryUrl: string;
  title: string;
  description: string;
  prUrl: string;
  prNumber: number;
  type: ContributionType;
  status: ContributionStatus;
  date: string;
  programAffiliation?: string;
}

export interface OpenSourceProgram {
  id: string;
  name: string;
  role: string;
  period: string;
  description?: string;
}

export interface SocialLink {
  platform: 'google' | 'instagram' | 'github' | 'linkedin' | 'discord';
  label: string;
  url: string;
  /** Relative path to MP4 animation inside public/assets/social/ */
  videoAsset: string;
}

export interface ProfileConfig {
  name: string;
  role: string;
  location: string;
  education: {
    degree: string;
    major: string;
    institution: string;
    period: string;
  };
  contact: {
    email: string;
  };
  resume: {
    /** Path to resume relative to public/ (e.g. 'assets/resume/resume.pdf') */
    path: string;
    filename: string;
  };
  social: SocialLink[];
  competitiveHandles: {
    github: string;
    leetcode: string;
    codeforces: string;
    atcoder: string;
    codechef: string;
  };
}
