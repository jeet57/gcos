import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

import { cn } from '../lib/utils';
import { Card, CardContent } from '../primitives/card';

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  className?: string;
}

/** Mini stat card with a value and a trend arrow, e.g. dashboard summary tiles. */
export function MetricCard({ label, value, trend, className }: MetricCardProps) {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColorClass =
    trend === undefined || trend === 0
      ? 'text-muted-foreground'
      : trend > 0
        ? 'text-status-completed'
        : 'text-status-blocked';

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-1 p-4">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {trend !== undefined && (
            <span className={cn('flex items-center gap-0.5 text-xs font-medium', trendColorClass)}>
              <TrendIcon className="h-3 w-3" />
              {trend !== 0 && Math.abs(trend)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
