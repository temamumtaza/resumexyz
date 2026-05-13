---
name: resume-ats-default
description: Default ResumeXYZ template pack based on the proven resume-generator.skill DOCX builder. Calibri, deep navy accent, single-column layout, native bullets, and ATS-safe section order.
triggers:
  - resume template
  - ats resume
  - cv template
od:
  mode: prototype
  surface: web
  scenario: resume
  category: resume
  featured: 1
  default_for:
    - prototype
  design_system:
    requires: false
  preview:
    type: html
  example_prompt: "Create an ATS-friendly resume using the default ResumeXYZ DOCX template pack. Start with the guided intake, ask at most 3 questions per turn, use the selected template as the structure reference, then export only resume.docx and resume.pdf."
---

# ResumeXYZ Default Template Pack

This template pack is the default for Resume Templates. It uses the `resume-generator.skill` package as the required workflow and formatting authority:

- `skills/resume-generator/SKILL.md`
- `skills/resume-generator/references/ats-rules.md`
- `skills/resume-generator/tools/docx-builder.js`

Use the examples in `examples/` as template choices for the user. They are previews of the same locked DOCX system, not alternate visual design systems.

When adapting:

- Generate only `resume.docx` and `resume.pdf` as final user-facing outputs.
- Keep the DOCX builder tokens locked: Calibri, deep navy accent, single column, native bullets, no tables, no graphics, no sidebars.
- Use the chosen example to decide section order and emphasis.
- Replace all placeholder facts with user-provided facts.
- Keep unknown facts as bracketed placeholders in drafts only.
- Do not create HTML, Markdown, or score files as final deliverables.

Template choices:

- `ats-default`: standard professional resume for most users.
- `early-career`: education and projects move up for new grads or users with less than 3 years of experience.
- `senior-leader`: impact-heavy structure for senior, lead, manager, or executive profiles.
- `career-pivot`: transferable-skills structure for career transitions.
