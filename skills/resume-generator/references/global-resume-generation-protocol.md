# Global Resume Generation Protocol

This protocol applies to every user, role, industry, and seniority level.

---

## Phase 1 — Data collection

Persist intake state incrementally after every completed phase. Store the
merged JSON payload in project storage as `resume-intake-state`, then resume
from the latest completed phase after refresh, timeout, or return visit.

Before writing, collect:

For job targeting:
- target company
- exact role
- seniority level
- job description, if available

For every role:
- people led/coordinated/influenced
- concrete decision changed by the user's contribution
- before/after metric or scale
- owner/co-owner/contributor status
- proudest achievement
- tools/methods used

Do not generate if this evidence is missing unless the user explicitly accepts a
lower-confidence draft.

---

## Phase 2 — Analysis

Before generation, check:

- timeline gaps
- title-target mismatch
- overlapping jobs
- seniority realism
- unresolved red flags

If red flags exist, ask the user how to handle them before generating.

Use deterministic scoring from the saved JSON payload. The LLM explains the
score; it does not calculate the source-of-truth readiness number.

---

## Phase 3 — Generation

Bullet formula:

```text
[Approved verb] + [what the user did] + [how/method] + [result with number/scope]
```

Approved verbs:

- Ownership: led, owned, defined, drove, launched, shipped
- Strategy: prioritized, roadmapped, scoped, aligned, pitched
- Research: uncovered, synthesized, validated, reframed, surfaced
- Impact: improved, reduced, increased, accelerated, scaled
- Execution: coordinated, partnered, delivered, iterated, unblocked

Banned:

- conducted
- supported
- assisted
- helped
- participated
- worked on
- was responsible for
- involved in

Summary:

- max 3 sentences
- sentence 1: identity + years + domain
- sentence 2: strongest quantified proof
- sentence 3: value proposition to target
- no "targeting", "seeking", "passionate", "dynamic", "results-driven"

Job targeting:

- extract JD keywords when available
- include at least 5 truthful JD keywords naturally
- make the most relevant experience the most detailed

---

## Phase 4 — Validation

Block delivery if:

- less than 70% of bullets have number/metric/range/scope
- any banned verb appears as a bullet starter
- summary has template phrases
- JD keywords are missing when JD exists
- timeline has unresolved inconsistency
- validation score is under 80

---

## Phase 5 — Post-generate

After delivery, include:

- confidence score per section
- unanswered questions that could improve the resume
- remaining red flags and mitigation
- cover letter angle specific to target company/role
