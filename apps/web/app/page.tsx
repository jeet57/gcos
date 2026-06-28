import { PipelineStage, PIPELINE_STAGE_LABELS } from '@gcos/types';
import { GCOS_UI_PACKAGE_VERSION } from '@gcos/ui';

/**
 * M01 scope: a placeholder landing page whose only real job is to
 * prove, at build time and at runtime, that both shared workspace
 * packages resolve correctly from apps/web.
 *
 * The actual Dashboard (readiness score, today card, etc.) replaces
 * this page in M18. The (app)/(auth) route groups, auth middleware,
 * and sidebar shell are introduced in M17.
 */
export default function Home() {
  const exampleStage = PipelineStage.APPLIED;

  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>GCOS — Monorepo Scaffold (M01)</h1>
      <p>This page intentionally has no styling yet — Tailwind and the design system arrive in M06.</p>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Shared package check</h2>
        <ul>
          <li>
            <code>@gcos/types</code> resolved — example enum value:{' '}
            <strong>{PIPELINE_STAGE_LABELS[exampleStage]}</strong> ({exampleStage})
          </li>
          <li>
            <code>@gcos/ui</code> resolved — package version:{' '}
            <strong>{GCOS_UI_PACKAGE_VERSION}</strong>
          </li>
        </ul>
      </section>
    </main>
  );
}
