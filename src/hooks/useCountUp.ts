import { useState, useEffect, useRef } from 'react';

/**
 * Animated rolling number counter hook
 * Rolls smoothly from 0 to target value when triggered into view.
 */
export function useCountUp(target: number, duration: number = 1400, trigger: boolean = true): number {
  const [count, setCount] = useState<number>(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger || target === 0) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out expo curve for satisfying deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(easeProgress * target);

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, trigger]);

  return count;
}
