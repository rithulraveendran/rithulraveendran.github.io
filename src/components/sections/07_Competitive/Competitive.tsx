import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { CountUp } from '@/components/common/CountUp/CountUp';
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

  // SkillRack solved count (curriculum / college coding platform baseline)
  // Per instruction: included in the total overall count only.
  const skillrackSolved = 520;

  const totalSolvedAll =
    (leetcode.totalSolved || 0) +
    (codechef.solvedCount ?? 64) +
    skillrackSolved;

  // Dynamic next milestone calculation for LeetCode
  const lcSolved = leetcode.totalSolved || 0;
  const lcMilestones = [50, 100, 200, 300, 500, 1000];
  const nextLcMilestone = lcMilestones.find((m) => m > lcSolved) || Math.ceil((lcSolved + 1) / 100) * 100;
  const lcProgressPct = Math.min(100, Math.round((lcSolved / nextLcMilestone) * 100));

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

      {/* Punchy Problem Count Hero */}
      <div className={styles.cpHero}>
        <div className={styles.cpBig}>
          <span className={styles.cpCount}>
            <CountUp value={totalSolvedAll} />
          </span>
          <span className={styles.cpLabel}>problems solved</span>
        </div>
        <p className={styles.cpSub}>
          Across verified profiles and coursework on SkillRack, LeetCode, CodeChef, and Codeforces.
        </p>
      </div>

      {/* Platform Summary Jump Cards */}
      <div ref={summaryRailRef} className={styles.summaryRail}>
        {/* LeetCode Jump Card */}
        <a
          href="#leetcode"
          className={styles.jumpCard}
          style={{ '--brand-color': '#ffa116' } as React.CSSProperties}
        >
          <div className={styles.summaryTop}>
            <span className={styles.platformName} style={{ color: '#ffa116' }}>LeetCode</span>
          </div>
          <div className={styles.jumpCardValue}>
            <CountUp value={leetcode.totalSolved} />
          </div>
          <div className={styles.jumpCardLabel}>
            solved on LeetCode
          </div>
        </a>

        {/* Codeforces Jump Card */}
        <a
          href="#codeforces"
          className={styles.jumpCard}
          style={{ '--brand-color': '#1f8acb' } as React.CSSProperties}
        >
          <div className={styles.summaryTop}>
            <span className={styles.platformName} style={{ color: '#1f8acb' }}>Codeforces</span>
          </div>
          <div className={styles.jumpCardValue}>
            <CountUp value={codeforces.rating} />
          </div>
          <div className={styles.jumpCardLabel}>
            rating · {codeforces.rank}
          </div>
        </a>

        {/* AtCoder Jump Card */}
        <a
          href="#atcoder"
          className={styles.jumpCard}
          style={{ '--brand-color': '#804000' } as React.CSSProperties}
        >
          <div className={styles.summaryTop}>
            <span className={styles.platformName} style={{ color: '#804000' }}>AtCoder</span>
          </div>
          <div className={styles.jumpCardValue}>
            {atcoder.rating !== null && atcoder.rating !== undefined ? (
              <CountUp value={atcoder.rating} />
            ) : (
              'Active'
            )}
          </div>
          <div className={styles.jumpCardLabel}>
            {atcoder.contestsCount} rated contests
          </div>
        </a>

        {/* CodeChef Jump Card */}
        <a
          href="#codechef"
          className={styles.jumpCard}
          style={{ '--brand-color': '#5b4638' } as React.CSSProperties}
        >
          <div className={styles.summaryTop}>
            <span className={styles.platformName} style={{ color: '#5b4638' }}>CodeChef</span>
          </div>
          <div className={styles.jumpCardValue}>
            <CountUp value={codechef.solvedCount ?? 64} />
          </div>
          <div className={styles.jumpCardLabel}>
            solved on CodeChef
          </div>
        </a>
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
        <article id="leetcode" className={styles.panel} aria-label="LeetCode Profile Breakdown">
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

          {/* Interactive Rank Progress Meter */}
          <div className={styles.rankMeter}>
            <p className={styles.meterLabel}>
              Active solver · Next milestone: {nextLcMilestone} solved problems on LeetCode ({nextLcMilestone - lcSolved} to go)
            </p>
            <div className={styles.meterTrack}>
              <div
                className={styles.meterFill}
                style={{ width: `${lcProgressPct}%` }}
              />
            </div>
          </div>

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
              <span className={styles.statValue}>
                <CountUp value={leetcode.streak} /> Days
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Active Days</span>
              <span className={styles.statValue}>
                <CountUp value={leetcode.activeDays} /> Days
              </span>
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
        <article id="codeforces" className={styles.panel} aria-label="Codeforces Contest Performance">
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

          {/* Codeforces Rank Meter */}
          <div className={styles.rankMeter}>
            <p className={styles.meterLabel}>
              Current: {codeforces.rank} ({codeforces.rating}) · Next milestone: Pupil at 1200
            </p>
            <div className={styles.meterTrack}>
              <div
                className={styles.meterFill}
                style={{
                  width: `${Math.min(100, Math.max(15, Math.round(((codeforces.rating || 0) / 1200) * 100)))}%`,
                  background: 'linear-gradient(90deg, #1f8acb, #00d2ff)'
                }}
              />
            </div>
          </div>

          <div className={styles.codeforcesStats}>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Current Rating</span>
              <span className={styles.statValue}>
                <CountUp value={codeforces.rating} />
              </span>
            </div>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Peak Rating</span>
              <span className={styles.statValue}>
                <CountUp value={codeforces.maxRating} />
              </span>
            </div>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Official Rank</span>
              <span className={styles.statValue}>{codeforces.rank}</span>
            </div>
            <div className={styles.codeforcesMetricCard}>
              <span className={styles.statLabel}>Contests Attended</span>
              <span className={styles.statValue}>
                <CountUp value={codeforces.contestsCount} />
              </span>
            </div>
          </div>

          <RatingGraph history={codeforces.ratingHistory} />
        </article>

        {/* Secondary Platforms (AtCoder & CodeChef) */}
        <div className={styles.secondaryRow}>
          {/* AtCoder Card */}
          <article id="atcoder" className={styles.secondaryCard} aria-label="AtCoder Profile Status">
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
                    <span className={styles.statValue}>
                      <CountUp value={atcoder.contestsCount} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CodeChef Card */}
          <article id="codechef" className={styles.secondaryCard} aria-label="CodeChef Profile Status">
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
                    <span className={styles.statValue}>
                      <CountUp value={codechef.solvedCount ?? 64} />
                    </span>
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
