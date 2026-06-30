import {
  ReadinessScoreBadge,
  StreakCounter,
  WeeklyProgressBar,
  StatusBadge,
  MetricCard,
} from '@gcos/ui';

/**
 * TEMPORARY — M06 visual verification page.
 *
 * Renders every pattern component with the exact prop values from the
 * M06 acceptance criteria so they can be checked visually in the dev
 * server. Delete this route before/at M18 once the real Dashboard page
 * exists (per the Implementation Plan's M06 risk note: "Test in
 * isolation by rendering in a temporary page.tsx before M18").
 */
export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-8">
      <h1 className="text-2xl font-bold">M06 Design System — Visual Check</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">ReadinessScoreBadge</h2>
        <p className="text-sm text-muted-foreground">
          Expected: red @35, amber @55, green @75, dark green @90.
        </p>
        <div className="flex gap-6">
          <ReadinessScoreBadge score={35} trend={-2} />
          <ReadinessScoreBadge score={55} trend={0} />
          <ReadinessScoreBadge score={72} trend={3} />
          <ReadinessScoreBadge score={90} trend={5} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">StreakCounter</h2>
        <div className="flex gap-4">
          <StreakCounter days={12} />
          <StreakCounter days={0} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">WeeklyProgressBar</h2>
        <p className="text-sm text-muted-foreground">Expected: ~37% filled bar.</p>
        <WeeklyProgressBar actual={6.5} target={17.5} label="Study hours" unit="h" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">StatusBadge</h2>
        <div className="flex gap-3">
          <StatusBadge status="not_started" />
          <StatusBadge status="in_progress" />
          <StatusBadge status="completed" />
          <StatusBadge status="blocked" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">MetricCard</h2>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Applications" value={14} trend={3} />
          <MetricCard label="German Streak" value="12d" trend={0} />
          <MetricCard label="Interviews" value={2} trend={-1} />
        </div>
      </section>
    </main>
  );
}
