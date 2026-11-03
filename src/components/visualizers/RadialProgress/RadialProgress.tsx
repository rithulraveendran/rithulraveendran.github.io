import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './RadialProgress.module.css';

interface RadialProgressProps {
  easy: number;
  medium: number;
  hard: number;
  totalSolved: number;
}

export function RadialProgress({ easy, medium, hard, totalSolved }: RadialProgressProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const easyRef = useRef<SVGCircleElement | null>(null);
  const mediumRef = useRef<SVGCircleElement | null>(null);
  const hardRef = useRef<SVGCircleElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12

  // Portions relative to total solved (fallback to equal split if 0)
  const safeTotal = totalSolved > 0 ? totalSolved : 1;
  const easyLen = (easy / safeTotal) * circumference;
  const mediumLen = (medium / safeTotal) * circumference;
  const hardLen = (hard / safeTotal) * circumference;

  // Staggered offsets for consecutive segments around the circle
  // Arc 1: starts at 0
  const easyOffset = 0;
  // Arc 2: starts after easy
  const mediumOffset = -easyLen;
  // Arc 3: starts after easy + medium
  const hardOffset = -(easyLen + mediumLen);

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      const arcs = [easyRef.current, mediumRef.current, hardRef.current].filter(Boolean);
      if (arcs.length > 0) {
        gsap.fromTo(
          arcs,
          { opacity: 0, strokeDasharray: `0 ${circumference}` },
          {
            opacity: 1,
            strokeDasharray: (index) => {
              if (index === 0) return `${easyLen} ${circumference}`;
              if (index === 1) return `${mediumLen} ${circumference}`;
              return `${hardLen} ${circumference}`;
            },
            duration: 1.2,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    },
    containerRef,
    [prefersReducedMotion, easy, medium, hard, totalSolved]
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <svg
        viewBox="0 0 160 160"
        className={styles.svg}
        role="img"
        aria-label={`Radial breakdown: ${easy} Easy, ${medium} Medium, ${hard} Hard, total ${totalSolved} solved`}
      >
        {/* Background Track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          className={styles.trackCircle}
        />

        {/* Easy Segment */}
        {easy > 0 && (
          <circle
            ref={easyRef}
            cx="80"
            cy="80"
            r={radius}
            className={`${styles.progressCircle} ${styles.easyArc}`}
            strokeDasharray={`${easyLen} ${circumference}`}
            strokeDashoffset={easyOffset}
          />
        )}

        {/* Medium Segment */}
        {medium > 0 && (
          <circle
            ref={mediumRef}
            cx="80"
            cy="80"
            r={radius}
            className={`${styles.progressCircle} ${styles.mediumArc}`}
            strokeDasharray={`${mediumLen} ${circumference}`}
            strokeDashoffset={mediumOffset}
          />
        )}

        {/* Hard Segment */}
        {hard > 0 && (
          <circle
            ref={hardRef}
            cx="80"
            cy="80"
            r={radius}
            className={`${styles.progressCircle} ${styles.hardArc}`}
            strokeDasharray={`${hardLen} ${circumference}`}
            strokeDashoffset={hardOffset}
          />
        )}
      </svg>

      <div className={styles.centerText}>
        <span className={styles.totalNumber}>{totalSolved}</span>
        <span className={styles.totalLabel}>Solved</span>
      </div>
    </div>
  );
}

export default RadialProgress;
