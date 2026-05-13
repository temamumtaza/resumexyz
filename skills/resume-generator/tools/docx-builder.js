/**
 * tools/docx-builder.js
 * Resume Generator Skill — Core Building Engine
 *
 * This is the PROVEN, VALIDATED template used for MumtazaFire resume products.
 * Do not change layout helpers, spacing values, or color tokens.
 * Only inject user data into the build functions.
 *
 * Usage:
 *   Copy this file to /home/claude/gen_resume_user.js
 *   Replace the DATA INJECTION section with user data
 *   Run: node /home/claude/gen_resume_user.js
 */

const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  LevelFormat, BorderStyle, TabStopType
} = require('docx');
const fs = require('fs');

// ─── Design tokens (LOCKED — do not modify) ──────────────────────────────────
const ACCENT  = "1F4E79";   // deep navy — section headers, skill labels, name
const SUBLINE = "2E75B6";   // mid-blue — horizontal rule dividers
const BODY    = "222222";   // near-black — all body text
const MUTED   = "555555";   // medium gray — dates, company names, contact
const GUIDE   = "999999";   // light gray — template placeholders (blank only)
const FONT    = "Calibri";
const MARGIN  = 1008;               // 0.7 inch in DXA
const CONTENT_W = 12240 - MARGIN * 2; // 10,224 DXA = usable line width

// ─── Shared document config ───────────────────────────────────────────────────

const STYLES = {
  styles: {
    default: { document: { run: { font: FONT, size: 19, color: BODY } } }
  }
};

const NUMBERING = {
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 440, hanging: 280 } } }
      }]
    }]
  }
};

const PAGE_PROPS = {
  size: { width: 12240, height: 15840 },  // US Letter
  margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
};

// ─── Layout helpers (LOCKED — do not modify) ─────────────────────────────────

/**
 * Horizontal rule paragraph.
 * spaceAfter: gap between rule and first content item below (default 120).
 */
function hr(spaceAfter = 120) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: SUBLINE, space: 1 } },
    spacing: { before: 0, after: spaceAfter },
    children: []
  });
}

/**
 * Section header + rule.
 * Gap ABOVE (before:300) = separation from prior section content.
 * Gap BELOW rule (after:120) = breathing room before first content item.
 * FIRST content item after sectionHeader must have before:0 (no double-gap).
 */
function sectionHeader(text) {
  return [
    new Paragraph({
      spacing: { before: 300, after: 0 },
      children: [new TextRun({ text, font: FONT, size: 22, bold: true, color: ACCENT, allCaps: true })]
    }),
    hr(120)
  ];
}

/**
 * Full-width accent divider (used once, after the contact line).
 * Heavier than section hr — marks the end of the header block.
 */
function headerDivider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 1 } },
    spacing: { before: 0, after: 140 },
    children: []
  });
}

/**
 * Job/role title row with right-aligned date.
 * Role is bold BODY; company+location is MUTED; date is italic MUTED.
 */
function jobTitle(role, company, location, dates) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    spacing: { before: 140, after: 40 },
    children: [
      new TextRun({ text: role,                      font: FONT, size: 20, bold: true,   color: BODY  }),
      new TextRun({ text: "  |  ",                   font: FONT, size: 20,               color: MUTED }),
      new TextRun({ text: `${company}, ${location}`, font: FONT, size: 20,               color: MUTED }),
      new TextRun({ text: "\t",                      font: FONT, size: 20               }),
      new TextRun({ text: dates,                     font: FONT, size: 19, italics: true, color: MUTED })
    ]
  });
}

/**
 * Bullet point. All experience bullets use this.
 */
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: FONT, size: 19, color: BODY })]
  });
}

/**
 * Skill row: bold navy label + body text value.
 * Used in Core Competencies section.
 */
function skillRow(label, value) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: label + ": ", font: FONT, size: 19, bold: true,  color: ACCENT }),
      new TextRun({ text: value,        font: FONT, size: 19,               color: BODY   })
    ]
  });
}

/**
 * Certification row with right-aligned date.
 */
function certRow(certName, issuer, date) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: certName,         font: FONT, size: 19,               color: BODY  }),
      new TextRun({ text: "  —  " + issuer, font: FONT, size: 19,               color: MUTED }),
      new TextRun({ text: "\t",             font: FONT, size: 19               }),
      new TextRun({ text: date,             font: FONT, size: 19, italics: true, color: MUTED })
    ]
  });
}

/**
 * Additional section row: bold navy label + body value.
 * Used for Languages, Speaking, Volunteer.
 */
function additionalRow(label, value) {
  return new Paragraph({
    spacing: { before: 0, after: 40 },
    children: [
      new TextRun({ text: label + ": ", font: FONT, size: 19, bold: true,  color: ACCENT }),
      new TextRun({ text: value,        font: FONT, size: 19,               color: BODY   })
    ]
  });
}

