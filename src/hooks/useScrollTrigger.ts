import { useLayoutEffect, useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// React 19 / SSR safe layout effect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Hook for safely scoping GSAP ScrollTrigger animations to a React component.
 * Automatically handles cleanup and reverts all tweens/triggers on unmount
 * using gsap.context().
 *
 * @param callback - Function creating GSAP animations/ScrollTriggers
 * @param scopeRef - Container ref scoping the animation selector queries
 * @param dependencies - React dependency list to trigger re-creation
 */
export function useScrollTrigger(
  callback: (context: gsap.Context) => void,
  scopeRef?: RefObject<HTMLElement | null>,
  dependencies: unknown[] = []
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context((self) => {
      callbackRef.current(self);
    }, scopeRef?.current || undefined);

    return () => {
      ctx.revert(); // Reverts all ScrollTriggers and tweens created in this context
    };
  }, dependencies);
}
