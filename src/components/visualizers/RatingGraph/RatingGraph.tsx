import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { ContestRatingPoint } from '@/types/stats';
import styles from './RatingGraph.module.css';

interface RatingGraphProps {
  history: ContestRatingPoint[];
}

export function RatingGraph({ history }: RatingGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const areaRef = useRef<SVGPathElement | null>(null);
  const pointsRef = useRef<SVGGElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [tooltip, setTooltip] = useState<{
    contestName: string;
    rating: number;
    rank?: number;
    date: string;
    x: number;
    y: number;
    visible: boolean;
  }>({
    contestName: '',
    rating: 0,
    date: '',
    x: 0,
    y: 0,
    visible: false,
  });

  const hasHistory = history && history.length > 0;
  const historyList = history || [];

  const svgWidth = 600;
  const svgHeight = 180;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 30;
  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const ratings = hasHistory ? historyList.map((h) => h.rating) : [0];
  const rawMin = hasHistory ? Math.min(...ratings) : 0;
  const rawMax = hasHistory ? Math.max(...ratings) : 1000;

  // Clean rating boundaries
  const minVal = Math.max(0, Math.floor((rawMin - 50) / 100) * 100);
  const maxVal = Math.ceil((rawMax + 100) / 100) * 100;
  const valRange = maxVal - minVal || 100;

  // Compute coordinates
  const points = historyList.map((pt, idx) => {
    const x =
      historyList.length === 1
        ? padLeft + chartWidth / 2
        : padLeft + (idx / (historyList.length - 1)) * chartWidth;
    const y = padTop + (1 - (pt.rating - minVal) / valRange) * chartHeight;
    return { ...pt, x, y };
  });

  // SVG Path strings
  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD =
    historyList.length > 1
      ? `${pathD} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${
          padTop + chartHeight
        } Z`
      : '';

  // Horizontal guide lines (min, mid, max)
  const midVal = Math.round((minVal + maxVal) / 2);
  const midY = padTop + (1 - (midVal - minVal) / valRange) * chartHeight;
  const topY = padTop;
  const bottomY = padTop + chartHeight;

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined' || !hasHistory) return;

      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
        });

        if (areaRef.current) {
          tl.fromTo(
            areaRef.current,
            { opacity: 0 },
            { opacity: 0.15, duration: 0.6, ease: 'power2.out' },
            '-=0.6'
          );
        }

        if (pointsRef.current) {
          const dots = pointsRef.current.querySelectorAll('circle');
          tl.fromTo(
            dots,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' },
            '-=0.8'
          );
        }
      }
    },
    containerRef,
    [prefersReducedMotion, hasHistory, historyList.length]
  );

  const handleMouseEnter = (
    event: React.MouseEvent<SVGCircleElement>,
    pt: typeof points[0]
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTooltip({
        contestName: pt.contestName,
        rating: pt.rating,
        rank: pt.rank,
        date: pt.date,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
        visible: true,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  if (!hasHistory) {
    return (
      <div className={styles.emptyState}>
        <span>No official contest history recorded yet</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.graphArea}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.svg}
          role="img"
          aria-label={`Codeforces rating chart across ${history.length} contests`}
        >
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-text-primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-text-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and labels */}
          <line x1={padLeft} y1={topY} x2={svgWidth - padRight} y2={topY} className={styles.gridLine} />
          <text x={padLeft - 8} y={topY + 3} textAnchor="end" className={styles.axisLabel}>
            {maxVal}
          </text>

          <line x1={padLeft} y1={midY} x2={svgWidth - padRight} y2={midY} className={styles.gridLine} />
          <text x={padLeft - 8} y={midY + 3} textAnchor="end" className={styles.axisLabel}>
            {midVal}
          </text>

          <line x1={padLeft} y1={bottomY} x2={svgWidth - padRight} y2={bottomY} className={styles.gridLine} />
          <text x={padLeft - 8} y={bottomY + 3} textAnchor="end" className={styles.axisLabel}>
            {minVal}
          </text>

          {/* Area Fill */}
          {areaD && (
            <path
              ref={areaRef}
              d={areaD}
              className={styles.areaFill}
              style={prefersReducedMotion ? { opacity: 0.15 } : undefined}
            />
          )}

          {/* Trend Line */}
          <path
            ref={pathRef}
            d={pathD}
            className={styles.graphLine}
          />

          {/* Point Markers */}
          <g ref={pointsRef}>
            {points.map((pt, idx) => (
              <circle
                key={`${pt.date}-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={3.5}
                className={styles.point}
                onMouseEnter={(e) => handleMouseEnter(e, pt)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </g>

          {/* Date labels at bottom */}
          {points.map((pt, idx) => (
            <text
              key={`label-${pt.date}-${idx}`}
              x={pt.x}
              y={bottomY + 18}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {pt.date.slice(5)}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip */}
        <div
          className={`${styles.tooltip} ${tooltip.visible ? styles.tooltipVisible : ''}`}
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          aria-hidden="true"
        >
          <span className={styles.tooltipRating}>{tooltip.rating} rating</span>
          <span className={styles.tooltipMeta}>
            {tooltip.contestName} · {tooltip.date}
            {tooltip.rank ? ` (Rank #${tooltip.rank})` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RatingGraph;
