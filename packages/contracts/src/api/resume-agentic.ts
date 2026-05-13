export type ResumeIntakePhase =
  | 'source'
  | 'target'
  | 'personal'
  | 'experience'
  | 'projects'
  | 'education'
  | 'analysis'
  | 'ready'
  | 'generated';

export type ResumeOwnershipLevel =
  | 'owner'
  | 'co-owner'
  | 'contributor'
  | 'advisor'
  | 'unknown';

export interface ResumeRoleInterview {
  peopleLedOrCoordinated?: string;
  decisionChanged?: string;
  beforeAfterMetrics?: string[];
  ownershipLevel?: ResumeOwnershipLevel;
  proudestAchievement?: string;
}

export interface ResumeRoleEvidence {
  title?: string;
  company?: string;
  start?: string;
  end?: string;
  tools?: string[];
  bullets?: string[];
  evidenceScore?: number;
  roleInterview?: ResumeRoleInterview;
  pmEvidence?: Record<string, unknown>;
}

export interface ResumeAnalysisState {
  analysisPassed?: boolean;
  timelineGaps?: string[];
  titleTargetMismatch?: string[];
  overlaps?: string[];
  levelRealism?: 'realistic' | 'stretch' | 'unsupported' | '';
  redFlags?: string[];
  mitigationPlan?: string[];
  jdKeywords?: string[];
  missingQuestions?: string[];
}

