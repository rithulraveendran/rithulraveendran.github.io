import type { ExperienceEntry } from '@/types/content';

/**
 * Experience Content Store (Strictly Text-Only)
 * Source of truth for career, internship, and research positions.
 */
export const EXPERIENCES: ExperienceEntry[] = [
  {
    id: 'bitbridge-ai-intern',
    role: 'AI Engineer Intern',
    organization: 'BitBridge Technologies',
    period: {
      start: 'June 2026',
      end: 'June 2026',
    },
    description: [
      'Developed and evaluated YOLO-based computer vision models for low-latency visual detection tasks.',
      'Configured target embedded hardware and cross-compilation toolchains for model deployment on the RV1106 platform.',
      'Maintained deployment scripts and verified on-device inference workflows within the embedded Linux environment.',
    ],
    technologies: ['Python', 'YOLO', 'Computer Vision'],
  },
];
