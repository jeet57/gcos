
import { cn } from '../lib/utils';

export type Status = 'not_started' | 'in_progress' | 'completed' | 'blocked';

const STATUS_CONFIG: Record<Status, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  not_started: {
    label: 'Not started',
    dotClass: 'bg-status-not-started',
    textClass: 'text-status-not-started',
    bgClass: 'bg-gray-100',
  },
  in_progress: {
    label: 'In progress',
    dotClass: 'bg-status-in-progress',
    textClass: 'text-status-in-progress',
    bgClass: 'bg-blue-50',
  },
  completed: {
    label: 'Completed',
    dotClass: 'bg-status-completed',
    textClass: 'text-status-completed',
    bgClass: 'bg-green-50',
  },
  blocked: {
    label: 'Blocked',
    dotClass: 'bg-status-blocked',
    textClass: 'text-status-blocked',
    bgClass: 'bg-red-50',
  },
};

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}

/** Pill component for not_started/in_progress/completed/blocked. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.bgClass,
        config.textClass,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}
