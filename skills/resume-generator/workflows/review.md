# Workflow: Review

**Purpose:** Deliver the resume, invite feedback, and iterate until done.
**Agent:** `agents/feedback-agent.md`

---

## Step 1 — Deliver

```
present_files([
  "/mnt/user-data/outputs/resume_[slug].docx",
  "/mnt/user-data/outputs/resume_[slug].pdf"
])
```

**Lead with the human moment first:**

```
[Full Name], your resume is ready.

Here's the story I'm putting on page one:

  [1-2 sentence callback to their unique positioning and differentiator —
   this should feel personal and specific to them, not generic]

Your resume positions you as [target_level] for [target_role] roles,
with the strongest evidence in [their biggest advantage: PM shipping,
domain expertise, leadership scope, tool mastery, whatever it is].

---

Here's what you're shipping with:

  Name:     [Full Name]
  Target:   [target_role] — [target_industry]
  Roles:    [count] ([earliest year]–Present)
  Score:    [ATS score] ATS / [HR score] HR positioning
  Format:   ATS-optimized .docx + matching PDF

Section confidence:
  Summary:        [score]/100 — [reason]
  Core Skills:    [score]/100 — [reason]
  Experience:     [score]/100 — [reason]
  Education:      [score]/100 — [reason]
  Certifications: [score]/100 — [reason]
  Awards:         [score]/100 — [reason]

Unanswered questions that could strengthen this:
  1. [question or "None"]

Remaining red flags and mitigation:
  1. [red flag + mitigation or "None"]

Cover letter angle:
  [specific angle for target company/role]

---

Please open it and let me know:
  • Anything factually wrong?
  • Any section that doesn't sound like you?
  • Anything to add, remove, or change?

I can revise as many times as needed.
```

---

## Step 2 — Interpret and act (feedback-agent)

Run `agents/feedback-agent.md` on every response until satisfied.

| Type | Signal | Action |
|------|--------|--------|
| A — Done | "looks great", "perfect", thumbs up | Step 4 |
| B — Small fix | specific text, date, name | Edit only that field, re-deliver |
| C — Section rewrite | "doesn't sound like me", "too generic" | Probe once, rewrite, re-deliver |
| D — Retarget | new role, new company, job posting | Update TARGET, full regenerate |
| E — Factual error | wrong date, wrong company | Fix silently, re-deliver |
| F — HR concern | "not senior enough", "wrong positioning", "role mismatch" | Return to intake for ownership/target-level evidence or retarget |

---

## Step 3 — Iterate

After each revision:
1. Edit the script, re-run, re-validate
2. Re-deliver with `present_files`
3. **Show explicit before/after for each change:**
   ```
   Here's what I updated:

   ❌ OLD: [original bullet/text]
   ✅ NEW: [revised bullet/text]
   
   [Repeat for each substantive change]
   ```

   This helps the user see: "Yes, that's better. That's me."
   Do not just show a generic "Updated: Summary" change log.

---

## Step 4 — Wrap up

```
You're ready to ship.

Before you hit send, one final pass:

📋 Format:
  - Use the .docx for ATS systems (they parse text, not designs)
  - Avoid exporting from Canva, Google Docs, or design tools — ATS can't read images
  - Keep the PDF for your visual reference or screen sharing

📝 File name:
  - FirstName-LastName-Resume.docx
  - Clean name = professionalism signal to recruiters (they see it first)

🔗 Sync your LinkedIn:
  - Match titles, dates, companies exactly
  - Recruiters always cross-check — inconsistencies are instant red flags

🎯 Per-application edge:
  - For each application, skim the job posting's Skills section
  - Add 3-5 exact keywords to your Skills section on the resume
  - This is the single highest-impact thing you can do per application

---

Questions before you submit? I'm happy to revise one more time or
answer anything about your positioning.

You've got this.
```
