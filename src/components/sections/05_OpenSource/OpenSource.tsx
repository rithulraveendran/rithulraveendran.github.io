import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getAssetPath } from '@/utils/assets';
import { OPEN_SOURCE_CONTRIBUTIONS } from '@/content/openSource';
import { CertificateViewerModal } from '@/components/sections/08_Certifications/CertificateViewerModal';
import type { CertificationEntry } from '@/types/content';
import styles from './OpenSource.module.css';

const SWOC_ENTRY: CertificationEntry = {
  id: 'swoc-badge',
  title: 'Social Winter of Code Program Badge',
  issuer: 'Social Winter of Code (SWoC)',
  issueDate: '2026',
  image: 'assets/opensource/swoc.png',
  category: 'professional',
  note: 'Recognized open-source contributor in Social Winter of Code.',
};

export function OpenSource() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      if (listRef.current) {
        const cards = listRef.current.querySelectorAll(`.${styles.contributionItem}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: badgeRef.current,
              start: 'top 90%',
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
      id="opensource"
      ref={sectionRef}
      className={styles.section}
      aria-label="Open Source Contributions"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>05 / Open Source</p>
        <h2 className={styles.title}>Open Source Contributions</h2>
        <p className={styles.subtitle}>
          Direct pull requests and documentation improvements across public repositories.
        </p>
      </header>

      {/* Verified Contributions List */}
      <div ref={listRef} className={styles.contributionsList}>
        {OPEN_SOURCE_CONTRIBUTIONS.map((item) => (
          <article
            key={item.id}
            className={styles.contributionItem}
            style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
          >
            <div className={styles.itemHeader}>
              <div className={styles.repoInfo}>
                <a
                  href={item.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoName}
                >
                  {item.repository}
                </a>
                <span className={styles.prNumber}>#{item.prNumber}</span>
              </div>

              <span
                className={`${styles.statusBadge} ${
                  item.status === 'merged' ? styles.statusMerged : styles.statusOpen
                }`}
              >
                <span>{item.status === 'merged' ? 'Merged' : 'Open'}</span>
              </span>
            </div>

            <h3 className={styles.prTitle}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>

            <div className={styles.itemFooter}>
              <div className={styles.metaInfo}>
                <span>{item.type.toUpperCase()}</span>
                <span aria-hidden="true">·</span>
                <span>{item.date}</span>
              </div>

              <a
                href={item.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.prLink}
              >
                <span>View Pull Request</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Program Affiliation (Visually distinct from code contributions) */}
      <div ref={badgeRef} className={styles.programSection}>
        <p className={styles.programHeading}>Program Affiliations</p>
        <div
          className={styles.badgeCard}
          role="button"
          tabIndex={0}
          onClick={() => setIsModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
          aria-label="Social Winter of Code Badge. Click to view full certificate."
        >
          <img
            src={getAssetPath('assets/opensource/swoc.png')}
            alt="SWoC Badge"
            className={styles.badgeImage}
            loading="lazy"
          />
          <div className={styles.badgeContent}>
            <span className={styles.badgeTag}>Program Badge · Click to Inspect</span>
            <h4 className={styles.badgeTitle}>SWoC Badge</h4>
            <p className={styles.badgeDescription}>
              Social Winter of Code program badge. Click to inspect full credential.
            </p>
          </div>
        </div>
      </div>

      <CertificateViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certificate={SWOC_ENTRY}
      />
    </section>
  );
}

export default OpenSource;
