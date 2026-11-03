import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EXPERIENCES } from '@/content/experience';
import styles from './Experience.module.css';

export function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);
  const entriesRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      // Create coordinated timeline expansion on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Expand the horizontal timeline rail from left to right
      if (progressLineRef.current) {
        tl.fromTo(
          progressLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.0, ease: 'power2.out' }
        );
      }

      // 2. Reveal experience entries in a controlled stagger
      if (entriesRef.current) {
        const cards = entriesRef.current.querySelectorAll(`.${styles.entryItem}`);
        tl.fromTo(
          cards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15 },
          '-=0.6'
        );
      }
    },
    sectionRef,
    [prefersReducedMotion]
  );

  return (
    <section id="experience" ref={sectionRef} className={styles.section} aria-label="Professional and Technical Experience">
      <header className={styles.header}>
        <p className={styles.eyebrow}>03 / Experience</p>
        <h2 className={styles.title}>Engineering Experience</h2>
        <p className={styles.subtitle}>
          Technical roles focusing on embedded computer vision, model deployment, and software engineering.
        </p>
      </header>

      <div className={styles.timelineContainer}>
        {/* Left-to-Right Expanding Timeline Rail */}
        <div className={styles.timelineTrack} aria-hidden="true">
          <div
            ref={progressLineRef}
            className={styles.timelineProgress}
            style={prefersReducedMotion ? { transform: 'scaleX(1)' } : undefined}
          />
        </div>

        {/* Experience Entries Grid */}
        <div ref={entriesRef} className={styles.entriesGrid}>
          {EXPERIENCES.map((exp) => (
            <article
              key={exp.id}
              className={styles.entryItem}
              style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
            >
              <div className={styles.periodRow}>
                <span className={styles.periodNode} aria-hidden="true" />
                <time className={styles.periodText}>
                  {exp.period.start === exp.period.end
                    ? exp.period.start
                    : `${exp.period.start} — ${exp.period.end}`}
                </time>
              </div>

              <h3 className={styles.role}>{exp.role}</h3>
              <p className={styles.organization}>{exp.organization}</p>

              <ul className={styles.deliverables}>
                {exp.description.map((item, idx) => (
                  <li key={idx} className={styles.deliverableItem}>
                    {item}
                  </li>
                ))}
              </ul>

              <div className={styles.techRow} aria-label="Technologies used">
                <span className={styles.techLabel}>Stack:</span>
                {exp.technologies.map((tech, idx) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                    {idx < exp.technologies.length - 1 && (
                      <span className={styles.techSeparator} aria-hidden="true">
                        {' '}·{' '}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
