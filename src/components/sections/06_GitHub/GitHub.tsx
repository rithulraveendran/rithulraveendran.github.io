import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import statsJson from '@/data/stats.json';
import type { TelemetryData } from '@/types/stats';
import { PROFILE_CONFIG } from '@/config/profile';
import { Heatmap } from '@/components/visualizers/Heatmap/Heatmap';
import styles from './GitHub.module.css';

const stats = statsJson as unknown as TelemetryData;

export function GitHub() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const github = stats.github;
  const username = github.username || PROFILE_CONFIG.competitiveHandles.github;
  const profileUrl = `https://github.com/${username}`;

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      if (metricsRef.current) {
        const cards = metricsRef.current.querySelectorAll(`.${styles.metricCard}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: metricsRef.current,
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

  const formattedDate = github.lastSynced
    ? new Date(github.lastSynced).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Pending sync';

  return (
    <section id="github" ref={sectionRef} className={styles.section} aria-label="GitHub Development Telemetry">
      <header className={styles.header}>
        <p className={styles.eyebrow}>06 / GitHub</p>
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>GitHub Activity</h2>
            <p className={styles.subtitle}>
              Continuous code commits, repository maintenance, and contribution history.
            </p>
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <span>github.com/{username}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* Verified Metrics Cards */}
      <div ref={metricsRef} className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Public Repositories</span>
          <span className={styles.metricValue}>{github.publicRepos}</span>
          <span className={styles.metricStatus}>Source repositories</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Contributions</span>
          <span className={styles.metricValue}>{github.totalContributions}</span>
          <span className={styles.metricStatus}>Past 53 weeks</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Stars Earned</span>
          <span className={styles.metricValue}>{github.totalStars}</span>
          <span className={styles.metricStatus}>Across public repositories</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Repository Forks</span>
          <span className={styles.metricValue}>{github.totalForks}</span>
          <span className={styles.metricStatus}>Across public projects</span>
        </div>
      </div>

      {/* 53-Week Heatmap Container */}
      <div className={styles.heatmapCard}>
        <div className={styles.heatmapHeader}>
          <h3 className={styles.heatmapTitle}>Contribution History</h3>
          <span className={styles.syncTimestamp}>Last synced: {formattedDate}</span>
        </div>

        <Heatmap
          days={github.contributionCalendar}
          ariaLabel={`GitHub contribution heatmap for ${username} across the past year`}
          unitLabel="contribution"
        />
      </div>
    </section>
  );
}

export default GitHub;
