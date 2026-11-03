import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getAssetPath } from '@/utils/assets';
import { DIGITAL_BADGES } from '@/content/badges';
import styles from './DigitalBadges.module.css';

export function DigitalBadges() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const awsBadges = DIGITAL_BADGES.filter((b) => b.category === 'aws');
  const oracleBadge = DIGITAL_BADGES.find((b) => b.category === 'oracle');
  const ciscoBadge = DIGITAL_BADGES.find((b) => b.category === 'cisco');
  const gcpBadges = DIGITAL_BADGES.filter((b) => b.category === 'googlecloud');
  const leetcodeBadge = DIGITAL_BADGES.find((b) => b.category === 'leetcode');

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      if (containerRef.current) {
        const groups = containerRef.current.querySelectorAll(`.${styles.group}`);
        groups.forEach((group) => {
          gsap.fromTo(
            group,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    },
    sectionRef,
    [prefersReducedMotion]
  );

  return (
    <section
      id="badges"
      ref={sectionRef}
      className={styles.section}
      aria-label="Verified Digital Badges"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>09 / Digital Badges</p>
        <h2 className={styles.title}>Digital Badges & Skill Verifications</h2>
        <p className={styles.subtitle}>
          Standardized digital badges awarded for cloud competencies, specialty tracks, and algorithmic milestones.
        </p>
      </header>

      <div ref={containerRef} className={styles.groupsContainer}>
        {/* 1. AWS Academy Group */}
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupLabel}>AWS Academy</span>
            <span className={styles.groupDesc}>
              Accredited cloud architecture, operational administration, and natural language processing badges.
            </span>
          </div>

          <div className={styles.awsGrid}>
            {awsBadges.map((badge) => (
              <a
                key={badge.id}
                href={badge.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.badgeItem} ${styles.badgeItemInteractive}`}
                aria-label={`Verify ${badge.title} on Credly`}
              >
                <div className={styles.badgeImageWrapper}>
                  <img
                    src={getAssetPath(badge.image)}
                    alt={badge.title}
                    className={styles.awsBadgeImage}
                    loading="lazy"
                  />
                </div>
                <h3 className={styles.badgeTitle}>{badge.title}</h3>
                <span className={styles.badgeMeta}>{badge.level} · {badge.issueDate}</span>
                <span className={styles.verifyLink}>
                  <span>Verify on Credly</span>
                  <span aria-hidden="true">↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 2 & 3. Oracle and Cisco Prominent Row */}
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupLabel}>Enterprise & Systems Specializations</span>
            <span className={styles.groupDesc}>
              Autonomous AI agent foundations and Linux operating system fundamentals.
            </span>
          </div>

          <div className={styles.midTierRow}>
            {/* Oracle Badge */}
            {oracleBadge && (
              <div className={styles.distinctBadgeBox}>
                <img
                  src={getAssetPath(oracleBadge.image)}
                  alt={oracleBadge.title}
                  className={styles.oracleBadgeImage}
                  loading="lazy"
                />
                <div className={styles.distinctBadgeContent}>
                  <span className={styles.groupLabel}>Oracle University</span>
                  <h3 className={styles.distinctBadgeTitle}>{oracleBadge.title}</h3>
                  <span className={styles.badgeMeta}>
                    {oracleBadge.level} · Issued {oracleBadge.issueDate}
                  </span>
                </div>
              </div>
            )}

            {/* Cisco Badge */}
            {ciscoBadge && (
              <div className={styles.distinctBadgeBox}>
                <img
                  src={getAssetPath(ciscoBadge.image)}
                  alt={ciscoBadge.title}
                  className={styles.ciscoBadgeImage}
                  loading="lazy"
                />
                <div className={styles.distinctBadgeContent}>
                  <span className={styles.groupLabel}>Cisco Networking Academy</span>
                  <h3 className={styles.distinctBadgeTitle}>{ciscoBadge.title}</h3>
                  <span className={styles.badgeMeta}>
                    {ciscoBadge.level} · In collaboration with NDG
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. LeetCode Milestone Entry (Above GCP) */}
        {leetcodeBadge && (
          <div className={styles.group}>
            <div className={styles.groupHeader}>
              <span className={styles.groupLabel}>Algorithmic Consistency</span>
              <span className={styles.groupDesc}>
                Platform consistency and daily problem-solving dedication milestone.
              </span>
            </div>

            <a
              href={leetcodeBadge.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.leetcodeBox}
              aria-label="View LeetCode Profile with 50 Days Badge"
            >
              <img
                src={getAssetPath(leetcodeBadge.image)}
                alt={leetcodeBadge.title}
                className={styles.lcBadgeImage}
                loading="lazy"
              />
              <div className={styles.distinctBadgeContent}>
                <span className={styles.groupLabel}>LeetCode</span>
                <h3 className={styles.distinctBadgeTitle}>{leetcodeBadge.title}</h3>
                <span className={styles.badgeMeta}>{leetcodeBadge.level}</span>
                <span className={styles.verifyLink}>
                  <span>View Public Profile</span>
                  <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>
          </div>
        )}

        {/* 4. Google Cloud Skills Boost Grid */}
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupLabel}>Google Cloud Skills Boost</span>
            <span className={styles.groupDesc}>
              Practical lab milestones across Vertex AI, Gemini models, IAM security, and cloud infrastructure.
            </span>
          </div>

          <div className={styles.gcpGrid}>
            {gcpBadges.map((badge) => (
              <div key={badge.id} className={styles.gcpItem}>
                <img
                  src={getAssetPath(badge.image)}
                  alt={badge.title}
                  className={styles.gcpBadgeImage}
                  loading="lazy"
                />
                <h4 className={styles.gcpTitle}>{badge.title}</h4>
                <span className={styles.gcpLevel}>{badge.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DigitalBadges;
