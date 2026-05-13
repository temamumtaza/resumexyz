---
name: resume-modern-minimal
description: Clean, minimal resume template with charcoal-slate accent and understated typography. Ideal for tech, design, and modern professional roles.
triggers:
  - modern resume
  - minimal resume
  - clean resume template
od:
  mode: prototype
  surface: web
  scenario: resume
  category: resume
  featured: 1
  design_system:
    requires: false
  preview:
    type: html
  example_prompt: "Create an ATS-friendly resume using the Modern Minimal template — clean layout, charcoal-slate accent, understated typography. Follow the resume-generator.skill DOCX workflow."
---

# ResumeXYZ Modern Minimal Template

A clean, understated resume template that lets content breathe. Minimal decorative elements, crisp typography, and a charcoal-slate accent keep attention on accomplishments rather than chrome.

Design tokens:
- **Accent color:** Charcoal slate (#374151)
- **Font family:** System UI / Helvetica Neue / Arial (sans-serif)
- **Font size:** 11.5px body, 28px name
- **Section headers:** Small caps, no uppercase forcing, slim bottom rule
- **Column:** Single column, ATS-safe
- **Bullets:** Native list bullets
- **Special:** Thin left border on experience blocks for role emphasis

Section order (strict):
1. Contact header (name, role, location, email, phone, links)
2. Professional Summary
3. Core Skills (grouped by category, pipe-separated)
4. Work Experience (reverse chronological — each role with left accent rule)
5. Education
6. Certifications (if any)
7. Additional (languages, awards, volunteer — if any)

When adapting:
- Generate only `resume.docx` and `resume.pdf` as final deliverables.
- Keep DOCX builder tokens: charcoal-slate accent (#374151), single column, native bullets, no tables, no graphics, no sidebars.
- Use this section order strictly — do not reorder sections without explicit user request.
- Replace all placeholder facts with user-provided facts.
