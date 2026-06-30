/**
 * @gcos/ui — shared design system components
 *
 * M05 scope: shadcn/ui primitives (Button, Card, Badge, Input, Dialog,
 * Table, Separator) plus the `cn()` class-merge utility.
 * Pattern components (ReadinessScoreBadge, StreakCounter, etc.) are
 * added in M06 once apps/web has Tailwind wired up.
 */
export const GCOS_UI_PACKAGE_VERSION = '0.0.1';

export { cn } from './lib/utils';

export * from './primitives/button';
export * from './primitives/card';
export * from './primitives/badge';
export * from './primitives/input';
export * from './primitives/dialog';
export * from './primitives/table';
export * from './primitives/separator';

export * from './patterns/readiness-score-badge';
export * from './patterns/streak-counter';
export * from './patterns/weekly-progress-bar';
export * from './patterns/status-badge';
export * from './patterns/metric-card';
