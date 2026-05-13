---
name: resume-generator
description: >
  Builds a complete, ATS-optimized resume as .docx and .pdf files for a real user.
  Use this skill whenever someone wants help creating or writing their own
  resume, CV, or job application document — even if they just say "make me
  a resume", "help me update my CV", "I need to apply for a job", or "write
  my resume for [role/company]". This skill runs a guided multi-question
  interview to collect the user's data, empathizes with their job target,
  then generates and delivers polished .docx and .pdf files using a proven ATS-compliant
  template. Always use this skill for any personal resume creation task.
---

# Resume Generator

Builds a real user's resume through a guided conversation, then generates
a production-ready `.docx` and matching `.pdf` using the proven ATS-compliant template.

## What this skill produces

Two files:

- `resume_[firstname_lastname].docx` — source of truth for ATS submission.
- `resume_[firstname_lastname].pdf` — visual preview/share copy exported from the same content.

Built with Calibri, deep navy accent, single-column layout, no tables or
graphics — ATS-safe from every angle. The same template validated for
MumtazaFire resume products.

Until both final files exist, the app should show a resume preview preload
state rather than creating sketches, empty design placeholders, or generic
"creations will appear here" copy.

---

## Core principle

A resume has two audiences: a machine (ATS) and a human (recruiter).
It must pass the machine in seconds of parsing, then earn the recruiter's
attention in the first 6-second scan. This skill is designed to clear
both gates: the right structure for the system, the right words for
the person reading it.

Never rush thin source material into a final file. The agent should keep
collecting until the user's roles, projects, tools, achievements, and outcomes
contain enough evidence to build a high-scoring resume.

---

## WAT Architecture

```
Workflow          Agents                        Tools
─────────         ──────────────────────────    ─────────────────────────
intake.md    ──►  source-ingestion-agent.md      URL/file source parsing
                  empathy-agent.md              (conversation only)
                  data-collector.md
                  analysis-agent.md
                         │
generate.md  ──►  builder-agent.md        ──►   docx-builder.js
                  hr-screener.md
                  ats-auditor.md
                  validation-agent.md           validate.sh
                         │
review.md    ──►  feedback-agent.md             present_files
```

---

## Execution order

1. **`workflows/intake.md`** — Understand the target, collect all data
2. **`workflows/generate.md`** — Build the .docx from collected data
3. **`workflows/review.md`** — Deliver, collect feedback, iterate until done

Start with `workflows/intake.md`. Do not skip phases.

Before generation or audit, use the package references as the source of truth:

- `references/ats-rules.md` for locked ATS, spacing, section-order, and scoring rules.
- `references/global-resume-generation-protocol.md` for universal intake, analysis, generation, validation, and post-generate rules.
- `references/approved-verbs.md` for the canonical verb library used by builder, auditor, and validator.
- `references/bullet-guide.md` for bullet rewriting.
- `references/resume-quality-gate.md` for intake depth, evidence scoring, and follow-up probes.
- `references/product-manager-hr-gate.md` for PM/Senior PM/target-company screening rules.
- `references/source-ingestion.md` for LinkedIn/resume/profile import cleanup and recovery.
- `tools/docx-builder.js` for the required DOCX template implementation.
- `tools/validate.sh` for post-generation validation when available.
