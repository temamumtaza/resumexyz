# Workflow: Intake

**Purpose:** Understand the user's target, collect and curate all data.
**Agents:** `agents/empathy-agent.md` → `agents/data-collector.md` → `agents/analysis-agent.md`
**Rule:** Ask naturally, one focused follow-up at a time. Do not proceed to
generation from thin data.

---

## Phase 1 — Target (empathy-agent)

Before Phase 1, identify the source mode:

- `fresh` — no source. Ask the target discovery question normally.
- `upload` — parse the uploaded resume first. **Show acknowledgment before proceeding:**
  ```
  I read your resume. Here's what I found:
  
    Current title(s):     [extracted titles]
    Years of experience:  [estimated range]
    Key industries:       [extracted industries]
    Locations worked:     [extracted locations]
  
  Is this right? Anything I got wrong or missed?
  ```
  Then proceed with empathy-agent, asking only for missing/high-value facts.
  If parsing fails, acknowledge the issue + offer recovery:
  ```
  I tried to extract your resume but hit a snag: [specific issue].
  No problem — just paste the key bits (current role + background) or
  tell me your timeline, and we'll build from there. It'll actually be faster.
  ```
  
- `link` — use extracted LinkedIn/portfolio/GitHub/public page text as
  source material. Reflect back what was found and ask the user to correct it.
  If the page was blocked or thin, ask for pasted profile text or an uploaded
  resume.

For `upload` and `link`, do not ask for facts already present. Still run the
evidence gate: source material can start the resume, but it cannot replace
deep proof of impact.

For pasted LinkedIn text, apply `references/source-ingestion.md`: ignore UI
noise, analytics, repeated sections, and reposted third-party content. Do not
mistake role history pasted into a "job description" field for an actual job
description.

Run `agents/empathy-agent.md`. Capture TARGET:

```json
{
  "target_role": "exact job title",
  "target_company": "specific company if provided",
  "target_industry": "sector",
  "target_level": "associate / mid / senior / lead / unknown",
  "job_description": "pasted JD text or empty",
  "jd_available": true,
  "career_stage": "moving up / lateral / pivot / re-entering / first job",
  "urgency": "actively applying / exploring / just updating",
  "differentiator": "the one thing they want employers to remember"
}
```

Max 3 questions. Move on once TARGET is clear.

**After Phase 1 completes, show progress:**

```
✓ Phase 1 complete: Your target is clear
  [target_role] at [target_company/industry]
  Direction: [career_stage]

⏳ Phase 2 next: Work experience deep-dive
  (4-5 questions total to capture your strongest roles)
```

After Phase 1 completes, persist the partial intake payload to project storage:
`PATCH /api/projects/:id/resume-intake-state`. On resume/reload, load
`GET /api/projects/:id/resume-intake-state` and continue from the latest
completed phase. Never ask the user to repeat stored answers unless they need
correction.

---

## Phase 2 — Data collection (data-collector, 3 phases)

Run `agents/data-collector.md`:

**Phase A** — Personal info (1 message, answers expected)
**Phase B** — Work experience evidence loop
**Phase B2** — Projects/achievements gate for fresh grad, junior, and pivot users
**Phase C** — Education, skills, certifications + smart advice

See `agents/data-collector.md` for exact message templates and curation rules.

After every completed sub-phase (A, B, B2, C), save the merged JSON payload to
`resume-intake-state`. This is an incremental autosave boundary.

**Show progress after each sub-phase:**

After **Phase A** (personal data):
```
✓ Phase 2A complete: Contact info captured
⏳ Phase 2B next: Work experience evidence
```

After **Phase B** (role evidence):
```
✓ Phase 2B complete: [N] roles documented
  [Role 1], [Role 2], [Role 3]...
⏳ Phase 2C next: Education, skills, certifications
```

After **Phase C** (education/skills):
```
✓ Phase 2 complete: All experience and background captured
⏳ Phase 3 next: Final analysis before generation
```

---

## Phase 3 — Analysis layer

Run `agents/analysis-agent.md` before generation. This is mandatory.

The analysis layer checks:
- timeline gaps
- title vs target mismatch
- overlapping jobs
- seniority realism
- red flags that need user confirmation
- JD keyword coverage when a JD is provided

