/**
 * Telemetry Data Types for External Platform Statistics
 * Source of Truth: portfolio-revamp-plan.md
 */

export type PlatformSyncStatus = 'active' | 'stale' | 'offline';

export interface GitHubDayContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubStats {
  username: string;
  status: PlatformSyncStatus;
  lastSynced: string;
  totalContributions: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  contributionCalendar: GitHubDayContribution[];
}

export interface CombinedHeatmapDay {
  date: string;
  total: number;
  breakdown: {
    leetcode: number;
    codeforces: number;
    atcoder: number;
    codechef: number;
  };
}

export interface ContestRatingPoint {
  contestName: string;
  rating: number;
  date: string;
  rank?: number;
}

export interface LeetCodeStats {
  username: string;
  status: PlatformSyncStatus;
  lastSynced: string;
  totalSolved: number;
  easy: number;
  easyTotal: number;
  medium: number;
  mediumTotal: number;
  hard: number;
  hardTotal: number;
  contestRating?: number | null;
  globalRanking?: number | null;
  topPercentage?: number | null;
  streak: number;
  activeDays: number;
  ratingHistory: ContestRatingPoint[];
  badges: string[];
}

export interface CodeforcesStats {
  handle: string;
  status: PlatformSyncStatus;
  lastSynced: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contestsCount: number;
  ratingHistory: ContestRatingPoint[];
}

export interface AtCoderStats {
  username: string;
  status: PlatformSyncStatus;
  lastSynced: string;
  rating?: number | null;
  highestRating?: number | null;
  contestsCount: number;
  ratingHistory: ContestRatingPoint[];
}

export interface CodeChefStats {
  username: string;
  status: PlatformSyncStatus;
  lastSynced: string;
  rating?: number | null;
  highestRating?: number | null;
  stars?: string | null;
  solvedCount?: number | null;
}

export interface TelemetryData {
  version: string;
  generatedAt: string;
  github: GitHubStats;
  competitive: {
    combinedHeatmap: CombinedHeatmapDay[];
    platforms: {
      leetcode: LeetCodeStats;
      codeforces: CodeforcesStats;
      atcoder: AtCoderStats;
      codechef: CodeChefStats;
    };
  };
}
