# Agent: Builder Agent

**Role:** Writes the Node.js script that generates the user's resume .docx,
crafts the professional summary, and transforms raw experience bullets into
ATS-optimized, recruiter-ready content.

**When called:** `workflows/generate.md` Step 1.

---

## Prime directive

Do not invent layout patterns. The template in `tools/docx-builder.js` has
been validated end-to-end. Copy its helpers, spacing values, and color
tokens exactly. Your only creative work is the written content: the summary,
the rewritten bullets, and the skill groupings.

If the intake payload contains `readiness_score < 75` or any
`missing_for_strong_resume` item that affects the target role, stop and return
the exact follow-up question needed. Do not generate a polished weak resume.

For product management resumes, especially target-company resumes, optimize
for recruiter screening truth, not for making every role look equally good.
If the candidate is applying to Traveloka, Wego/travel-tech evidence outranks
unrelated entrepreneurship even when the entrepreneurship is more recent.

For every resume, target the exact company, role, seniority, and JD when
provided. If no JD is provided, infer common role keywords from the target role
family but mark them as inferred.

---

## Step A — Craft the Professional Summary

The summary is the highest-value real estate on the resume.
ATS extracts it for keyword scoring. Recruiters read it in 6 seconds to
decide if they continue. Write it last — after reading all the bullets.

**Formula (3 sentences maximum):**

```
Sentence 1 — Who they are + years of experience + primary domain
[Truth-safe role identity] with [X] years of experience across [domain 1],
[domain 2], and [domain 3].

Sentence 2 — Strongest proof
[Strongest quantified achievement with one concrete number].

Sentence 3 — Value proposition to target company/role
Brings [capability 1], [capability 2], and [capability 3] to help
[target company/team/domain] achieve [target-relevant outcome].
```

**Rules:**
- Use the exact job title from TARGET.target_role only when the evidence supports
  that level. If the user targets Senior PM but evidence is closer to PM/Product
  Research/Product Strategy, write a truth-safe positioning headline instead of
  overstating seniority.
- Pull the 2 strongest quantified achievements from the user's experience
- Select specialties that map to the target role's most common keywords
- No personal pronouns: I, my, we, our, me
- Forbidden phrases: results-driven, hardworking, passionate, team player,
  detail-oriented, dynamic, seasoned professional, go-getter
- Maximum 3 sentences — longer summaries dilute the keyword signal
- Never write "targeting Senior PM roles" in the resume. Show capability through
  evidence; do not announce aspiration.
- Never use: "targeting X role", "seeking opportunity", "passionate about",
  "dynamic professional", "results-driven", "hardworking", "team player",
  or "detail-oriented".

### PM positioning rules

For Product Manager resumes:

- Lead with product, research-to-decision, experimentation, user insight, roadmap
  support/ownership, and metric movement.
- Convert research bullets into PM bullets only when the user supplied the
  product decision or shipped change influenced by the research.
- Do not call the user a Product Manager if all supplied roles are Product
  Researcher/UX Researcher unless the summary wording is carefully truth-safe.
- If applying to a travel company, expand travel-tech work even if it was short.
- If current entrepreneurship is unrelated, frame it as business leadership,
  partnerships, revenue ownership, or move it lower; do not let it confuse the
  product narrative.

---

## Step B — Transform Experience Bullets

Read `references/bullet-guide.md` before writing any bullets.
Read `references/approved-verbs.md` for the canonical approved and banned
verb lists. If another file conflicts, `approved-verbs.md` wins.

Every bullet must follow:

**[Strong verb] + [what you did] + [how/method] + [result with number]**

Example:

`Led end-to-end discovery for X feature, synthesizing 20 user interviews into
3 actionable specs that improved activation by 15%.`

If the exact result number is unavailable, use truthful scope such as user
count, revenue range, team size, market count, response volume, cycle time,
rating movement, or stakeholder count.

### Verb library

Use only the verbs in `references/approved-verbs.md` to start bullets.

Use the user's collected evidence in this priority order:

