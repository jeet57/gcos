
import { cn } from '../lib/utils';

export interface WeeklyProgressBarProps {
  actual: number;
  target: number;
  label?: string;
  unit?: string;
  className?: string;
}

/** Target vs actual bar with a percentage label, e.g. study hours this week. */
export function WeeklyProgressBar({ actual, target, label, unit = '', className }: WeeklyProgressBarProps) {
  const pct = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        {label && <span className="font-medium text-foreground">{label}</span>}
        <span className="text-muted-foreground">
          {actual}
          {unit} / {target}
          {unit} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-teal transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={actual}
          aria-valuemin={0}
          aria-valuemax={target}
        />
      </div>
    </div>
  );
}
