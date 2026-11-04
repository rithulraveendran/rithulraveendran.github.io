import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { PROFILE_CONFIG } from '@/config/profile';
import { getAssetPath } from '@/utils/assets';
import styles from './Hero.module.css';

export function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollTrigger(
    () => {
      if (prefersReducedMotion) return;

      // Animate name rising gently into position on initial load
      if (nameRef.current) {
        gsap.fromTo(
          nameRef.current,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.1 }
        );
      }

      // Subtle staggered fade for surrounding context
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll(`.${styles.intro}, .${styles.actions}`);
        gsap.fromTo(
          elements,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.15, delay: 0.35 }
        );
      }
    },
    containerRef,
    [prefersReducedMotion]
  );

  return (
    <section id="top" ref={containerRef} className={styles.hero} aria-label="Introduction">
      <div className={styles.heroGrid}>
        <div className={styles.content} ref={contentRef}>
          <div className={styles.nameWrapper}>
            <h1 ref={nameRef} className={styles.name}>
              {PROFILE_CONFIG.name}
            </h1>
          </div>

          <h2 className={styles.headline}>
            Learning, building, and experimenting across AI/ML and full-stack development.
          </h2>

          <p className={styles.intro}>
            Second-year B.Tech student in Artificial Intelligence and Machine Learning at St. Joseph’s College of Engineering, Chennai. Interested in machine learning and building practical software applications, from backend systems and APIs to user-facing interfaces.
          </p>

          <div className={styles.actions}>
            <a href="#projects" className={styles.actionPrimary}>
              <span>Explore Projects</span>
              <span aria-hidden="true">↓</span>
            </a>
            <a
              href={getAssetPath(PROFILE_CONFIG.resume.path)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionSecondary}
              aria-label="Open official résumé PDF in new tab"
            >
              <span>Open Résumé</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#about" className={styles.actionLink}>
              <span>About Background</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className={styles.portraitCol}>
          <div className={styles.portraitWrapper}>
            <div className={styles.portraitFrame}>
              <img
                src={getAssetPath('assets/hero/portrait.jpg')}
                alt={PROFILE_CONFIG.name}
                className={styles.portraitImg}
                loading="eager"
              />
            </div>
            {/* Playful Rotating Orbit Badge */}
            <div className={styles.orbitBadge} aria-hidden="true">
              <svg className={styles.orbitSvg} viewBox="0 0 140 140">
                <path
                  id="orbitTextPath"
                  d="M 70, 70 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                  fill="none"
                />
                <text className={styles.orbitText}>
                  <textPath href="#orbitTextPath" startOffset="0%">
                    AI &amp; ML • DEEP LEARNING • COMPUTER VISION • 
                  </textPath>
                </text>
              </svg>
              <div className={styles.orbitDot} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.metaRail} aria-label="Current Status Summary">
        <div className={styles.metaItem}>
          <span>Education:</span>
          <strong>St. Joseph's College of Engineering (2025–2029)</strong>
        </div>
        <div className={styles.metaItem}>
          <span>Focus Area:</span>
          <strong>ML &amp; Full-Stack Development</strong>
        </div>
        <div className={styles.metaItem}>
          <span>Status:</span>
          <strong>Open for Internships</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;
