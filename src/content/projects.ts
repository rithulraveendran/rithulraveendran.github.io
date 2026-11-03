import type { ProjectEntry } from '@/types/content';

/**
 * Projects Content Store
 * Factual, verified engineering projects.
 * Keep content decoupled from presentation components.
 */
export const PROJECTS: ProjectEntry[] = [
  {
    id: 'mrithasanjeevani',
    title: 'Mrithasanjeevani',
    tagline: 'Rural telemedicine platform with multilingual voice assistance and real-time emergency dispatch.',
    description:
      'A healthcare platform engineered to connect patients, doctors, pharmacists, and frontline health workers in underserved rural areas. Features multilingual voice assistance for accessibility and an emergency SOS protocol with real-time location tracking.',
    problem: 'Bridging healthcare access barriers and reducing critical response delays in remote rural communities.',
    role: 'Full-Stack & Systems Architecture',
    category: 'Healthcare Systems',
    technologies: ['Python', 'Flask', 'Voice AI', 'Geolocation APIs', 'Multilingual NLP'],
    links: {},
    visuals: {
      caption: 'Telemedicine consultation interface and rural emergency dispatch protocol',
    },
    featured: true,
  },
  {
    id: 'carbonlens-ai',
    title: 'CarbonLens AI',
    tagline: 'Enterprise ESG Scope 3 emissions tracking with LLM document extraction and human-in-the-loop verification.',
    description:
      'An enterprise sustainability reporting platform built to automate Scope 3 emissions accounting across supply chains. Extracts unstructured supplier invoice data using LLaMA 3.3, calculates emissions via deterministic emission factor mapping, and provides an audit-ready verification queue aligned with SEBI BRSR compliance.',
    problem: 'Eliminating manual, error-prone data entry and audit risks in corporate carbon accounting across multi-tier supplier networks.',
    role: 'Lead Developer',
    category: 'Enterprise ESG Intelligence',
    technologies: ['Python', 'Flask', 'Groq LLaMA 3.3', 'Firebase', 'RBAC', 'Document Parsing'],
    links: {
      github: 'https://github.com/rithulraveendran/carbonlens-ai',
    },
    visuals: {
      caption: 'Supplier invoice data extraction queue and ESG emissions audit table',
    },
    featured: true,
  },
  {
    id: 'frost',
    title: 'F.R.O.S.T.',
    tagline: 'Anti-tamper psychological firewall Chrome extension enforcing non-negotiable focus periods.',
    description:
      'A hard-gate distraction elimination browser extension designed for extreme deep-work discipline. Enforces context-aware YouTube filtering and strict, unmodifiable website restrictions until a predetermined target date is reached, featuring an anti-tamper protocol.',
    problem: 'Overcoming willpower friction and easy bypass mechanisms in standard website blocking tools.',
    role: 'Developer',
    category: 'Productivity & Systems',
    technologies: ['JavaScript', 'Chrome Extensions API', 'HTML5', 'CSS3'],
    links: {
      github: 'https://github.com/rithulraveendran/F.R.O.S.T.',
    },
    visuals: {
      caption: 'Hard-gate distraction block screen and target date restriction engine',
    },
    featured: true,
  },
];
