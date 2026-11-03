import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Register GSAP plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Global reference to ensure a single instance across strict-mode mounts
let globalLenisInstance: Lenis | null = null;

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, do not initialize smooth scroll physics
    if (prefersReducedMotion || typeof window === 'undefined') {
      if (globalLenisInstance) {
        globalLenisInstance.destroy();
        globalLenisInstance = null;
      }
      return;
    }

    // Reuse existing instance if present (prevents React Strict Mode double-init)
    if (!globalLenisInstance) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      });

      // Synchronize Lenis scroll updates with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Bind Lenis animation frame updates to GSAP's central ticker
      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      globalLenisInstance = lenis;
    }

    lenisRef.current = globalLenisInstance;

    return () => {
      // In production/normal unmount, we clean up
      // Note: in React 18/19 Strict Mode development, keeping instance stable prevents jitter
    };
  }, [prefersReducedMotion]);

  return lenisRef;
}