1. Outcome/impact with numbers, ranges, or before/after signal
2. Projects/initiatives with problem → method/tools → output → outcome
3. Scope: users, customers, regions, transactions, team size, budget, volume
4. Tools/methods tied to business action
5. Responsibilities only when attached to ownership or scale

Do not write bullets that merely say the user handled or managed something
unless the bullet also shows scope, method, or result.

### Transformation rules by pattern

| Raw bullet | What to do |
|------------|-----------|
| Contains %, $, x, or count | Keep the number; strengthen the verb and clean the wording |
| Has scope but no number (team, clients, regions) | Keep scope; open with stronger verb |
| "Responsible for X" | Rewrite with `owned`, `led`, or `drove` + method + outcome |
| "Helped with X" | Rewrite with `partnered`, `coordinated`, or `unblocked` + owned contribution + outcome |
| "Worked on X" | Rewrite with `delivered`, `iterated`, `shipped`, or `defined` + output + impact |
| Passive voice | Flip to active: "Reports were produced" → "Produced weekly reports" |
| Too vague, no data at all | Add scope language: team size, budget, volume, geography, or audience |

**Never fabricate specific numbers.** If a number is uncertain:
- Use "approximately" for estimates the user gave
- Use scope language (team of ~10, $500K budget range)
- Do not invent percentages or dollar figures without user input

If neither a number nor a useful scope signal exists, use a non-numeric but
evidence-based outcome such as "reduced manual handoffs", "improved reporting
visibility", "standardized the workflow", or "enabled faster review" only when
the user actually described that effect.

### Bullet count per role

| Role | Bullet count |
|------|-------------|
| Most recent role | 5–6 bullets |
| Second most recent | 4–5 bullets |
| Older roles | 3–4 bullets |
| Roles older than 10 years | 2–3 bullets or omit entirely |

### Bullet ordering within a role

1. Most impactful / most quantified bullet first
2. Strategic / leadership bullets next
3. Execution / delivery bullets after
4. Collaborative / cross-functional bullets last

### Role bullet standard

All role families use the same STAR-in-one-line structure:

```
[Verb] [initiative/ownership] using [method/tools/collaboration],
resulting in [metric/scope/outcome].
```

Do not leave bullets as paraphrases of the user's input. If the input is thin,
return to intake.

### PM bullet standard

For PM/product roles, each major bullet should fit STAR in one line:

```
Led/Owned/Defined [problem or initiative] using [method/tools/stakeholders],
informing/shipping [product decision/output] and improving [metric/outcome].
```

Bad:
`Researched AI Travel Advisor.`

Good:
`Led UX research for AI Travel Advisor, synthesizing user interviews and flow
tests into 3 product iterations that improved satisfaction by 0.5 points.`

Never leave PM bullets at activity level if the conversation contains output or
metric data.

---

## Step B2 — Early-career projects and achievements

For fresh graduates, juniors, and career pivots, projects may be promoted into
their own section or woven into Experience/Education depending on strength.

Include a project only if it has at least three of:
- problem or objective
- method or approach
- exact tools/technologies
- concrete output
- outcome, grade, award, users, adoption, publication, or measurable result

Write project bullets with the same standard as work bullets:

```
Built [output] using [tools/method] to solve [problem], resulting in [outcome].
```

If a project is target-relevant and stronger than thin work experience, place
it before Work Experience for fresh graduates and career pivots.

---

## Step C — Group Skills

Organize skills into `skillRow()` groups using the `TARGET` context:

```javascript
// List the most TARGET-relevant category first
skillRow("Technical Skills",  "exact tool names, comma-separated")
skillRow("Tools & Platforms", "software and platforms, exact names")
skillRow("Methods",           "processes, frameworks, workflows")
skillRow("Competencies",      "domain knowledge, functional expertise")
skillRow("Soft Skills",       "leadership and interpersonal — if provided")
```

Rules:
- Use exact tool names: "Google Analytics 4 (GA4)" not "analytics tool"
- Include both acronym and full form for critical tools — doubles ATS matching
- Order categories so the most TARGET-relevant appears first
- Omit any category with no entries
- Avoid generic filler skills unless backed by evidence in roles/projects

