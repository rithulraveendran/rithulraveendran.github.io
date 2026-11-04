import { useState, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ABOUT_CONTENT } from '@/content/about';
import { getAssetPath } from '@/utils/assets';
import styles from './About.module.css';

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = usePrefersReducedMotion();

  const photos = ABOUT_CONTENT.photos;
  const totalPhotos = photos.length;

  // Scroll-driven photo choreography:
  // When the About section title arrives at top (below the fixed navbar),
  // pin the screen to smoothly change the image, then unpin so scrolling moves
  // the text with the image moving along until the end of the section.
  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined' || totalPhotos <= 1) return;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 4rem',
        end: '+=450',
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const targetIdx = Math.min(totalPhotos - 1, Math.floor(self.progress * totalPhotos));
          setActivePhotoIndex((prev) => (prev !== targetIdx ? targetIdx : prev));
        },
      });

      return () => {
        trigger.kill();
      };
    },
    sectionRef,
    [prefersReducedMotion, totalPhotos]
  );

  const handleImageError = (photoId: string) => {
    setFailedImages((prev) => ({ ...prev, [photoId]: true }));
  };

  const allImagesFailed = totalPhotos === 0 || photos.every((p) => failedImages[p.id]);

  return (
    <section id="about" ref={sectionRef} className={styles.section} aria-label="About Rithul Raveendran">
      <div className={styles.inner}>
        {/* Header Block: Eyebrow, Title & Lead */}
        <div className={styles.headerBlock}>
          <p className={styles.eyebrow}>{ABOUT_CONTENT.eyebrow}</p>
          <h2 className={styles.title}>{ABOUT_CONTENT.title}</h2>
          <p className={styles.lead}>{ABOUT_CONTENT.lead}</p>
        </div>

        {/* Dynamic Photograph Stage */}
        <div
          className={styles.photoCol}
          aria-label="Personal Photography Gallery"
        >
          <div className={styles.photoFrame}>
            {allImagesFailed ? (
              <div className={styles.placeholderFrame}>
                <svg
                  className={styles.placeholderIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className={styles.placeholderTitle}>Authentic Photographs</p>
                <p className={styles.placeholderSubtitle}>
                  Curated academic and project moments will be presented here as images are provided.
                </p>
              </div>
            ) : (
              photos.map((photo, idx) => {
                const isActive = idx === activePhotoIndex;
                const isFailed = failedImages[photo.id];
                if (isFailed) return null;

                return (
                  <div
                    key={photo.id}
                    className={`${styles.photoSlide} ${isActive ? styles.photoSlideActive : ''}`}
                    aria-hidden={!isActive}
                  >
                    <img
                      src={getAssetPath(photo.src)}
                      alt={photo.alt}
                      className={styles.photoImg}
                      loading="eager"
                      onError={() => handleImageError(photo.id)}
                    />
                    {photo.caption && (
                      <div className={styles.captionBar}>
                        <span className={styles.captionText}>{photo.caption}</span>
                        <div className={styles.controlsRow}>
                          <div className={styles.dotsGroup} role="tablist" aria-label="Photo Selector">
                            {photos.map((p, dotIdx) => (
                              <button
                                key={p.id}
                                type="button"
                                role="tab"
                                aria-selected={dotIdx === activePhotoIndex}
                                onClick={() => setActivePhotoIndex(dotIdx)}
                                className={`${styles.dotButton} ${
                                  dotIdx === activePhotoIndex ? styles.dotButtonActive : ''
                                }`}
                                aria-label={`View photo ${dotIdx + 1}: ${p.caption || p.alt}`}
                              />
                            ))}
                          </div>
                          <span className={styles.indicator} aria-hidden="true">
                            0{idx + 1} / 0{totalPhotos}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Story Block: Narrative & Background Facts */}
        <div className={styles.storyBlock}>
          <div className={styles.narrative}>
            {ABOUT_CONTENT.paragraphs.map((paragraph, idx) => (
              <p key={idx} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <dl className={styles.factsTable} aria-label="Academic & Technical Background Facts">
            {ABOUT_CONTENT.facts.map((fact, idx) => (
              <div key={idx} className={styles.factRow}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default About;