export interface ResumeIntakeState {
  version: 1;
  phase: ResumeIntakePhase;
  completedPhases: ResumeIntakePhase[];
  updatedAt: number;
  target?: {
    role?: string;
    company?: string;
    industry?: string;
    level?: string;
    jobDescription?: string;
    jdAvailable?: boolean;
  };
  contact?: {
    name?: string;
    location?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  experience?: ResumeRoleEvidence[];
  projects?: Array<Record<string, unknown>>;
  education?: Array<Record<string, unknown>>;
  skills?: Record<string, string[]>;
  certifications?: Array<Record<string, unknown>>;
  analysis?: ResumeAnalysisState;
  screeningRisks?: string[];
  missingForStrongResume?: string[];
  deterministicScore?: ResumeDeterministicScore;
}

export interface ResumeIntakeStateResponse {
  state: ResumeIntakeState | null;
}

export interface UpdateResumeIntakeStateRequest {
  state: Partial<ResumeIntakeState>;
}

export interface ResumeDeterministicScore {
  total: number;
  caps: string[];
  checks: {
    target: number;
    contact: number;
    experience: number;
    ownership: number;
    metrics: number;
    keywords: number;
    risks: number;
    analysis: number;
  };
  missing: string[];
}

export const APPROVED_RESUME_VERBS = {
  ownership: ['led', 'owned', 'defined', 'drove', 'launched', 'shipped'],
  strategy: ['prioritized', 'roadmapped', 'scoped', 'aligned', 'pitched'],
  research: ['uncovered', 'synthesized', 'validated', 'reframed', 'surfaced'],
  impact: ['improved', 'reduced', 'increased', 'accelerated', 'scaled'],
  execution: ['coordinated', 'partnered', 'delivered', 'iterated', 'unblocked'],
} as const;

export const BANNED_RESUME_VERB_STARTERS = [
  'conducted',
  'supported',
  'assisted',
  'helped',
  'participated',
  'worked on',
  'was responsible for',
  'involved in',
] as const;

function present(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' ? value.trim().length > 0 : value != null;
}

function roleInterviewComplete(role: ResumeRoleEvidence): boolean {
  const interview = role.roleInterview;
  if (!interview) return false;
  return (
    present(interview.peopleLedOrCoordinated) &&
    present(interview.decisionChanged) &&
    present(interview.beforeAfterMetrics) &&
    present(interview.ownershipLevel) &&
    interview.ownershipLevel !== 'unknown' &&
    present(interview.proudestAchievement)
  );
}

export function scoreResumeIntakeState(state: Partial<ResumeIntakeState>): ResumeDeterministicScore {
  const missing: string[] = [];
  const caps: string[] = [];
  const roles = Array.isArray(state.experience) ? state.experience : [];
  const relevantRoles = roles.slice(0, Math.min(3, roles.length));
  const checks = {
    target: 0,
    contact: 0,
    experience: 0,
    ownership: 0,
    metrics: 0,
    keywords: 0,
    risks: 0,
    analysis: 0,
  };

  const target = state.target ?? {};
  if (present(target.role)) checks.target += 4;
  else missing.push('target role');
  if (present(target.company) || target.jdAvailable === false) checks.target += 2;
  else missing.push('target company or explicit general target');
  if (present(target.level)) checks.target += 2;
  else missing.push('target seniority level');
  if (present(target.jobDescription) || target.jdAvailable === false) checks.target += 2;
  else missing.push('job description or JD unavailable confirmation');

  const contact = state.contact ?? {};
  for (const field of ['name', 'location', 'email', 'phone'] as const) {
    if (present(contact[field])) checks.contact += 2.5;
    else missing.push(`contact.${field}`);
  }

  if (roles.length === 0) {
    missing.push('at least one experience role');
  } else {
    const passingRoles = roles.filter((role) => {
      const evidence = typeof role.evidenceScore === 'number' ? role.evidenceScore : 0;
      const bullets = Array.isArray(role.bullets) ? role.bullets.length : 0;
      return present(role.title) && present(role.company) && present(role.start) && evidence >= 10 && bullets >= 3;
    }).length;
    checks.experience = Math.round(Math.min(1, passingRoles / Math.max(1, relevantRoles.length)) * 25);
    if (passingRoles < relevantRoles.length) missing.push('evidence score >=10 and 3 bullet-worthy facts for each relevant role');
  }

  const ownershipComplete = relevantRoles.filter(roleInterviewComplete).length;
  checks.ownership = Math.round(Math.min(1, ownershipComplete / Math.max(1, relevantRoles.length)) * 15);
  if (ownershipComplete < relevantRoles.length) missing.push('role ownership interview for each relevant role');

  const allBullets = roles.flatMap((role) => role.bullets ?? []);
  const metricBullets = allBullets.filter((bullet) => /(?:\d|%|\$|idr|usd|million|billion|users?|customers?|team|people|months?|days?)/i.test(bullet)).length;
  const metricRate = allBullets.length > 0 ? metricBullets / allBullets.length : 0;
  checks.metrics = Math.round(Math.min(1, metricRate / 0.7) * 15);
  if (metricRate < 0.7) missing.push('70% quantified or scoped bullets');

  const skillCount = Object.values(state.skills ?? {}).reduce((sum, values) => sum + (Array.isArray(values) ? values.length : 0), 0);
  const jdKeywords = state.analysis?.jdKeywords ?? [];
  if (skillCount >= 5) checks.keywords += 5;
  else missing.push('at least 5 target-relevant skills/tools/keywords');
  if ((target.jdAvailable === false && jdKeywords.length === 0) || jdKeywords.length >= 5) checks.keywords += 5;
  else missing.push('at least 5 mapped JD keywords');

  const riskCount = (state.screeningRisks ?? []).length + (state.analysis?.redFlags ?? []).length;
  checks.risks = riskCount === 0 ? 5 : Math.max(0, 5 - riskCount * 2);
  if (riskCount > 0) missing.push('unresolved screening risks');

  checks.analysis = state.analysis?.analysisPassed ? 10 : 0;
  if (!state.analysis?.analysisPassed) missing.push('analysis gate pass');

  let total = Object.values(checks).reduce((sum, score) => sum + score, 0);

  const level = String(target.level ?? '').toLowerCase();
  if ((level.includes('senior') || level.includes('lead')) && checks.ownership < 12) {
    total = Math.min(total, 60);
    caps.push('senior/lead target without sufficient ownership evidence');
  }
  if (checks.target < 7) {
    total = Math.min(total, 65);
    caps.push('incomplete target definition');
  }
  if (checks.metrics < 12) {
    total = Math.min(total, 80);
    caps.push('insufficient quantified/scope bullet coverage');
  }
  if (riskCount > 0) {
    total = Math.min(total, 75);
    caps.push('unresolved screening risks');
  }

  return { total, caps, checks, missing: Array.from(new Set(missing)) };
}
