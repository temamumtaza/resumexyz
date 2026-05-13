# UX Audit: Resume Generator
**Focus:** Emotional closeness, user control, clarity, feedback loops

---

## Current State Score

| Dimension | Score | Status |
|-----------|-------|--------|
| **Emotional Closeness** | 65/100 | User feels "interviewed" not "helped" in some phases |
| **Progress Clarity** | 70/100 | Phases defined but user doesn't see where they stand |
| **User Control & Agency** | 60/100 | Agent asks questions; user answers. Feels reactive. |
| **Cognitive Load** | 72/100 | Some sections ask too much at once |
| **Feedback Loop Quality** | 75/100 | Review phase is solid; intake feedback is thin |
| **Language Consistency** | 68/100 | Tone shifts between formal/conversational |
| **Perceived Progress** | 65/100 | No visible progress tracker; user guesses completion |
| **Recovery from Friction** | 55/100 | Upload failure, parsing failure paths not smooth |

**Overall UX closeness: 65/100**

---

## 🔴 Critical Gaps (Make User Feel Distant)

### 1. **No Progress Tracker — User Feels Lost**
**Current state:**
- Workflow goes: intake → generate → review
- User doesn't know: "Are we 20% done? 80%? What's the next milestone?"
- Each agent asks questions without a sense of "we're building toward X"

**Impact:** User feels like they're in an endless interrogation, not a partnership.

**Fix:** Add explicit progress anchors **after each completed sub-phase**:

```text
✓ Phase 1: Target captured (Senior PM at Stripe, growth focus)
⏳ Phase 2: Work experience deep-dive (2 of 4 roles covered)
⭕ Phase 3: Analysis before generation
→ Then: Build resume
```

Show this in:
- After empathy-agent phase completes
- After each data-collector sub-phase (A, B, C)
- After analysis-agent completes
- Before generation starts

---

### 2. **Resume Readiness Gate Feels Punitive**
**Current state (from OFFICIAL_DESIGNER_PROMPT):**
```
"If below 75, ask the single highest-value missing question and do not generate."
```

**User experience:**
- Gets told resume is "not ready" — feels like failure
- Doesn't understand *why* it's not ready in human terms
- "Readiness score 68/100" means nothing to them

**Impact:** Creates shame/frustration, not motivation to improve.

**Fix:** Reframe the readiness check as a partnership moment:

**Current framing:**
> "Your readiness score is 68. We need to hit 75 minimum. Missing: PM shipping evidence."

**Better framing:**
> "Here's where we are: you've given me solid product strategy work, but I
> need one concrete shipped decision to make hiring managers believe you can
> own a roadmap at Senior PM level. Can you walk me through a shipping decision —
> what changed in the product because of your recommendation?"

---

### 3. **Delivery Moment Lacks Celebration**
**Current state (from review.md):**
```
Your resume is ready.

  Name:     [Full Name]
  Target:   [target_role] — [target_industry]
  ...
```

**User experience:**
- Feels clinical, like a document checklist
- No acknowledgment of the work they just did
- No emotional landing

**Impact:** User feels like they've been processed, not supported.

**Fix:** Lead with the human moment first:

```
[Name], your resume is ready.

You gave me the real story: [1-2 sentence specific callback to
their unique positioning]. That's what's going on page one.

Here's what you're shipping with:

  Target:   [role] — [industry]
  Strength: [your specific differentiator]
  Files:    .docx (for ATS) + PDF (for sharing)
  
[then show scores, section confidence, etc]
```

The callback makes it personal. Shows you listened.

---

### 4. **Data Collection Feels Like a Compliance Checklist**
**Current state (data-collector.md Phase B2 & C):**
- Asks about "Tools/methods did you use"
- Asks about "Certifications"
- Asks about "Education"

These feel like form fields, not conversation.

**User experience:**
- Answers feel transactional
- Doesn't understand: "Why does this matter to my resume?"
- Especially strong for juniors/career-changers who feel insecure

**Impact:** User second-guesses their answers; less honest sharing.

**Fix:** Always **contextualize before asking**:

**Current:**
> "What tools, systems, software, or methods did you use in that role?"

**Better:**
> "For the tools piece — exact software names are your ATS match points.
> What systems, platforms, or frameworks did you work with in [role]?"

**Current:**
> "Tell me about your education"

**Better:**
> "Education matters if it's recent or if the degree is a screening gate
> for your target. Walk me through: degree, school, graduation year.
> Any honors or relevant coursework?"

Removes the "why am I even telling you this" feeling.

---

## 🟠 Major Friction Points (Make User Feel Less in Control)

### 5. **Upload Mode Doesn't Explain What Happens Next**
**Current state (intake.md):**
```
For `upload`, parse the uploaded resume first. Summarize what was found,
then ask only for missing/high-value facts.
```

**User experience:**
- Uploads resume → system extracts text silently
- No feedback: "Here's what I read. Is this right?"
- If parsing fails, user gets error but no recovery path

**Impact:** User feels like their resume was "consumed", not "read as input".

**Fix:** Add explicit acknowledgment step after upload parse:

```
I read your uploaded resume. Here's what I found:

  Current title:     [extracted]
  Years of experience: [extracted]
  Key roles:         [extracted]
  Industries:        [extracted]

Is this right? Anything I got wrong or missed?
```

If parsing fails, don't just mark `extractionStatus`. Instead:

```
I tried to extract your resume but hit a snag with [specific issue:
PDF was scanned/image-only, file was corrupted, format unusual].

No problem — just paste the key bits or tell me your current role +
background, and we'll build from there. It'll actually be faster.
```

---

