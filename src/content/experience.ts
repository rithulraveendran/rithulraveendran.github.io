import type { ExperienceEntry } from '@/types/content';

/**
 * Experience Content Store (Strictly Text-Only)
 * Source of truth for career, internship, and research positions.
 */
export const EXPERIENCES: ExperienceEntry[] = [
  {
    id: 'google-student-ambassador-gemini',
    role: 'Google Student Ambassador – Team Gemini',
    organization: 'Google Student Ambassador Program',
    period: {
      start: 'November 2026',
      end: 'December 2026',
    },
    description: [
      'Driving campus outreach, developer community engagement, and AI advocacy initiatives centered around Google developer technologies and the Gemini ecosystem.',
    ],
    technologies: ['Campus Outreach', 'Community Engagement', 'AI Advocacy'],
  },
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
