import { useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './DifficultyBar.module.css';

interface DifficultyBarProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: number;
  total: number;
}

export function DifficultyBar({ difficulty, solved, total }: DifficultyBarProps) {
  const fillRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const percentage = total > 0 ? Math.min(100, (solved / total) * 100) : 0;
  const scale = total > 0 ? solved / total : 0;

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { scaleX: 0 },
          {
            scaleX: scale,
            duration: 1.0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    },
    containerRef,
    [prefersReducedMotion, scale]
  );

  const diffClass =
    difficulty === 'Easy'
      ? styles.diffEasy
      : difficulty === 'Medium'
      ? styles.diffMedium
      : styles.diffHard;

  const fillClass =
    difficulty === 'Easy'
      ? styles.fillEasy
      : difficulty === 'Medium'
      ? styles.fillMedium
      : styles.fillHard;

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.labelRow}>
        <span className={`${styles.diffName} ${diffClass}`}>{difficulty}</span>
        <span className={styles.diffCounts}>
          <span className={styles.diffSolved}>{solved}</span> / {total} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className={styles.track}>
        <div
          ref={fillRef}
          className={`${styles.fill} ${fillClass}`}
          style={prefersReducedMotion ? { transform: `scaleX(${scale})` } : undefined}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default DifficultyBar;
