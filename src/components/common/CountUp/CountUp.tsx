import { useState, useEffect, useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  formatCommas?: boolean;
}

export function CountUp({
  value,
  duration = 1400,
  className,
  prefix = '',
  suffix = '',
  formatCommas = true,
}: CountUpProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const animatedValue = useCountUp(value, duration, isVisible);

  const formatted = formatCommas ? animatedValue.toLocaleString() : animatedValue;

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
