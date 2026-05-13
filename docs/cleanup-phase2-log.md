# Cleanup Phase 2 Log

Date: 2026-05-13

Phase 2 removed bundled Open Design resources that are no longer part of the
ResumeXYZ product surface.

## Removed Resource Groups

- Non-resume skills under `skills/`, keeping only:
  - `skills/resume-generator`
  - `skills/docx`
  - `skills/pdf`
- Non-resume design templates under `design-templates/`, keeping only:
  - `resume-ats-default`
  - `resume-creative-clean`
  - `resume-executive-bold`
  - `resume-modern-minimal`
- Pet and old prompt/template asset trees:
  - `assets/community-pets`
  - `assets/prompt-templates`
  - `prompt-templates`
  - `templates/live-artifacts`
  - deck HTML shell templates in `templates/`

## Removed Maintenance Scripts

- `scripts/bake-community-pets.ts`
- `scripts/sync-community-pets.ts`
- `scripts/import-prompt-templates.mjs`
- `scripts/scaffold-html-ppt-skills.mjs`
- `scripts/bake-html-ppt-examples.mjs`
- `scripts/sync-hyperframes-skill.mjs`
- `scripts/seed-curated-design-skills.ts`

## Follow-up Patches

- Root `package.json` no longer exposes pet/design seeding scripts.
- `tools/pack` no longer bundles or hashes deleted `community-pets` and
  `prompt-templates` trees.
- `tools/pack` resource tests now assert resume workflow resources instead of
  deleted prompt/pet bundles.
- Daemon prompt tests no longer read deleted `live-artifact` or `hyperframes`
  design-template files at module load.
- `scripts/guard.ts` allowlists were pruned for deleted scripts and design
  template runtime paths.

## Verification

- `pnpm --filter @open-design/tools-pack typecheck`
- `pnpm --filter @open-design/tools-pack test -- resources`
- `pnpm --filter @open-design/web typecheck`
- `pnpm --filter @open-design/daemon typecheck`
- `pnpm exec tsc -p scripts/tsconfig.json --noEmit`

All commands passed. The only observed warnings were existing Node engine
warnings because the local shell is running Node `v25.3.0` while the repo
declares `~24`.
