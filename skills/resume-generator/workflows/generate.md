# Workflow: Generate

**Purpose:** Build the user's `.docx` resume using the proven template, then export a matching `.pdf` preview.
**Agents:** `agents/builder-agent.md`, `agents/hr-screener.md`, `agents/ats-auditor.md`, `agents/validation-agent.md`
**Tool:** `tools/docx-builder.js`

---

## Step 1 — Read the template tool

Before writing any code, read `tools/docx-builder.js` to load:
- All helper functions (`hr`, `sectionHeader`, `headerDivider`, `jobTitle`,
  `bullet`, `skillRow`, `certRow`, `additionalRow`)
- All shared config (`STYLES`, `NUMBERING`, `PAGE_PROPS`)
- All design tokens (`ACCENT`, `SUBLINE`, `BODY`, `MUTED`, `FONT`, etc.)

These are locked. Do not rewrite or improvise them.

---

## Step 2 — Craft content with builder-agent

Run `agents/builder-agent.md` with the full data from `workflows/intake.md`.

The builder agent delivers:
1. **Recruiter positioning strategy** — target level realism, section order,
   role inclusion/exclusion, and screening risks resolved.
2. **Professional summary** — 3 sentences max, ATS-optimized, TARGET-aligned,
   evidence-based, never aspirational.
3. **Improved bullets** — all raw bullets rewritten per bullet-guide.md rules
   and target-role ownership rules.
4. **Skill groupings** — categorized, TARGET-ordered, exact tool names.
5. **Complete generation script** — ready to run.

If the target seniority is unsupported by evidence, stop generation and ask for
missing evidence or recommend a lower target level. Do not generate a senior or
lead resume from contributor-only evidence.

---

## Step 3 — Section order

Render sections in this sequence:

**Targeted resume with mixed experience:**
1. Name block (centered, size 52, bold, ACCENT color)
2. Contact line (centered, size 20, MUTED — city | email | phone | linkedin)
3. Full-width header divider (`headerDivider()`)
4. Professional Summary
5. Core Competencies
6. Selected Experience (most target-relevant roles first)
7. Additional Experience (only if it supports the target story)
8. Education
9. Certifications (only if provided and relevant)
10. Additional (only if it does not create screening risk)

Use this order for target-company resumes when one role is highly relevant but
not the most recent.

**Standard (3+ years experience):**
1. Name block (centered, size 52, bold, ACCENT color)
2. Contact line (centered, size 20, MUTED — city | email | phone | linkedin)
3. Full-width header divider (`headerDivider()`)
4. Professional Summary
5. Core Competencies
6. Work Experience (reverse chronological)
7. Education
8. Certifications (only if provided)
9. Additional (only if any field is non-null)

**New graduate / <3 years:**
Swap positions 4–6: Summary → Education → Competencies → Experience

---

## Step 4 — Run the script

```bash
# Verify docx package
node -e "require('docx')" 2>/dev/null || npm install -g docx

# Run
node /home/claude/gen_resume_user.js
```

Output: `/mnt/user-data/outputs/resume_[firstname_lastname].docx`

Filename: lowercase, underscores, no spaces.
Example: `resume_budi_santoso.docx`

---

## Step 5 — Validate the file

```bash
python /mnt/skills/public/docx/scripts/office/validate.py \
  /mnt/user-data/outputs/resume_[firstname_lastname].docx
```

Must return `All validations PASSED!`
If it fails: read the error, fix the script, re-run Step 4.

---

## Step 6 — Export PDF copy

Create `/mnt/user-data/outputs/resume_[firstname_lastname].pdf` from the
validated DOCX. Prefer Microsoft Word export when available; otherwise use
LibreOffice headless conversion. Do not generate the PDF from Canva, Figma,
Google Docs, screenshots, HTML canvas, or image paths.

```bash
libreoffice --headless --convert-to pdf --outdir /mnt/user-data/outputs \
  /mnt/user-data/outputs/resume_[firstname_lastname].docx
```

The app previews DOCX via Mammoth and PDF via PDF.js. Until both files exist,
leave the resume preview preload state visible instead of creating sketches or
generic placeholder files.

---

## Step 7 — HR screen

Run `agents/hr-screener.md` on the drafted resume content before final export.

The HR screen must pass:
- target level is credible
- the strongest target-relevant role is expanded
- unrelated active work does not create commitment risk
- PM roles show product ownership, not only research activity
- summary is evidence-based, not aspirational

If HR screen fails, return to intake with the blocking questions. Do not export
or claim a high ResumeXYZ score.

---

## Step 8 — ATS audit

Run `agents/ats-auditor.md` on the generation script.

All 4 audit categories must pass:
- Layout (single column, no tables, no text boxes)
- Typography (Calibri, size 20 contact, no emoji)
- Spacing (exact DXA values from the locked template)
- Content (no pronouns, approved verbs only, 70%+ quantified/scope bullets,
  no weak openers)
- HR positioning (target level realism, ownership, domain relevance, risk caps)

If any check fails: apply the fix list and repeat from Step 4.

---

## Step 9 — Validation gate

Run `agents/validation-agent.md` before delivery.

Validation must pass:
- >70% bullets have number, metric, range, or scope
- 0 banned passive/weak verbs
- summary has no template phrases
- at least 5 JD keywords are used when JD is provided
- no unexplained timeline inconsistency
- final section order is Summary → Core Skills → Experience → Education →
  Certifications → Awards

If score is below 80, do not deliver. Fix from existing data or return to
intake for missing facts.

---

## Step 10 — Proceed

Files are ready. Trigger `workflows/review.md`.
