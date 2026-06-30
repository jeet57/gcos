import { Flame } from 'lucide-react';

import { cn } from '../lib/utils';

export interface StreakCounterProps {
  days: number;
  label?: string;
  className?: string;
}

/** Flame icon + day count badge, used for study/german/application streaks. */
export function StreakCounter({ days, label = 'days', className }: StreakCounterProps) {
  const isActive = days > 0;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium',
        isActive ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-border bg-muted text-muted-foreground',
        className,
      )}
    >
      <Flame className={cn('h-4 w-4', isActive ? 'fill-orange-500 text-orange-500' : 'text-muted-foreground')} />
      <span>
        {days} {label}
      </span>
    </div>
  );
}
