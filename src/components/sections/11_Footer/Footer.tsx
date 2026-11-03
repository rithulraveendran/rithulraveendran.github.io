import { useState, useRef } from 'react';
import { PROFILE_CONFIG } from '@/config/profile';
import { getAssetPath } from '@/utils/assets';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './Footer.module.css';

export function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const emailSubject = encodeURIComponent('Inquiry / Opportunity — Rithul Raveendran Portfolio');
  const emailBody = encodeURIComponent(
    'Hi Rithul,\n\nI came across your engineering portfolio and would like to connect regarding:\n\n'
  );
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE_CONFIG.contact.email}&su=${emailSubject}&body=${emailBody}`;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(PROFILE_CONFIG.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer id="contact" ref={footerRef} className={styles.footer} aria-label="Contact and Social Connections">
      <div className={styles.inner}>
        {/* Top Section: Identity & Primary Direct Contact */}
        <div className={styles.topSection}>
          <div className={styles.identityCol}>
            <span className={styles.eyebrow}>11 / Contact</span>
            <h2 className={styles.name}>{PROFILE_CONFIG.name}</h2>
            <p className={styles.bio}>
              B.Tech student in Artificial Intelligence and Machine Learning at St. Joseph&apos;s College of Engineering, Chennai.
            </p>
            <span className={styles.educationBadge}>
              {PROFILE_CONFIG.education.institution} · {PROFILE_CONFIG.education.period}
            </span>
          </div>

          <div className={styles.actionsCol}>
            <div className={styles.emailRow}>
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.emailLink}
                aria-label={`Send email to ${PROFILE_CONFIG.contact.email} (opens Gmail compose)`}
                title="Open in Gmail"
              >
                <span>{PROFILE_CONFIG.contact.email}</span>
                <span aria-hidden="true" className={styles.linkArrow}>↗</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={styles.copyEmailBtn}
                aria-label="Copy email address to clipboard"
                title="Copy email to clipboard"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

            <a
              href={getAssetPath(PROFILE_CONFIG.resume.path)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeButton}
              aria-label="View official résumé PDF in a new tab"
            >
              <span>Download Résumé</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Social Connections with authentic WebM Animations */}
        <div className={styles.socialSection}>
          <span className={styles.socialLabel}>Profiles</span>

          <div className={styles.socialGrid}>
            {PROFILE_CONFIG.social.map((item) => {
              const isMail = item.url.startsWith('mailto:');
              return (
                <a
                  key={item.platform}
                  href={item.url}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  className={styles.socialItem}
                  aria-label={`${item.label} (${isMail ? 'Open email client' : 'External profile'})`}
                >
                  <div className={styles.videoWrapper}>
                    <video
                      src={getAssetPath(item.videoAsset)}
                      className={styles.socialVideo}
                      autoPlay={!prefersReducedMotion}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <span>{item.label}</span>
                    </video>
                  </div>
                  <span className={styles.socialName}>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Clean Navigation */}
        <div className={styles.bottomBar}>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }}
            className={styles.backToTop}
            aria-label="Return to the top of the page"
          >
            <span>Back to top</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
