import { useState, useEffect } from 'react';
import { PROFILE_CONFIG } from '@/config/profile';
import { getAssetPath } from '@/utils/assets';
import styles from './Navbar.module.css';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Open Source', href: '#opensource' },
  { label: 'GitHub', href: '#github' },
  { label: 'Competitive', href: '#competitive' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Badges', href: '#badges' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['top', ...NAV_ITEMS.map((item) => item.href.slice(1))];
      const scrollPosition = window.scrollY + 120; // Offset for header height

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand} aria-label={`${PROFILE_CONFIG.name} — Back to top`}>
          <span className={styles.brandDot} aria-hidden="true" />
          <span>{PROFILE_CONFIG.name}</span>
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Main Navigation">
          <ul className={styles.navLinks}>
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href={getAssetPath(PROFILE_CONFIG.resume.path)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeButton}
            aria-label="Open résumé in new tab"
          >
            <span>Résumé</span>
            <span aria-hidden="true">↗</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className={styles.mobileToggle}
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isMobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawer} ${isMobileOpen ? styles.mobileDrawerOpen : ''}`}
        aria-hidden={!isMobileOpen}
      >
        <ul className={styles.mobileNavLinks}>
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.slice(1);
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href={getAssetPath(PROFILE_CONFIG.resume.path)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileResumeButton}
          onClick={handleLinkClick}
        >
          <span>View Résumé ↗</span>
        </a>
      </div>
    </header>
  );
}

export default Navbar;
