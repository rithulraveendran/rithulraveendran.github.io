import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { PROJECTS } from '@/content/projects';
import { PROFILE_CONFIG } from '@/config/profile';
import { getAssetPath } from '@/utils/assets';
import styles from './Projects.module.css';

export function Projects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = usePrefersReducedMotion();

  const githubLink =
    PROFILE_CONFIG.social.find((s) => s.platform === 'github')?.url ||
    `https://github.com/${PROFILE_CONFIG.competitiveHandles.github}`;

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      const mm = gsap.matchMedia();

      // Universal Pinned Horizontal Showcase (Locked for all devices)
      mm.add('all', () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80);

        const horizontalTween = gsap.to(track, {
          x: getScrollAmount,
          ease: 'none',
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, window.innerHeight * 1.5)}`,
          pin: true,
          animation: horizontalTween,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        });
      });

      return () => {
        mm.revert();
      };
    },
    sectionRef,
    [prefersReducedMotion]
  );

  const handleImageError = (projectId: string) => {
    setImageErrors((prev) => ({ ...prev, [projectId]: true }));
  };

  return (
    <section id="projects" ref={sectionRef} className={styles.section} aria-label="Featured Projects Showcase">
      <div className={styles.pinnedWrapper}>
        {/* Section Header */}
        <div className={styles.headerContainer}>
          <p className={styles.eyebrow}>04 / Projects</p>
          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.title}>Featured Work</h2>
              <p className={styles.subtitle}>
                A selection of projects I've worked on across AI/ML and software development.
              </p>
            </div>
            <span className={styles.scrollHint} aria-hidden="true">
              Scroll down to explore →
            </span>
          </div>
        </div>

        {/* Desktop Progress Indicator */}
        <div className={styles.progressBarTrack} aria-hidden="true">
          <div ref={progressFillRef} className={styles.progressBarFill} />
        </div>

        {/* Project Panels Track */}
        <div className={styles.trackViewport}>
          <div ref={trackRef} className={styles.track}>
            {PROJECTS.map((proj, idx) => {
              const hasHero = proj.visuals?.hero && !imageErrors[proj.id];

              return (
                <article key={proj.id} className={styles.projectPanel}>
                  <div className={styles.panelTop}>
                    <span className={styles.categoryTag}>
                      0{idx + 1} / {proj.category || 'Engineering'}
                    </span>
                    <h3 className={styles.projectTitle}>{proj.title}</h3>
                    <p className={styles.projectTagline}>{proj.tagline}</p>
                    <p className={styles.projectDescription}>{proj.description}</p>

                    {/* Architecture Flow Rail (if defined) */}
                    {proj.architectureFlow && (
                      <div className={styles.flowRail} aria-label="System Architecture Pipeline">
                        {proj.architectureFlow.map((step, sIdx) => (
                          <span key={step} className={styles.flowStep}>
                            {step}
                            {sIdx < proj.architectureFlow!.length - 1 && (
                              <span className={styles.flowArrow} aria-hidden="true">
                                {' '}→{' '}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Visual Preview (rendered only when genuine asset is provided) */}
                  {hasHero && (
                    <div className={styles.visualFrame}>
                      <img
                        src={getAssetPath(proj.visuals!.hero!)}
                        alt={proj.visuals?.caption || proj.title}
                        className={styles.visualImg}
                        loading="lazy"
                        onError={() => handleImageError(proj.id)}
                      />
                    </div>
                  )}

                  {/* Technical Spec List */}
                  <div className={styles.specList}>
                    {proj.problem && (
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>Purpose:</span>
                        <span className={styles.specValue}>{proj.problem}</span>
                      </div>
                    )}
                    {proj.role && (
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>Role:</span>
                        <span className={styles.specValue}>{proj.role}</span>
                      </div>
                    )}
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Stack:</span>
                      <span className={styles.specValue}>{proj.technologies.join(' · ')}</span>
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className={styles.panelActions}>
                    {proj.links.github && (
                      <a
                        href={proj.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkPrimary}
                      >
                        <span>View Repository</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {proj.links.demo && (
                      <a
                        href={proj.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkSecondary}
                      >
                        <span>Live Demo</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}

            {/* Closing Finale Panel linking to GitHub */}
            <div className={styles.panelFinale}>
              <span className={styles.finaleEyebrow}>Open Source</span>
              <h3 className={styles.finaleTitle}>Explore more on GitHub</h3>
              <p className={styles.finaleDesc}>
                Additional experimental agents, embedded computer vision models, and utility tools are maintained publicly on my GitHub.
              </p>
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.finaleButton}
              >
                <span>github.com/{PROFILE_CONFIG.competitiveHandles.github}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
