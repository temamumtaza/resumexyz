# Reference: ATS Rules

Used by `agents/ats-auditor.md` and `agents/builder-agent.md`.

---

## What ATS systems actually do

Applicant Tracking Systems parse your resume into a data record:
name, contact info, job titles, companies, dates, skills, education.
They score it against the job description by keyword matching.
Only resumes above a threshold score reach a recruiter.

The most common failure mode is not poor content — it is formatting that
the parser cannot read. A resume with the right words in a broken layout
scores zero.

---

## What ATS reads correctly

| Element | ATS-safe format |
|---------|----------------|
| Layout | Single-column paragraphs only |
| Font | Calibri, Arial, Times New Roman, Georgia |
| Bullets | Native Word numbering (`LevelFormat.BULLET`) |
| Section headers | Bold ALL CAPS paragraphs — not Word heading styles |
| Contact info | Body paragraphs in the main document body |
| File format | .docx or PDF exported from Microsoft Word only |

---

## What breaks ATS parsing

| Element | Why it fails | Fix |
|---------|-------------|-----|
| Multi-column layout | Content is read out of order or merged | Single column only |
| Text boxes | Content is invisible to most parsers | Move to body paragraphs |
| Word header/footer | Frequently skipped by parsers | Move contact to body |
| Graphics, icons, photos | Unreadable — parsed as blank space | Remove entirely |
| PDF from Canva/Figma/Google Docs | Text encoded as image paths | Export from Word only |
| Non-standard fonts | Rendered as garbled characters | Use standard fonts only |
| Emoji or decorative symbols | Parsed as garbled characters | Remove |

---

## Keyword scoring

ATS matches resume text against job description text. Exact matches score
highest. Synonyms and generic descriptions score low or zero.

| Strategy | ATS impact |
|----------|-----------|
| Mirror the exact job title in the summary | High — title match is heavily weighted |
| Include both acronym and full form: "SEO (Search Engine Optimization)" | High — matches both query forms |
| Use exact tool names: "Google Analytics 4 (GA4)" not "analytics platform" | High — exact string match |
| Tailor the Skills section per job posting | High — highest ROI action per application |
| Vague terms like "CRM software" instead of "Salesforce" | Low — rarely matched |

---

## Spacing tokens — canonical DXA values

These are locked in the template. Any deviation breaks the visual rhythm.

```
Name paragraph:            before: 0,   after: 40
Contact line:              before: 0,   after: 80
Header divider (once):     before: 0,   after: 140
Section header paragraph:  before: 300, after: 0
Horizontal rule (hr):      before: 0,   after: 120
First content after hr:    before: 0    ← must be 0, not 40
Job title rows:            before: 140, after: 40
Bullets:                   before: 40,  after: 40
Skill rows:                before: 40,  after: 40
Certification rows:        before: 40,  after: 40
Additional rows:           before: 0,   after: 40
```

The section header spacing logic explained:
- `before: 300` creates the visual gap between the prior section's last line
  and this header. It is the space ABOVE the header.
- `after: 0` on the header paragraph means the rule carries the gap below.
- `after: 120` on the `hr()` paragraph creates the breathing room between
  the rule and the first content item in the new section.
- The first content item must have `before: 0` — otherwise you get a
  double-gap (120 + 40 = 160, which is visually too much).

---

## Section order by experience level

**3+ years of experience (standard):**
1. Name + Contact
2. Professional Summary
3. Core Competencies
4. Work Experience
5. Education
6. Certifications (if any)
7. Additional (if any)

**New graduate / less than 3 years:**
1. Name + Contact
2. Professional Summary
3. Education ← moved up
4. Core Competencies
5. Work Experience
6. Certifications (if any)
7. Additional (if any)

Rationale: For candidates with limited work history, education is their
strongest credential and should appear where recruiters look first.

---

## Summary ATS scoring

The summary is scanned for title match and keyword density.

| Rule | Reason |
|------|--------|
| Use exact target job title in sentence 1 | Title match is heavily weighted |
| Include at least 2 quantified achievements | Signals accountability, not just activity |
| Include 3–5 keywords from the target job posting | Keyword density scoring |
| Keep to 3 sentences maximum | Longer summaries dilute the keyword signal |
| No personal pronouns (I, my, we) | Some parsers penalize first-person text |
