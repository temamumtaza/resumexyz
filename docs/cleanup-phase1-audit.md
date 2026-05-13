# ResumeXYZ Cleanup Phase 1 Audit

Date: 2026-05-13

This audit records the current dependency map before deleting Open Design
surfaces from the ResumeXYZ fork. The goal is to make later cleanup batches
small, reversible, and tied to runtime evidence.

## Current Size Snapshot

The working tree is about 2.0 GB, but most of that is generated or installed
state:

| Path | Size | Notes |
| --- | ---: | --- |
| `node_modules/` | 1.3 GB | Ignored dependency install. |
| `.tmp/` | 223 MB | Ignored dev-server runtime. |
| `.git/` | 214 MB | Repository history/objects. |
| `apps/web/.next/` | 165 MB | Ignored Next build/dev cache. |
| `.od/` | 6.5 MB | Ignored local project/runtime data. |

The source-heavy cleanup targets are much smaller but still noisy:

| Path | Size | Cleanup Status |
| --- | ---: | --- |
| `assets/` | 45 MB | Mostly pets and prompt templates; delete after endpoints/UI are removed. |
| `design-templates/` | 41 MB | Keep only resume templates. |
| `docs/` | 22 MB | Mostly Open Design docs/screenshots; replace with ResumeXYZ docs. |
| `skills/` | 2.9 MB | Keep resume generator plus document helpers if needed. |
| `design-systems/` | 1.9 MB | Replace with one resume style system or remove if not used. |

## Workspace Package Map

### Keep for ResumeXYZ Runtime

- `apps/web`: main ResumeXYZ UI, chat, source picker, file workspace, DOCX/PDF preview.
- `apps/daemon`: local API server, project storage, agent runtime, skills/templates registry.
- `packages/contracts`: shared API types and prompt contracts.
- `packages/platform`: cross-platform process/path helpers used by daemon/tools.
- `packages/sidecar`: sidecar process utilities used by tools/dev and packaged flows.
- `packages/sidecar-proto`: sidecar contract used by daemon/web/desktop/tools.
- `tools/dev`: active local lifecycle command used to run daemon and web.

### Quarantine Before Deletion

- `apps/desktop`: currently small, but `tools-dev` still knows about desktop runtime.
- `apps/packaged`: only needed for distributable desktop builds; can be removed after product direction is web-only.
- `tools/pack`: only needed if packaged app remains.
- `e2e`: old Open Design coverage; keep until a ResumeXYZ smoke suite replaces it.

### Delete Candidates

- `apps/landing-page`: Open Design marketing surface.
- `apps/telemetry-worker`: not part of ResumeXYZ local resume generation.
- `tools/pr`: maintainer PR workflow for upstream Open Design.

## Runtime Resource Roots

`apps/daemon/src/server.ts` still resolves these bundled resource roots:

- `skills/`
- `design-systems/`
- `design-templates/`
- `craft/`
- `assets/frames`
- `assets/community-pets`
- `prompt-templates/`

It also creates runtime user roots under `.od/`:

- `.od/skills`
- `.od/design-systems`
- `.od/design-templates`
- `.od/projects`

Important: deleting a resource directory without removing or narrowing its
route/loader will not necessarily crash, but the UI may still fetch empty or
irrelevant registries. The cleanup should first narrow the daemon registry and
web fetches to ResumeXYZ-specific concepts.

## Active ResumeXYZ Surface

These files are part of the current ResumeXYZ path and should be kept through
the first cleanup passes:

- `skills/resume-generator/**`
- `design-templates/resume-ats-default/**`
- `design-templates/resume-modern-minimal/**`
- `design-templates/resume-executive-bold/**`
- `design-templates/resume-creative-clean/**`
- `packages/contracts/src/api/resume-agentic.ts`
- `packages/contracts/src/api/projects.ts`
- `apps/daemon/src/project-routes.ts`
- `apps/daemon/src/prompts/discovery.ts`
- `apps/daemon/src/prompts/system.ts`
- `apps/daemon/src/prompts/official-system.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/components/NewProjectPanel.tsx`
- `apps/web/src/components/EntryView.tsx`
- `apps/web/src/components/ProjectView.tsx`
- `apps/web/src/components/FileWorkspace.tsx`
- `apps/web/src/components/FileViewer.tsx`
- `apps/web/src/components/QuestionForm.tsx`
- `apps/web/src/providers/registry.ts`
- `apps/web/src/types.ts`
- `apps/web/src/types/mammoth-browser.d.ts`

Current resume-specific runtime signals:

- `resume-generator` and `resume-*` IDs are whitelisted in daemon and web.
- `resume-intake-state` has project routes.
- final deliverables are constrained to `resume.docx` and `resume.pdf`.
- DOCX/PDF preview depends on `docx-preview`, `mammoth`, and `pdfjs-dist`.

## Feature Dependency Findings

### Design Templates

The daemon already filters template catalog entries through
`filterResumeCatalog()`, so the UI sees resume templates only. However, the
repository still carries 100+ non-resume template folders. Those can be deleted
once tests confirm the daemon only needs the resume template directories.

