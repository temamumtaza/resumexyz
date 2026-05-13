---
name: resume-creative-clean
description: Fresh, modern resume template with teal accent. Structured for product, design, marketing, and tech professionals who want personality without sacrificing ATS safety.
triggers:
  - creative resume
  - modern professional resume
  - product resume
  - design resume
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
  example_prompt: "Create an ATS-friendly resume using the Creative Clean template — teal accent, profile-first structure, skill tags, fresh modern layout. Follow the resume-generator.skill DOCX workflow."
---

# ResumeXYZ Creative Clean Template

A fresh, modern template that balances personality with ATS safety. Teal accent, profile-first header, grouped skill pills, and a selected projects section make this ideal for product managers, designers, marketers, and tech professionals targeting dynamic companies.

Design tokens:
- **Accent color:** Ocean teal (#0d6e83)
- **Font family:** Arial, Helvetica, sans-serif
- **Font size:** 11.5px body, 28px name
- **Section headers:** Teal text with colored dot marker, no heavy rule
- **Column:** Single column, ATS-safe
- **Bullets:** Native list bullets
- **Special:** Top accent bar on header; inline skill tags in Core Skills section; Projects section elevated above Education

Section order (strict):
1. Contact header (name, role, location, email, phone, links) — with top teal accent bar
2. Professional Profile (summary — personal, specific, forward-looking)
3. Core Skills (grouped by category with label: value pairs)
4. Professional Experience (reverse chronological)
5. Selected Projects (technical, product, or portfolio highlights)
6. Education
7. Certifications (if any)

When adapting:
- Generate only `resume.docx` and `resume.pdf` as final deliverables.
- Keep DOCX builder tokens: teal accent (#0d6e83), single column, native bullets, no tables, no graphics, no sidebars.
- Use this section order strictly. Elevate Projects above Education — this is the template's signature.
- The Professional Profile (summary) must feel personal and specific — not generic boilerplate.
- Skills section must be grouped and labeled, not a flat comma list.
