import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './Heatmap.module.css';

export interface HeatmapDay {
  date: string;
  count: number;
  level?: 0 | 1 | 2 | 3 | 4;
}

interface HeatmapProps {
  days: HeatmapDay[];
  ariaLabel: string;
  unitLabel?: string;
}

const CELL_SIZE = 11;
const CELL_GAP = 3;
const WEEKS = 53;
const DAYS_PER_WEEK = 7;

export function Heatmap({ days, ariaLabel, unitLabel }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; visible: boolean }>({
    text: '',
    x: 0,
    y: 0,
    visible: false,
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Map dates to easy lookup: { 'YYYY-MM-DD': { count, level } }
  const dayLookup = new Map<string, HeatmapDay>();
  days.forEach((d) => dayLookup.set(d.date, d));

  // Determine levels based on counts if level not explicitly supplied
  const getLevel = (count: number, explicitLevel?: number): 0 | 1 | 2 | 3 | 4 => {
    if (explicitLevel !== undefined && explicitLevel >= 0 && explicitLevel <= 4) {
      return explicitLevel as 0 | 1 | 2 | 3 | 4;
    }
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 8) return 3;
    return 4;
  };

  // Generate 53 columns x 7 rows aligned to the latest dataset date
  const gridCells: Array<{
    week: number;
    day: number;
    x: number;
    y: number;
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }> = [];

  const lastEntry = days.length > 0 ? new Date(days[days.length - 1].date + 'T00:00:00') : new Date();
  const endDate = isNaN(lastEntry.getTime()) ? new Date() : lastEntry;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (WEEKS * 7 - 1));

  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + (w * 7 + d));
      const isoDate = cellDate.toISOString().slice(0, 10);
      const entry = dayLookup.get(isoDate);
      const count = entry ? entry.count : 0;
      const level = getLevel(count, entry?.level);

      gridCells.push({
        week: w,
        day: d,
        x: w * (CELL_SIZE + CELL_GAP),
        y: d * (CELL_SIZE + CELL_GAP),
        date: isoDate,
        count,
        level,
      });
    }
  }

  const svgWidth = WEEKS * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const svgHeight = DAYS_PER_WEEK * (CELL_SIZE + CELL_GAP) - CELL_GAP;

  useScrollTrigger(
    () => {
      if (prefersReducedMotion || typeof window === 'undefined') return;

      if (svgRef.current) {
        const columns = svgRef.current.querySelectorAll('.heatmap-col');
        gsap.fromTo(
          columns,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.015,
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
    [prefersReducedMotion, days.length]
  );

  const formatTooltipText = (cell: typeof gridCells[0]) => {
    const unit = unitLabel || 'problem';
    const dateObj = new Date(cell.date + 'T00:00:00');
    const dateStr = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : cell.date;

    if (cell.count === 0) {
      return `No ${unit}s on ${dateStr}`;
    }
    const unitWord = cell.count === 1 ? unit : `${unit}s`;
    return `${cell.count} ${unitWord} on ${dateStr}`;
  };

  const handleMouseEnter = (event: React.MouseEvent<SVGRectElement>, cell: typeof gridCells[0]) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTooltip({
        text: formatTooltipText(cell),
        x: rect.left - containerRect.left + CELL_SIZE / 2,
        y: rect.top - containerRect.top - 8,
        visible: true,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.scrollArea}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.svg}
          role="img"
          aria-label={ariaLabel}
        >
          {Array.from({ length: WEEKS }).map((_, w) => {
            const weekCells = gridCells.filter((c) => c.week === w);
            return (
              <g
                key={w}
                className="heatmap-col"
                style={prefersReducedMotion ? { opacity: 1 } : undefined}
              >
                {weekCells.map((cell) => (
                  <rect
                    key={`${cell.week}-${cell.day}`}
                    x={cell.x}
                    y={cell.y}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={2}
                    ry={2}
                    className={`${styles.dayCell} ${styles[`level${cell.level}`]}`}
                    onMouseEnter={(e) => handleMouseEnter(e, cell)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Tooltip */}
      <div
        className={`${styles.tooltip} ${tooltip.visible ? styles.tooltipVisible : ''}`}
        style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        aria-hidden="true"
      >
        {tooltip.text}
      </div>

      {/* Legend */}
      <div className={styles.legendRow} aria-hidden="true">
        <span>Less</span>
        <div className={styles.legendCells}>
          <span className={`${styles.legendCell} ${styles.level0}`} />
          <span className={`${styles.legendCell} ${styles.level1}`} />
          <span className={`${styles.legendCell} ${styles.level2}`} />
          <span className={`${styles.legendCell} ${styles.level3}`} />
          <span className={`${styles.legendCell} ${styles.level4}`} />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export default Heatmap;
