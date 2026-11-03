import type { SkillCategory } from '@/types/content';

/**
 * Technical Skills Store
 * Source of Truth: Approved technical skill inventory.
 * Strictly typographic and factual; no arbitrary percentages, ratings, or unconfirmed technologies.
 */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Programming Languages',
    items: ['Python', 'C', 'SQL'],
  },
  {
    category: 'AI & Machine Learning',
    items: [
      'Machine Learning',
      'Natural Language Processing',
      'LLM Integration',
      'Retrieval-Augmented Generation (RAG)',
      'YOLO',
      'Computer Vision',
    ],
  },
  {
    category: 'Backend & APIs',
    items: ['Flask', 'FastAPI', 'REST APIs', 'WebSockets', 'LangGraph'],
  },
  {
    category: 'Frontend',
    items: ['HTML5'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'SQLite'],
  },
  {
    category: 'Tools & Systems',
    items: ['Linux', 'Git', 'GitHub', 'Docker'],
  },
];