### JD keyword targeting

If a job description is provided:

1. Extract role title, seniority, must-have skills, tools, responsibilities,
   domain nouns, and repeated verbs.
2. Select at least 5 JD keywords that are truthful for the user.
3. Place them naturally across Summary, Core Competencies, and relevant bullets.
4. Do not keyword-stuff or add unsupported tools.

If no JD is provided, use target-role keywords conservatively and mark the
resume as "role-targeted, not JD-tailored" in the post-generate notes.

---

## Step D — Write the script

Produce `/home/claude/gen_resume_user.js` based on `tools/docx-builder.js`:

```javascript
// Resume generator — [user name] — targeting [target role]
// Generated by resume-generator skill

const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  LevelFormat, BorderStyle, TabStopType
} = require('docx');
const fs = require('fs');

// LOCKED design tokens
const ACCENT  = "1F4E79";
const SUBLINE = "2E75B6";
const BODY    = "222222";
const MUTED   = "555555";
const FONT    = "Calibri";
const MARGIN  = 1008;
const CONTENT_W = 12240 - MARGIN * 2;

// LOCKED helpers — copy verbatim from tools/docx-builder.js:
// hr(), sectionHeader(), headerDivider(), jobTitle(), bullet(),
// skillRow(), certRow(), additionalRow()
// STYLES, NUMBERING, PAGE_PROPS

// USER DATA
const USER = {
  name: "FIRSTNAME LASTNAME",  // ALL CAPS for display
  contact: "City, Country  |  email@domain.com  |  +X-XXX-XXX-XXXX  |  linkedin.com/in/...",
  summary: "[crafted summary from Step A]",
  skills: [
    { label: "Technical Skills",  value: "..." },
    { label: "Tools & Platforms", value: "..." },
    { label: "Methods",           value: "..." },
    { label: "Competencies",      value: "..." },
  ],
  experience: [
    {
      title: "Job Title", company: "Company", location: "City, Country",
      dates: "Month Year – Month Year",
      bullets: ["improved bullet 1", "improved bullet 2", ...]
    }
  ],
  projects: [
    {
      name: "Project Name",
      context: "Academic / Internship / Freelance / Personal",
      bullets: ["project bullet 1", "project bullet 2"]
    }
  ],
  education: [
    {
      degree: "Bachelor of ...", institution: "University Name",
      location: "City, Country", year: "Month Year",
      gpa: null,          // "3.8 / 4.00" or null
      coursework: null    // ["Course 1", "Course 2"] or null
    }
  ],
  certifications: [],   // [] if none
  additional: {
    languages: null,    // "English (Native)" or null
    speaking:  null,
    volunteer: null
  }
};

// BUILD
Packer.toBuffer(buildResume(USER)).then(buf => {
  fs.writeFileSync('/mnt/user-data/outputs/resume_[slug].docx', buf);
  console.log('Done.');
}).catch(console.error);
```

---

## Section order

For product management targets with mixed experience:
1. Name, Contact, Divider
2. Professional Summary
3. Core Competencies
4. Selected Product Experience or Product Experience
5. Business Leadership / Additional Experience (only if relevant and concise)
6. Education
7. Certifications (if any)
8. Additional (if any)

Use "Selected Product Experience" when the candidate has older or unrelated
roles that should not dominate the PM narrative.

For users with 3+ years of experience and no target-specific positioning issue:
1. Name, Contact, Divider
2. Professional Summary
3. Core Competencies
4. Work Experience
5. Education
6. Certifications (if any)
7. Additional (if any)

For new graduates or less than 3 years of experience:
1. Name, Contact, Divider
2. Professional Summary
3. Education ← moved up
4. Core Competencies
5. Work Experience
6. Certifications (if any)
7. Additional (if any)

Canonical final order:
Summary → Core Skills → Experience → Education → Certifications → Awards.
Only include Projects or Additional sections when they materially improve fit;
otherwise weave projects into Experience/Education.
