import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getAssetPath } from '@/utils/assets';
import { CERTIFICATIONS } from '@/content/certifications';
import type { CertificationEntry } from '@/types/content';
import { CertificateViewerModal } from './CertificateViewerModal';
import styles from './Certifications.module.css';

export function Certifications() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [selectedCert, setSelectedCert] = useState<CertificationEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Scroll-driven stacked-to-gallery transformation
  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      const stage = stageRef.current;
      const grid = gridRef.current;
      if (!stage || !grid) return;

      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.certCard}`, grid);
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      // Universal 3x3 organized gallery transformation (Locked for all devices)
      mm.add('all', () => {
        const gridW = grid.offsetWidth;
        const gridH = grid.offsetHeight;
        const centerX = gridW / 2;
        const centerY = gridH / 2;

        // Subtle, authentic physical stack angles and offsets
        const stackAngles = [-5.5, 4.2, -3.8, 5.0, -4.5, 3.2, -6.0, 4.8, -2.5];
        const stackOffsetsX = [-14, 16, -10, 18, -16, 12, -18, 10, -8];
        const stackOffsetsY = [-10, 8, 12, -8, 6, -12, 10, 14, -6];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Fade scroll prompt as scrub begins
        const prompt = stage.querySelector(`.${styles.scrollPrompt}`);
        if (prompt) {
          tl.to(prompt, { opacity: 0, duration: 0.15 }, 0);
        }

        cards.forEach((card, idx) => {
          const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
          const cardCenterY = card.offsetTop + card.offsetHeight / 2;
          const deltaX = centerX - cardCenterX + stackOffsetsX[idx % stackOffsetsX.length];
          const deltaY = centerY - cardCenterY + stackOffsetsY[idx % stackOffsetsY.length];
          const angle = stackAngles[idx % stackAngles.length];
          const zIndex = cards.length - idx;

          gsap.set(card, { zIndex });

          tl.fromTo(
            card,
            {
              x: deltaX,
              y: deltaY,
              rotation: angle,
              scale: 0.88,
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.45)',
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              boxShadow: 'var(--card-shadow-sm)',
              ease: 'power2.out',
            },
            // Stagger outward glide so top cards fly out first, revealing lower ones
            idx * 0.055
          );
        });
      });

      return () => {
        mm.revert();
      };
    },
    sectionRef,
    [prefersReducedMotion]
  );

  const handleOpenViewer = (cert: CertificationEntry) => {
    if (cert.image) {
      setSelectedCert(cert);
      setIsModalOpen(true);
    }
  };

  const handleCloseViewer = () => {
    setIsModalOpen(false);
    setSelectedCert(null);
  };

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className={styles.section}
      aria-label="Certifications and Verified Credentials"
    >
      <div ref={stageRef} className={styles.stageWrapper}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>08 / Certifications &amp; Credentials</p>
          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.title}>Certifications &amp; Verified Credentials</h2>
              <p className={styles.subtitle}>
                Verified industry credentials, proctored examinations, and hackathon achievements.
              </p>
            </div>
            {!prefersReducedMotion && (
              <div className={styles.scrollPrompt} aria-hidden="true">
                <span>Scroll down to unpack gallery ↓</span>
              </div>
            )}
          </div>
        </header>

        {/* 3x3 Certificate Showcase Gallery */}
        <div ref={gridRef} className={styles.galleryGrid} role="list" aria-label="Certificate Gallery">
          {CERTIFICATIONS.map((cert) => (
            <article
              key={cert.id}
              className={styles.certCard}
              role="listitem"
              onClick={() => handleOpenViewer(cert)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenViewer(cert);
                }
              }}
              tabIndex={0}
              aria-label={`${cert.title} by ${cert.issuer}. Click to inspect.`}
            >
              {/* Certificate Scan Visual Preview */}
              <div className={styles.cardMedia}>
                {cert.image ? (
                  <img
                    src={getAssetPath(cert.image)}
                    alt={`${cert.title} preview`}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span>Pending Asset</span>
                  </div>
                )}
                <span className={styles.zoomHint} aria-hidden="true">
                  Inspect ↗
                </span>
              </div>

              {/* Card Metadata Details */}
              <div className={styles.cardBody}>
                <span className={styles.issuerTag}>{cert.issuer}</span>
                <h3 className={styles.certTitle}>{cert.title}</h3>

                <div className={styles.certMeta}>
                  <span>{cert.issueDate}</span>
                  {cert.hours && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{cert.hours} Hours</span>
                    </>
                  )}
                  {cert.validity && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{cert.validity}</span>
                    </>
                  )}
                </div>

                {cert.note && <p className={styles.certNote}>{cert.note}</p>}

                {/* Card Action Row */}
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.viewAction}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenViewer(cert);
                    }}
                    aria-label={`View full certificate for ${cert.title}`}
                  >
                    <span>View Certificate</span>
                    <span aria-hidden="true">↗</span>
                  </button>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.credlyAction}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Verify ${cert.title} on Credly`}
                    >
                      <span>Credly ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Accessible Full-Screen Modal Viewer */}
      <CertificateViewerModal
        isOpen={isModalOpen}
        onClose={handleCloseViewer}
        certificate={selectedCert}
      />
    </section>
  );
}

export default Certifications;