// ─── DATA INJECTION ────────────────────────────────────────────────────────────
// Replace everything below this line with user data.
// The helpers above are locked — do not modify them.
//
// TEMPLATE:
//
// const USER = {
//   name: "FULL NAME",                    // all caps for display
//   contact: "City, Country  |  email  |  phone  |  linkedin",
//   summary: "...",
//   skills: [
//     { label: "Technical Skills",   value: "skill1, skill2, ..." },
//     { label: "Tools & Platforms",  value: "tool1, tool2, ..." },
//     { label: "Competencies",       value: "comp1, comp2, ..." },
//   ],
//   experience: [
//     {
//       title: "Job Title", company: "Company", location: "City, Country",
//       dates: "Month Year – Month Year",
//       bullets: ["bullet 1", "bullet 2", "bullet 3"]
//     }
//   ],
//   education: [
//     {
//       degree: "Bachelor of Science in ...",
//       institution: "University Name", location: "City, Country",
//       year: "Month Year", gpa: null,          // set gpa: "3.8 / 4.00" or null
//       coursework: null                         // or array of course names
//     }
//   ],
//   certifications: [                            // set to [] if none
//     { name: "Cert Name", issuer: "Issuer", date: "Month Year" }
//   ],
//   additional: {                                // set fields to null if not applicable
//     languages: "English (Native), Bahasa Indonesia (Native)",
//     speaking: null,
//     volunteer: null
//   }
// };

// ─── BUILD FUNCTION ────────────────────────────────────────────────────────────

function buildResume(USER) {
  const children = [

    // ── NAME ─────────────────────────────────────────────────────────────
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [new TextRun({ text: USER.name, font: FONT, size: 52, bold: true, color: ACCENT })]
    }),

    // ── CONTACT LINE (size 20 — not 18) ──────────────────────────────────
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: USER.contact, font: FONT, size: 20, color: MUTED })]
    }),

    // ── FULL-WIDTH ACCENT DIVIDER ─────────────────────────────────────────
    headerDivider(),

    // ── PROFESSIONAL SUMMARY ─────────────────────────────────────────────
    ...sectionHeader("Professional Summary"),
    new Paragraph({
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: USER.summary, font: FONT, size: 19, color: BODY })]
    }),

    // ── CORE COMPETENCIES ────────────────────────────────────────────────
    ...sectionHeader("Core Competencies"),
    ...USER.skills.map(s => skillRow(s.label, s.value)),

    // ── WORK EXPERIENCE ──────────────────────────────────────────────────
    ...sectionHeader("Work Experience"),
    ...USER.experience.flatMap(role => [
      jobTitle(role.title, role.company, role.location, role.dates),
      ...role.bullets.map(b => bullet(b))
    ]),

    // ── EDUCATION ────────────────────────────────────────────────────────
    ...sectionHeader("Education"),
    ...USER.education.flatMap(edu => {
      const rows = [
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({ text: edu.degree,          font: FONT, size: 20, bold: true,   color: BODY  }),
            new TextRun({ text: "\t"                                                                    }),
            new TextRun({ text: "Graduated: " + edu.year, font: FONT, size: 19, italics: true, color: MUTED })
          ]
        }),
        new Paragraph({
          spacing: { before: 0, after: edu.coursework ? 40 : 0 },
          children: [new TextRun({
            text: `${edu.institution}, ${edu.location}` + (edu.gpa ? `  |  GPA: ${edu.gpa}` : ""),
            font: FONT, size: 19, color: MUTED
          })]
        }),
      ];
      if (edu.coursework && edu.coursework.length) {
        rows.push(new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [
            new TextRun({ text: "Relevant Coursework: ",   font: FONT, size: 19, bold: true, color: BODY }),
            new TextRun({ text: edu.coursework.join(", "), font: FONT, size: 19,              color: BODY })
          ]
        }));
      }
      return rows;
    }),
  ];

  // ── CERTIFICATIONS (only if present) ────────────────────────────────────
  if (USER.certifications && USER.certifications.length > 0) {
    children.push(...sectionHeader("Certifications"));
    USER.certifications.forEach(c => children.push(certRow(c.name, c.issuer, c.date)));
  }

  // ── ADDITIONAL (only if any field is non-null) ───────────────────────────
  const add = USER.additional;
  if (add && (add.languages || add.speaking || add.volunteer)) {
    children.push(...sectionHeader("Additional"));
    if (add.languages) children.push(additionalRow("Languages",  add.languages));
    if (add.speaking)  children.push(additionalRow("Speaking",   add.speaking));
    if (add.volunteer) children.push(additionalRow("Volunteer",  add.volunteer));
  }

  return new Document({
    ...STYLES,
    ...NUMBERING,
    sections: [{ properties: { page: PAGE_PROPS }, children }]
  });
}

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
// The builder agent replaces USER_DATA below with actual user data.

// const USER_DATA = { ... };  // ← injected by builder-agent.md

// Packer.toBuffer(buildResume(USER_DATA)).then(buf => {
//   fs.writeFileSync('/mnt/user-data/outputs/resume_[slug].docx', buf);
//   console.log('Done: resume_[slug].docx');
// }).catch(console.error);

module.exports = { buildResume, hr, sectionHeader, headerDivider,
                   jobTitle, bullet, skillRow, certRow, additionalRow,
                   STYLES, NUMBERING, PAGE_PROPS, ACCENT, SUBLINE, BODY, MUTED, FONT };
