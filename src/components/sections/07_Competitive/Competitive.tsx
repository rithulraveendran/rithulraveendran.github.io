import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import statsJson from '@/data/stats.json';
import type { TelemetryData } from '@/types/stats';
import { PROFILE_CONFIG } from '@/config/profile';
import { Heatmap } from '@/components/visualizers/Heatmap/Heatmap';
import { RadialProgress } from '@/components/visualizers/RadialProgress/RadialProgress';
import { DifficultyBar } from '@/components/visualizers/DifficultyBar/DifficultyBar';
import { RatingGraph } from '@/components/visualizers/RatingGraph/RatingGraph';
import styles from './Competitive.module.css';

const stats = statsJson as unknown as TelemetryData;

export function Competitive() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const summaryRailRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const compData = stats.competitive;
  const leetcode = compData.platforms.leetcode;
  const codeforces = compData.platforms.codeforces;
  const atcoder = compData.platforms.atcoder;
  const codechef = compData.platforms.codechef;

  // Handles & URLs
  const lcUser = leetcode.username || PROFILE_CONFIG.competitiveHandles.leetcode;
  const cfHandle = codeforces.handle || PROFILE_CONFIG.competitiveHandles.codeforces;
  const atUser = atcoder.username || PROFILE_CONFIG.competitiveHandles.atcoder;
  const ccUser = codechef.username || PROFILE_CONFIG.competitiveHandles.codechef;

  const lcUrl = `https://leetcode.com/u/${lcUser}/`;
  const cfUrl = `https://codeforces.com/profile/${cfHandle}`;
  const atUrl = `https://atcoder.jp/users/${atUser}`;
  const ccUrl = `https://www.codechef.com/users/${ccUser}`;

  // Process combined heatmap days
  const heatmapDays = (compData.combinedHeatmap || []).map((day) => ({
    date: day.date,
    count: day.total,
  }));

  const totalHeatmapSolves = (compData.combinedHeatmap || []).reduce(
    (sum, d) => sum + (d.total || 0),
    0
  );

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      if (summaryRailRef.current) {
        const cards = summaryRailRef.current.querySelectorAll(`.${styles.summaryCard}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: summaryRailRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    },
    sectionRef,
    [prefersReducedMotion]
  );

  return (
    <section
      id="competitive"
      ref={sectionRef}
      className={styles.section}
      aria-label="Competitive Programming and Algorithmic Telemetry"
    >
      {/* Section Header */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>07 / Competitive Programming</p>
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>Competitive Programming</h2>
            <p className={styles.subtitle}>
              Cross-platform practice, verified contest ratings, and persistent daily problem solving.
            </p>
          </div>
        </div>
      </header>

      {/* Platform Summary Rail */}
      <div ref={summaryRailRef} className={styles.summaryRail}>
        {/* LeetCode Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <span className={styles.platformName}>LeetCode</span>
          </div>
          <div className={styles.summaryValue}>{leetcode.totalSolved}</div>
          <div className={styles.summarySub}>
            {leetcode.streak}d streak · {leetcode.activeDays} active days
          </div>
        </div>

        {/* Codeforces Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <span className={styles.platformName}>Codeforces</span>
          </div>
          <div className={styles.summaryValue}>{codeforces.rating}</div>
          <div className={styles.summarySub}>
            Rank: {codeforces.rank} · {codeforces.contestsCount} contests
          </div>
        </div>

        {/* AtCoder Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <span className={styles.platformName}>AtCoder</span>
          </div>
          <div className={styles.summaryValue}>
            {atcoder.rating !== null && atcoder.rating !== undefined ? atcoder.rating : 'Unrated'}
          </div>
          <div className={styles.summarySub}>
            Profile active · {atcoder.contestsCount} rated contests
          </div>
        </div>

        {/* CodeChef Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <span className={styles.platformName}>CodeChef</span>
          </div>
          <div className={styles.summaryValue}>
            {codechef.status === 'active' ? (codechef.rating ? codechef.rating : `${codechef.solvedCount ?? 64} Solved`) : 'Offline'}
          </div>
          <div className={styles.summarySub}>
            {codechef.status === 'active'
              ? `${codechef.stars ? codechef.stars + ' · ' : 'Profile active · '}${codechef.solvedCount ?? 64} solved`
              : 'Telemetry sync pending'}
          </div>
        </div>
      </div>

      {/* Combined Heatmap */}
      <div className={styles.heatmapContainer}>
        <div className={styles.heatmapHeader}>
          <div>
            <h3 className={styles.heatmapTitle}>Combined Activity Matrix</h3>
            <span className={styles.heatmapMeta}>
              Aggregated daily problem solves across LeetCode, Codeforces, AtCoder & CodeChef
            </span>
          </div>
          <span className={styles.heatmapMeta}>
            {totalHeatmapSolves} total solves in the past year
          </span>
        </div>
        <Heatmap
          days={heatmapDays}
          ariaLabel="Combined annual competitive programming activity calendar"
          unitLabel="problem"
        />
      </div>

      {/* Deep-Dive Panels */}
      <div className={styles.deepDivesGrid}>
        {/* LeetCode Deep Dive */}
        <article className={styles.panel} aria-label="LeetCode Profile Breakdown">
          <header className={styles.panelHeader}>
            <div className={styles.panelTitleGroup}>
              <h3 className={styles.panelTitle}>LeetCode</h3>
            </div>
            <a
              href={lcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.platformLink}
            >
              <span>leetcode.com/u/{lcUser}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </header>

          <div className={styles.leetcodeContent}>
            <RadialProgress
              easy={leetcode.easy}
              medium={leetcode.medium}
              hard={leetcode.hard}
              totalSolved={leetcode.totalSolved}
            />

            <div className={styles.leetcodeBars}>
              <DifficultyBar
                difficulty="Easy"
                solved={leetcode.easy}
                total={leetcode.easyTotal}
              />
              <DifficultyBar
                difficulty="Medium"
                solved={leetcode.medium}
                total={leetcode.mediumTotal}
              />
              <DifficultyBar
                difficulty="Hard"
                solved={leetcode.hard}
                total={leetcode.hardTotal}
              />
            </div>
          </div>

          <div className={styles.statRow}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Current Streak</span>
              <span className={styles.statValue}>{leetcode.streak} Days</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Active Days</span>
              <span className={styles.statValue}>{leetcode.activeDays} Days</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Contest Rating</span>
              <span className={styles.statValue}>
                {leetcode.contestRating ? leetcode.contestRating : 'Unrated (Practice)'}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Recognitions</span>
              <span className={styles.statValue}>
                {leetcode.badges && leetcode.badges.length > 0
                  ? leetcode.badges.join(', ')
                  : 'Active Solver'}
              </span>
            </div>
          </div>
        </article>

        {/* Codeforces Deep Dive */}
        <article className={styles.panel} aria-label="Codeforces Contest Performance">
          <header className={styles.panelHeader}>
            <div className={styles.panelTitleGroup}>
              <h3 className={styles.panelTitle}>Codeforces</h3>
            </div>
            <a
              href={cfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.platformLink}
            >
              <span>codeforces.com/profile/{cfHandle}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </header>

          <div className={styles.codeforcesStats}>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Current Rating</span>
              <span className={styles.statValue}>{codeforces.rating}</span>
            </div>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Peak Rating</span>
              <span className={styles.statValue}>{codeforces.maxRating}</span>
            </div>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Official Rank</span>
              <span className={styles.statValue}>{codeforces.rank}</span>
            </div>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Contests Attended</span>
              <span className={styles.statValue}>{codeforces.contestsCount}</span>
            </div>
          </div>

          <RatingGraph history={codeforces.ratingHistory} />
        </article>

        {/* Secondary Platforms (AtCoder & CodeChef) */}
        <div className={styles.secondaryRow}>
          {/* AtCoder Card */}
          <article className={styles.secondaryCard} aria-label="AtCoder Profile Status">
            <div>
              <header className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <h3 className={styles.panelTitle}>AtCoder</h3>
                </div>
                <a
                  href={atUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.platformLink}
                >
                  <span>atcoder.jp</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </header>

              <div className={styles.secondaryBody}>
                <p className={styles.secondaryDescription}>
                  Registered handle on AtCoder Japan. Profile is active and preparing for official
                  AtCoder Beginner Contests (ABC).
                </p>
                <div className={styles.secondaryMetrics}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Rating</span>
                    <span className={styles.statValue}>Unrated</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Contests</span>
                    <span className={styles.statValue}>{atcoder.contestsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CodeChef Card */}
          <article className={styles.secondaryCard} aria-label="CodeChef Profile Status">
            <div>
              <header className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <h3 className={styles.panelTitle}>CodeChef</h3>
                </div>
                <a
                  href={ccUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.platformLink}
                >
                  <span>codechef.com</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </header>

              <div className={styles.secondaryBody}>
                <p className={styles.secondaryDescription}>
                  Active competitive profile under @{ccUser}. Algorithmic problem solving across data structures and computational challenges.
                </p>
                <div className={styles.secondaryMetrics}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Rating</span>
                    <span className={styles.statValue}>{codechef.rating || 'Practice'}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Division / Status</span>
                    <span className={styles.statValue}>{codechef.stars || 'Active'}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Problems Solved</span>
                    <span className={styles.statValue}>{codechef.solvedCount ?? 64}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Competitive;
