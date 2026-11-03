import type { AchievementEntry } from '@/types/content';

/**
 * Achievements Content Store (Hackathons, competitions, milestones)
 * Source of Truth: Verified event awards.
 */
export const ACHIEVEMENTS: AchievementEntry[] = [
  {
    id: 'makeathon-2-winner',
    title: 'Winner — 10-Hour Hackathon',
    event: 'MAKE-A-THON 2.0',
    date: '2025-10',
    category: 'hackathon',
    description: "Secured winning position with team Codegeeks in the 10-hour hackathon organized by St. Joseph's College of Engineering.",
    evidenceImage: 'assets/achievements/makeathon-2-award.jpg',
  },
  {
    id: 'makeathon-3-winner',
    title: 'Winner — 24-Hour Hackathon',
    event: 'MAKE-A-THON 3.0',
    date: '2026-04',
    category: 'hackathon',
    description: "Emerged as Winner with team Targaryens in MAKE-A-THON 3.0, a 24-hour hackathon organized by St. Joseph's College of Engineering.",
    evidenceImage: 'assets/achievements/makeathon-3-award.jpg',
  },
];