If any red flag exists, present it to the user before generation and ask how to
handle it. Do not hide red flags in the final score.

After analysis completes, persist the analysis result and mitigation plan to
`resume-intake-state`.

---

## Phase 4 — Readiness and quality gate

Verify before proceeding:
- contact: name, location, email, phone
- target role is clear
- target company, role, seniority, and JD availability are captured
- experience: each relevant role has title + company + dates + evidence score ≥10
- every relevant role has answered: people led/coordinated, decision changed,
  before/after metrics, owner vs contributor, proudest achievement
- every recent/relevant role has ≥3 bullet-worthy facts
- tools/methods collected for the roles where they matter
- PM targets pass the product ownership gate: product decision, prioritization,
  shipped change, stakeholder alignment, and metrics where the target level
  requires them
- target-company/domain resumes deeply expand the most relevant domain role
- active unrelated current work is resolved as full-time, part-time/advisory,
  paused, or minimized
- fresh grad, junior, or pivot users have ≥1 strong project/achievement
- skills: ≥1 category with exact tools, methods, or target keywords
- readiness_score ≥75
- analysis_passed=true
- deterministicScore.total ≥75 from `scoreResumeIntakeState`

If anything is missing, do not generate. Reframe readiness as partnership:

**Instead of:**
> "Readiness score is 72. Below 75 minimum. Missing: PM shipping evidence."

**Say:**
> "Here's where we are: Your strategy work is solid, and I can see the
> prioritization skills. But to make hiring managers believe you own a
> roadmap at [target_level], I need one concrete shipped decision.
>
> Walk me through: When you recommended a product change, what changed
> in the product because of you? What was the business impact?
>
> This is the one thing that lifts your resume from 'strong IC' to
> '[target_level]' territory."

Ask the single follow-up that most improves resume strength.
Continue this loop until the gate passes, or until the user explicitly
says to proceed with limited data.

**After analysis passes, show final readiness:**

```
✓ Phase 3 complete: Analysis passed
  Readiness score: [total]/100
  Ready to generate: YES

Your strongest angles:
  • [Specific differentiator from their background]
  • [Domain or tool match to target]
  
Next step: I'll build your resume now.
```

---

## Phase 5 — Confirm and build

Show summary, then proceed immediately:

```
Got everything. Here's what I'm building:

  Name:       [Full Name]
  Target:     [target_role] — [target_industry]
  Experience: [count] roles ([earliest year] – Present)
  Evidence:   [readiness_score]/100 readiness
  Education:  [degree], [institution]
  Skills:     [count] listed
  Strategy:   [target-level decision + role inclusion decision]
  Format:     ATS-optimized DOCX + PDF, Calibri, single-column

Building now...
```

Trigger `workflows/generate.md`.

---

## Output to generate.md

```json
{
  "target": { ... },
  "contact": { "name": "", "slug": "firstname_lastname",
               "location": "", "email": "", "phone": "", "linkedin": "" },
  "experience": [ { "title": "", "company": "", "location": "",
                    "start": "", "end": "", "tools": [],
                    "projects": [], "raw_achievements": [],
                    "bullets": [], "evidence_score": 0 } ],
  "projects": [ { "name": "", "context": "", "problem": "",
                  "method": "", "tools": [], "output": "",
                  "outcome": "", "target_relevance": "" } ],
  "education":  [ { "degree": "", "institution": "", "location": "",
                    "year": "", "gpa": null, "coursework": [],
                    "honors": [], "activities": [], "display_mode": "full" } ],
  "skills": { "technical": [], "tools": [], "competencies": [],
              "soft": [], "methods": [], "industry_keywords": [] },
  "certifications": [ { "name": "", "issuer": "", "date": "" } ],
  "additional": { "languages": [], "awards": [], "speaking": [], "volunteer": [] },
  "readiness_score": 0,
  "deterministicScore": {
    "total": 0,
    "caps": [],
    "checks": {},
    "missing": []
  },
  "analysis": {
    "analysis_passed": false,
    "timeline_gaps": [],
    "title_target_mismatch": [],
    "overlaps": [],
    "level_realism": "",
    "red_flags": [],
    "mitigation_plan": [],
    "jd_keywords": [],
    "missing_questions": []
  },
  "screening_risks": [],
  "missing_for_strong_resume": []
}
```