Keep:

- `design-templates/resume-ats-default`
- `design-templates/resume-modern-minimal`
- `design-templates/resume-executive-bold`
- `design-templates/resume-creative-clean`

Delete candidates:

- all `design-templates/html-ppt*`
- `design-templates/web-prototype*`
- `design-templates/live-artifact`
- `design-templates/live-dashboard`
- `design-templates/open-design-landing`
- `design-templates/open-design-landing-deck`
- `design-templates/image-poster`
- `design-templates/video-shortform`
- `design-templates/audio-jingle`
- other non-resume design/product/social/dashboard templates

### Skills

Keep:

- `skills/resume-generator`
- `skills/docx` and `skills/pdf` until the resume generator no longer refers to
  document helper knowledge outside its own folder.

Delete candidates:

- visual generation/media skills (`fal-*`, `venice-*`, `sora`, `remotion`, etc.)
- Figma/design skills
- PPT/deck/artifact skills
- `skills/hatch-pet`
- generic marketing/design templates not used by the resume flow

### Pets

Pet functionality is still present in both daemon and web:

- daemon imports `codex-pets` and `community-pets-sync`
- `/api/codex-pets` routes are registered
- `apps/web/src/components/pet/**` exists
- `SettingsDialog` still references pet settings/tests
- `assets/community-pets` is 12 MB

Safe cleanup order:

1. Remove pet UI entry points from Settings.
2. Remove pet types/config fields or migrate them behind ignored legacy config.
3. Remove web pet components and tests.
4. Remove daemon routes/imports/scripts.
5. Delete `assets/community-pets` and `skills/hatch-pet`.

### Prompt Templates

Prompt templates are still fetched by `App` and served by daemon:

- web: `fetchPromptTemplates()`
- daemon: `/api/prompt-templates`
- assets: `prompt-templates/` and `assets/prompt-templates`

These are image/video oriented and are delete candidates after removing the
Prompt Templates tab/surface from `EntryView` and related registry fetches.

### Design Systems

Design systems are still fetched by web and served by daemon:

- web: `fetchDesignSystems()`
- daemon: `/api/design-systems`
- Settings contains `DesignSystemsSection`
- `NewProjectPanel` still has design-system picker code paths

ResumeXYZ likely needs either:

- no design-system registry at all, or
- exactly one `resume-ats`/`professional` style descriptor.

Do not delete `design-systems/` before removing or replacing these UI and API
paths.

### Live Artifacts / Deploy / Media / Critique

These are still deeply wired:

- `LiveArtifactViewer` in `FileViewer.tsx`
- `fetchLiveArtifacts()` in `ProjectView`/workspace flow
- daemon `registerLiveArtifactRoutes()`
- daemon `registerDeployRoutes()`
- daemon `registerMediaRoutes()`
- critique boot reconciliation in `server.ts`

For ResumeXYZ, these are not part of the core product. They should be removed
after the file workspace is simplified to generated files only:

- resume DOCX/PDF preview
- upload/source files
- optional `review.md`/score JSON if kept

## Proposed Cleanup Batches After Phase 1

### Batch 1: Data Catalog Prune

- Delete non-resume `design-templates/*`.
- Delete visual/media/design `skills/*`, keeping `resume-generator`, `docx`, and `pdf`.
- Delete `assets/community-pets`, `assets/prompt-templates`, and `prompt-templates`.
- Keep `design-systems/` for now unless web/daemon design-system fetches are removed in the same batch.

Validation:

- `pnpm --filter @open-design/web typecheck`
- `pnpm --filter @open-design/daemon typecheck`
- `pnpm exec tools-dev restart web`
- open home, create resume, open generated `resume.pdf`.

### Batch 2: Web Surface Prune

- Remove pet settings/components.
- Remove prompt templates tab.
- Remove design-system management UI.
- Remove live artifact/deploy UI from `FileViewer`.
- Rename remaining UI concepts from project/design/template to resume/output/template where safe.

Validation:

- focused web typecheck
- NewProjectPanel tests
- browser smoke for three source modes

### Batch 3: Daemon Route Prune

- Remove codex-pets routes.
- Remove prompt-template routes.
- Remove media routes.
- Remove deploy routes.
- Remove live-artifact routes and MCP tools if no longer needed.
- Narrow static resource routes to resume skills/templates only.

Validation:

- daemon typecheck and tests
- chat run starts cleanly
- file APIs still work

### Batch 4: Workspace Prune

- Remove `apps/landing-page`.
- Remove `apps/telemetry-worker`.
- Remove `tools/pr`.
- Decide on `apps/desktop`, `apps/packaged`, `tools/pack`, and `e2e`.

Validation:

- update `pnpm-workspace.yaml`
- root `pnpm typecheck`
- `pnpm exec tools-dev restart web`

## Immediate Notes

- `resume-agentic-workflow-audit.zip` is a local archive duplicate of source
  files already committed. It is now ignored and should not be pushed.
- The repo remote is already `https://github.com/temamumtaza/resumexyz.git`.
- Current branch `main` is in sync with `origin/main` before this audit change.
