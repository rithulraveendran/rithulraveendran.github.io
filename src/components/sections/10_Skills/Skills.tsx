import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SKILL_CATEGORIES } from '@/content/skills';
import styles from './Skills.module.css';

export function Skills() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const specsRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      if (specsRef.current) {
        const rows = specsRef.current.querySelectorAll(`.${styles.categoryRow}`);
        gsap.fromTo(
          rows,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: specsRef.current,
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
      id="skills"
      ref={sectionRef}
      className={styles.section}
      aria-label="Technical Skills and System Proficiencies"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>10 / Technical Skills</p>
        <h2 className={styles.title}>Disciplines & Systems</h2>
        <p className={styles.subtitle}>
          Core programming languages, machine learning architectures, backend services, and deployment toolchains.
        </p>
      </header>

      <div ref={specsRef} className={styles.specsContainer}>
        {SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.category}
            className={styles.categoryRow}
            style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
          >
            <div className={styles.categoryHeader}>
              <h3 className={styles.categoryTitle}>{cat.category}</h3>
            </div>

            <div className={styles.skillsGroup}>
              {cat.items.map((skill, index) => (
                <span key={skill} className={styles.skillItem}>
                  {skill}
                  {index < cat.items.length - 1 && (
                    <span className={styles.delimiter} aria-hidden="true">
                      {' '}
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
