
import { cn } from '../lib/utils';

/**
 * The most visible component in GCOS — TAD §14.4.
 *
 * SVG ring, fills clockwise via a stroke-dashoffset CSS transition
 * (800ms ease-out). Colour maps to the score.* tokens: red 0-40,
 * amber 41-60, green 61-80, dark green 81-100. Pure CSS + SVG, no
 * animation library, works with no JS if CSS is loaded.
 */
export interface ReadinessScoreBadgeProps {
  /** 0-100 readiness score. */
  score: number;
  /** Delta vs previous recorded score; renders as a small trend indicator. */
  trend?: number;
  size?: number;
  className?: string;
}

function scoreColorClass(score: number): string {
  if (score <= 40) return 'text-score-critical';
  if (score <= 60) return 'text-score-warning';
  if (score <= 80) return 'text-score-good';
  return 'text-score-excellent';
}

export function ReadinessScoreBadge({ score, trend, size = 96, className }: ReadinessScoreBadgeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const colorClass = scoreColorClass(clamped);

  const trendLabel =
    trend === undefined || trend === 0
      ? null
      : trend > 0
        ? `↑+${trend}`
        : `↓${trend}`;
  const trendColorClass =
    trend === undefined || trend === 0
      ? 'text-muted-foreground'
      : trend > 0
        ? 'text-status-completed'
        : 'text-status-blocked';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Readiness score ${clamped} out of 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-800 ease-out', colorClass)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold leading-none', colorClass)}>{clamped}</span>
        {trendLabel && <span className={cn('text-xs font-medium leading-none mt-1', trendColorClass)}>{trendLabel}</span>}
      </div>
    </div>
  );
}
