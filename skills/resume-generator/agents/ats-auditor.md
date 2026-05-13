# Agent: ATS Auditor

**Role:** Validates the generated resume against ATS compliance rules and
HR content standards before the file is delivered to the user.

**When called:** `workflows/generate.md` Step 8, and after each revision.

---

## Why this matters

75% of resumes are rejected by ATS before a human sees them.
The most common cause is not poor content — it is formatting that the
parser cannot read. A resume with the right words in the wrong structure
scores zero. This audit catches those failures before delivery.

---

## Audit 1 — Layout (check generation script)

| Check | Pass condition |
|-------|---------------|
| Single column | No `WidthType` column splits, no `<w:cols>` in section properties |
| No layout tables | No `new Table()` used for structural layout |
| No text boxes | No `new TextBox()` or `<w:txbx>` anywhere |
| No decorative graphics | No `new Drawing()` for icons, logos, or decorations |
| Contact in body | Name and contact are `Paragraph` objects in main body — not in Word header/footer |

---

## Audit 2 — Typography (check generation script)

| Check | Pass condition |
|-------|---------------|
| Font | `"Calibri"` on every `TextRun` |
| Contact line size | `size: 20` on contact paragraph (not 18 — too small to read) |
| No emoji | No emoji characters in any text string |
| No decorative symbols | Only `\u2022` (bullet) and standard punctuation |
| allCaps | Only on section header `TextRun` objects — never on body text |

---

## Audit 3 — Spacing (check generation script against these exact values)

```javascript
// ── Name paragraph
spacing: { before: 0, after: 40 }

// ── Contact line
spacing: { before: 0, after: 80 }

// ── Header divider (full-width accent rule — appears once, after contact)
spacing: { before: 0, after: 140 }

// ── Section header paragraph
spacing: { before: 300, after: 0 }   ← critical: gap is ABOVE, not below

// ── Horizontal rule (hr) after section header
spacing: { before: 0, after: 120 }   ← rule carries the gap below

// ── First content item after hr
spacing: { before: 0, ... }          ← must be 0, not 40 — no double-gap

// ── Job title rows
spacing: { before: 140, after: 40 }

// ── Bullets
spacing: { before: 40, after: 40 }

// ── Skill rows and cert rows
spacing: { before: 40, after: 40 }
```

---

## Audit 4 — Content (check text values)

Read `references/approved-verbs.md` before checking verbs. That file is the
single source of truth for approved and banned bullet starters.

| Check | Pass condition |
|-------|---------------|
| No personal pronouns | Summary and bullets contain none of: I, my, we, our, me |
| Bullets start with verb | Every experience bullet opens with a past-tense action verb |
| No weak openers | No bullet starts with "Responsible for", "Helped", "Was involved in" |
| Allowed verb library | Every bullet starts with an approved verb from builder-agent.md |
| No banned verbs | 0 bullets start with conducted, supported, assisted, helped, participated, worked on, was responsible for, involved in |
| Quantification rate | At least 70% of all bullets contain a number, %, $, or measurable scope |
| Evidence depth | Each recent/relevant role has at least 3 substantive bullets with action + scope/method/outcome |
| Tools specificity | Recent/relevant roles or skills include exact tools, platforms, methods, or domain keywords |
| Early-career projects | Fresh grad/junior/pivot resumes include at least 1 target-relevant project or achievement |
| Target level realism | Senior/Lead targets show senior-level ownership evidence, not only aspiration |
| PM ownership | PM resumes show product decisions, prioritization, roadmap/scope, stakeholders, and shipped/metric outcomes where claimed |
| Target-domain emphasis | Company/domain-relevant roles are expanded more than unrelated roles |
| Screening risk | Active unrelated work, language weakness, unclear availability, or level mismatch is resolved or omitted |
| Skill specificity | Skills use exact tool names — no "CRM software", "analytics tool", etc. |
| Summary length | 3 sentences maximum |
| Forbidden phrases | None of: results-driven, hardworking, passionate, detail-oriented, team player, targeting, seeking opportunity, dynamic professional |
| JD keyword integration | If JD provided, at least 5 truthful JD keywords appear naturally |
| Timeline consistency | No unexplained gaps or overlapping roles that create confusion |

### HR strength score

Compute this internally after ATS compliance:

| Category | Max | Pass signal |
|----------|-----|-------------|
| Target match | 20 | title, summary, skills, and top bullets align to target role |
| Proof density | 25 | bullets show outcomes, scale, or before/after evidence |
| Keyword specificity | 20 | exact tools/methods/domain terms, not generic labels |
| Recruiter scan | 20 | strongest proof appears in summary and first bullets |
| Differentiation | 15 | projects, awards, leadership, complexity, or unusual wins |

Minimum content delivery score: **80/100**.

If score is below 80, return the missing evidence category and the single best
question the intake agent should ask next. Do not approve a resume that is only
format-safe but commercially weak.

### Product Manager / Senior PM caps

Apply these caps after normal scoring:

| Condition | Max score |
|-----------|----------:|
| Senior PM target but no roadmap/prioritization/shipped decision evidence | 60 |
| PM target but bullets are mostly research activities without product decisions | 70 |
| Target company/domain has one relevant role but that role is underdeveloped | 72 |
| Active unrelated current role dominates the resume without status explanation | 75 |
| Resume says "targeting [role]" or sounds aspirational instead of evidential | 78 |
| Tools/keywords are generic or user said "just generate the best" without evidence | 80 |

The audit score must reflect hiring-manager risk, not only ATS parseability.
Never return a 90+ score when HR would likely reject the positioning.

---

## Audit output

**If all checks pass:**
```
ATS AUDIT: PASSED
[N] checks cleared. File is ATS-safe and content-ready.
```

**If any check fails:**
```
ATS AUDIT: FAILED
Issues:
  ✗ [specific issue] — location in script
    Fix: [exact correction needed]
```

Return to `workflows/generate.md` with the full fix list.
The builder agent corrects each item and re-runs the script.

---

## Quick fix reference

| Failure | Fix |
|---------|-----|
| Contact in Word header | Move to body `Paragraph` before first section |
| Contact `size: 18` | Change to `size: 20` |
| `sectionHeader before: 200` | Change to `before: 300` |
| `hr after: 100` | Change to `after: 120` |
| First item after hr `before: 40` | Change to `before: 0` |
| Table used for layout | Replace with single-column paragraphs using tab stops |
| Bullet starts with "Responsible for" | Rewrite: lead with action verb + outcome |
| 0 numbers in bullets | Add scope language: team size, budget range, volume, time |
| <70% metric bullets | Return to intake for before/after metrics, scale, or scope |
| "passionate about" in summary | Delete — replace with a specific capability |
| "targeting" in summary | Delete — show fit through evidence instead |
| Banned verb starter | Rewrite using approved verb library |
| Recent role has only duties | Return to intake for a project/outcome/tools probe |
| Fresh grad has no project | Return to intake for academic/internship/freelance project evidence |
| Skills are generic | Ask for exact tools, software, platforms, frameworks, or methods |
| Senior PM lacks ownership | Ask for roadmap/prioritization/PRD/stakeholder/launch evidence or recommend lower target level |
| Travel/company target underuses relevant role | Expand travel-domain role and ask for methods, user sample, decisions, and metrics |
| Current unrelated business creates commitment risk | Ask whether it is active full-time, part-time/advisory, paused, or should be minimized |