### 6. **Analysis Red Flags Presented as "Warnings", Not "Let's Fix This"**
**Current state (analysis-agent):**
```
If any red flag exists, present it to the user before generation
and ask how to handle it.
```

**User experience:**
- Gets told "Timeline gap 2020-2022: career break?"
- Feels defensive or judged
- "How to handle it" sounds like they have to explain themselves

**Impact:** User feels scrutinized, not supported.

**Fix:** Partner on the red flag:

**Current:**
> "Red flag: Timeline gap 2020-2022. How do you want to address this?"

**Better:**
> "I notice a gap from 2020-2022. Hiring managers will ask about this —
> let's figure out the clearest way to explain it. Was it:
> - Career break / time off
> - Education / upskilling
> - Consulting / freelance work
> - Health / personal reasons (you don't have to share details)
>
> Pick what fits, and I'll shape a brief, honest note for the Summary."

Feels like partnership, not judgment.

---

### 7. **Iterate Loop Doesn't Show What Changed**
**Current state (review.md Step 3):**
```
After each revision:
3. Show change log:
   ```
   Updated:
     • [What changed]
   ```
```

**User experience:**
- Gets new file back
- Change log might say: "Updated Summary bullet"
- But doesn't see **before/after**, so they don't know if you got it right

**Impact:** User has to re-read the whole thing to confirm the fix. Trust erodes.

**Fix:** Show explicit before/after for each change:

```
Here's what I changed:

  ❌ OLD: Defined key metrics and led roadmap activities for platform growth
  ✅ NEW: Owned the activation roadmap (Q2-Q4), increasing 7-day retention 
          from 42% to 58% through onboarding redesign and feature bundling

  ❌ OLD: "Led the Checkout team"
  ✅ NEW: "Led Checkout team (8 engineers), shipped redesign that reduced
          cart abandonment by 34% ($2.3M incremental annual revenue)"
```

User instantly sees: "Yes, that's better. That's me."

---

## 🟡 Minor Gaps (Erode Closeness Over Time)

### 8. **No Skill Context Shown During Intake**
**Current state:**
- User lists skills in Phase C
- No guidance on "What count as skills for [target role]?"

**User experience:**
- Juniors list "Excel, PowerPoint" — feels wrong for PM target
- Domain experts list "Strategic thinking" — feels too vague

**Fix:** Contextualize skills before asking:

```
For Product Manager roles, ATS cares about:
- Core tools: SQL, analytics platforms (Amplitude, MixPanel), Figma
- Methods: A/B testing, SQL, product analytics
- Soft skills are secondary (ATS can't read them)

What tools or methods did you actually use in your roles?
For analytics: did you use SQL, Python, or just Tableau/Mixpanel?
```

---

### 9. **No "Why This Matters" for PM Gate**
**Current state (data-collector.md PM gate):**
```
For each product-relevant role, collect:
- Problem ownership
- Prioritization
- Shipped decision
[etc]
```

**User experience:**
- Feels like extra questions for PM targets
- Doesn't understand: "Why are you asking me about prioritization?"

**Fix:** Explain once:

```
For PM targets, I need evidence beyond strategy/research. Hiring managers
check: Did you actually ship? Did you prioritize? Did metrics move?

Let me dig into those three things so your resume shows ownership,
not just activity.
```

---

### 10. **Wrapping Section Feels Like You're Leaving Them**
**Current state (review.md Step 4):**
```
Before submitting:
  File format: Use .docx for ATS...
  File name: FirstName-LastName...
  LinkedIn: Update your profile...
  Per-application tailoring: Before each submission...

Good luck.
```

**User experience:**
- Reads like homework
- "Good luck" feels distant after a whole conversation
- No sense of "I'm with you through the whole application"

**Fix:** Reframe as launch checklist, not dismissal:

```
You're ready. Before you hit send, one final pass:

📋 Format:
  - Use the .docx for ATS systems (they parse text, not designs)
  - Keep the PDF for your visual reference or screen sharing

📝 File name:
  - FirstName-LastName-Resume.docx
  - Clean name = professionalism signal to recruiters

🔗 Sync your LinkedIn:
  - Match titles, dates, companies exactly
  - Recruiters always cross-check — inconsistencies are instant red flags

🎯 Per-application edge:
  - For each application, skim the job posting's Skills section
  - Add 3-5 exact keywords to your Skills section on the resume
  - This is the single highest-impact thing you can do

---

Questions before you submit? Happy to revise one more time or answer
anything about your positioning.

You've got this.
```

More personal, more actionable, keeps the door open.

---

## Summary: 5 Key Levers for "Lebih Dekat"

1. **Show Progress** — Add visible checkpoints (Phase 1/2/3 complete status)
2. **Celebrate Moments** — Lead deliveries with callback to their unique story
3. **Contextualize Before Asking** — "Here's why this matters" before every question
4. **Partner on Red Flags** — Turn warnings into "let's solve this together"
5. **Show Before/After** — When you revise, prove you got it right

These five move the interaction from **transactional → partnership**.

---

## Implementation Priority

| Fix | Effort | Impact | Do First? |
|-----|--------|--------|-----------|
| Add progress tracker | Small | High | ✅ YES |
| Reframe readiness gate tone | Small | High | ✅ YES |
| Lead delivery with callback | Small | High | ✅ YES |
| Contextualize before asking | Medium | High | ✅ YES |
| Upload → "Here's what I read" | Small | Medium | 2nd |
| Partner on red flags | Small | High | 2nd |
| Show before/after edits | Small | Medium | 2nd |
| Skill context guide | Small | Medium | 3rd |
| Wrapping section reframe | Small | Medium | 3rd |

**Sequence:** Do the "Do First" batch (top 4) in intake.md + review.md first. Then iterate through Phase 2-3 improvements.

