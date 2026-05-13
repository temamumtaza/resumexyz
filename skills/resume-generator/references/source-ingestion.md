# Source Ingestion Rules

Use this for pasted LinkedIn text, uploaded resumes, portfolio pages, GitHub
profiles, or any imported source.

---

## LinkedIn cleanup

LinkedIn pasted text contains UI noise. Ignore:

- "Add verification badge", "Enhance profile", "Open to work", "Try Premium"
- profile analytics such as views, search appearances, post impressions
- reposted third-party content unless the user authored it
- reactions, comments, follower counts, connection counts unless directly useful
- repeated duplicate sections

Extract:

- name, location, headline/about
- experience: title, company, dates, location, skills
- education, certifications, awards, volunteering
- authored posts/projects only if they show target-relevant expertise

---

## Source is a starting point, not enough

Never treat imported source text as complete resume evidence. LinkedIn usually
lists roles and skills, but not enough STAR detail.

After extraction, produce an internal source summary:

- verified facts
- inferred facts with low confidence
- missing high-value evidence
- screening risks

Then ask only the next 1-3 questions that improve HR score.

---

## Bad field handling

If the user pastes role history into "job description", do not treat it as a job
description. Reclassify it as source profile text.

If the user writes "just generate the best", do not invent missing evidence.
Use known facts, but ask again when a missing fact blocks target fit.
