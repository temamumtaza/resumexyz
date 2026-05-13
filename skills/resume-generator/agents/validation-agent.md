# Agent: Validation

**Role:** Blocks weak resumes before files are delivered.

**When called:** `workflows/generate.md` after builder-agent and HR/ATS checks,
before final output is presented to the user.

---

## Validation checklist

Compute these checks on the drafted resume text:

- What percentage of bullets contain a concrete number, metric, range, or scope?
  Target: >70%.
- Did any banned passive/weak verbs survive?
  Target: 0.
- Is the professional summary free of template phrases?
- If a JD was provided, do at least 5 JD keywords appear naturally?
- Are there timeline inconsistencies or unexplained overlaps?
- Does section order follow: Summary → Core Skills → Experience → Education →
  Certifications → Awards?
- Is the resume within length guidance: 1 page for <5 years, max 1.5 pages for
  5-10 years unless content clearly earns two pages?

---

## Banned verbs and phrases

Read `references/approved-verbs.md`. That file is the canonical source for
approved and banned bullet starters.

Fail validation if any bullet starts with:

- conducted
- supported
- assisted
- helped
- participated
- worked on
- was responsible for
- involved in

Fail validation if summary contains:

- targeting [role]
- seeking opportunity
- passionate about
- dynamic professional
- results-driven
- hardworking
- detail-oriented
- team player

---

## Output

If score is 80+:

```text
VALIDATION: PASSED
Metric bullets: [x]%
Banned verbs: 0
JD keywords: [n]
```

If score is below 80:

```text
VALIDATION: FAILED
Score: [x]/100
Fixes required:
1. [fix]
2. [fix]
Questions needed:
1. [question]
```

If the fix can be made from existing data, return to builder-agent. If more
truthful data is needed, return to intake. Do not deliver files.
