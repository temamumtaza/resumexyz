---
name: resume-executive-bold
description: Bold, impact-forward resume template with forest green accent. Strong visual hierarchy for senior, lead, manager, and executive profiles.
triggers:
  - executive resume
  - senior resume
  - leadership resume
  - manager resume
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
  example_prompt: "Create an ATS-friendly resume using the Executive Bold template — forest green accent, strong typographic hierarchy, impact-first structure. Follow the resume-generator.skill DOCX workflow."
---

# ResumeXYZ Executive Bold Template

A high-impact template built for senior and leadership profiles. Bold typographic hierarchy, forest green accent, and an impact-first section order push the strongest achievements to the top where hiring managers and executive recruiters look first.

Design tokens:
- **Accent color:** Forest green (#1a5e3c)
- **Font family:** Georgia, serif (name + section headers); Arial, sans-serif (body)
- **Font size:** 11.5px body, 30px name
- **Section headers:** Bold, forest green text with strong bottom rule
- **Column:** Single column, ATS-safe
- **Bullets:** Native list bullets, impact verb emphasized
- **Special:** Executive summary block with left accent bar; impact-first bullet ordering

Section order (strict — impact-first):
1. Contact header (name, role, location, email, phone, links)
2. Executive Summary (3 sentences: identity + strongest proof + value proposition)
3. Core Leadership Competencies (grouped skills, leadership tools)
4. Career Impact (top 3 quantified wins from entire career — pre-experience)
5. Professional Experience (reverse chronological — expanded on most senior/relevant role)
6. Education
7. Certifications & Executive Education (if any)
8. Board, Advisory, or Speaking (if any)

When adapting:
- Generate only `resume.docx` and `resume.pdf` as final deliverables.
- Keep DOCX builder tokens: forest green accent (#1a5e3c), single column, native bullets, no tables, no graphics, no sidebars.
- Use this section order strictly. The Career Impact section is unique to this template — always populate it.
- Do not use weak verbs. Every bullet must start with an ownership-class or impact-class verb.
- Require roadmap, P&L, team size, or business scope evidence for senior/executive targets.
