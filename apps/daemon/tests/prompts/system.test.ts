import { describe, expect, it } from 'vitest';

import { composeSystemPrompt } from '../../src/prompts/system.js';

describe('composeSystemPrompt', () => {
  it('does not add the responsive web contract to deck metadata without platform fields', () => {
    const prompt = composeSystemPrompt({
      metadata: {
        kind: 'deck',
        speakerNotes: true,
      } as any,
    });

    expect(prompt).toContain('- **kind**: deck');
    expect(prompt).not.toContain('**responsive web contract**');
    expect(prompt).not.toContain('**platformTargets**');
  });

  describe('artifact handoff no-emit clauses (#1143)', () => {
    it('drops the absolute "non-negotiable" framing in favor of conditional language', () => {
      const prompt = composeSystemPrompt({});
      expect(prompt).not.toContain('non-negotiable output rule');
    });

    it('includes the "When NOT to emit <artifact>" sub-section', () => {
      const prompt = composeSystemPrompt({});
      expect(prompt).toContain('When NOT to emit `<artifact>`');
    });

    it('forbids wrapping in-place-edit-only turns in an artifact block', () => {
      const prompt = composeSystemPrompt({});
      expect(prompt).toMatch(/in-place|Edit-only|already-existing/i);
      expect(prompt).toMatch(/do not (emit|wrap|send) (a |an )?`?<artifact/i);
    });

    it('forbids putting prose / summaries / paths inside an artifact block', () => {
      const prompt = composeSystemPrompt({});
      expect(prompt).toMatch(/complete `?<!doctype html>`?/i);
      expect(prompt).toMatch(/summar(y|ies)|prose|file path/i);
    });

    it('does not carry unconditional "Emit single <artifact>" / "emit a single <artifact>" lines anywhere in the composed prompt', () => {
      const prompt = composeSystemPrompt({});
      // Discovery layer used to carry hard-rule unconditional emit instructions
      // (plan template step 9, default arc Turn 3+ recap, deck workflow step 7).
      // Those must be conditional now — otherwise the no-emit exception in the
      // base prompt is overridden by the higher-priority discovery layer.
      expect(prompt).not.toMatch(/^- 9\.\s+Emit single <artifact>\s*$/m);
      expect(prompt).not.toMatch(/emit a single `?<artifact>`?\.\s*$/m);
      expect(prompt).not.toMatch(/^7\.\s+Emit single <artifact>\s*$/m);
    });

    it('declares artifact-emission conditionality at the dominant discovery layer', () => {
      const prompt = composeSystemPrompt({});
      // The base prompt's "When NOT to emit" section is at lower precedence than
      // DISCOVERY_AND_PHILOSOPHY, so the exception itself must be stated once at
      // the dominant layer (near RULE 3) — not only back-pointed.
      expect(prompt).toMatch(/only when this turn wrote a new canonical HTML/i);
      expect(prompt).toMatch(/only edited an existing HTML file/i);
    });

    it('also keeps deck-mode prompts free of the unconditional emit line (DECK_FRAMEWORK_DIRECTIVE only stacks for deck projects)', () => {
      // The plain composeSystemPrompt({}) call does NOT include
      // DECK_FRAMEWORK_DIRECTIVE; that directive only stacks when
      // `skillMode === 'deck'` or `metadata.kind === 'deck'`. So if
      // deck-framework.ts:327 ever regresses back to "Emit single <artifact>",
      // a no-args negative assertion is a false negative — exercise the deck
      // path explicitly here.
      const deckPrompt = composeSystemPrompt({ skillMode: 'deck' });
      expect(deckPrompt).not.toMatch(/^7\.\s+Emit single <artifact>\s*$/m);
      expect(deckPrompt).toMatch(/Emit single <artifact> if a new canonical deck HTML/i);
    });
  });

  describe('connectedExternalMcp directive', () => {
    it('omits the directive when no servers are passed', () => {
      const prompt = composeSystemPrompt({});
      expect(prompt).not.toContain('External MCP servers — already authenticated');
      expect(prompt).not.toContain('mcp__<server>__authenticate');
    });

    it('omits the directive when an empty array is passed', () => {
      const prompt = composeSystemPrompt({ connectedExternalMcp: [] });
      expect(prompt).not.toContain('External MCP servers — already authenticated');
    });

    it('lists each connected server and forbids the synthetic auth tools', () => {
      const prompt = composeSystemPrompt({
        connectedExternalMcp: [
          { id: 'higgsfield-openclaw', label: 'Higgsfield (OpenClaw)' },
          { id: 'github' },
        ],
      });

      expect(prompt).toContain('## External MCP servers — already authenticated');
      expect(prompt).toContain('`higgsfield-openclaw`');
      expect(prompt).toContain('Higgsfield (OpenClaw)');
      expect(prompt).toContain('`github`');
      expect(prompt).toContain(
        '**Do NOT call any tool whose name matches `mcp__<server>__authenticate` or `mcp__<server>__complete_authentication`',
      );
      expect(prompt).toContain('localhost:<random>/callback');
      expect(prompt).toContain('Settings → External MCP');
    });

    it('skips entries with blank ids and emits no directive when nothing usable remains', () => {
      const prompt = composeSystemPrompt({
        connectedExternalMcp: [
          { id: '   ', label: 'blank' },
          { id: '', label: 'empty' },
        ] as any,
      });
      expect(prompt).not.toContain('External MCP servers — already authenticated');
    });

    it('does not duplicate the label when it equals the id', () => {
      const prompt = composeSystemPrompt({
        connectedExternalMcp: [{ id: 'github', label: 'github' }],
      });
      expect(prompt).toContain('- `github`\n');
      expect(prompt).not.toContain('- `github` (github)');
    });
  });

  // The daemon experiment for compiling a brand's design system from prose
  // (DESIGN.md) into a machine-readable contract (tokens.css) plus a worked
  // fixture (components.html) lives in PR-C. The composer exposes two new
  // optional inputs (`designSystemTokensCss`, `designSystemFixtureHtml`)
  // that the daemon populates only when `OD_DESIGN_TOKEN_CHANNEL=1` is set
  // AND the active brand actually ships those files. These tests pin the
  // injection shape so the prompt structure cannot drift silently.
  describe('design-system token + fixture injection (#PR-C)', () => {
    const sampleTokensCss = ':root {\n  --bg: #ffffff;\n  --fg: #111111;\n  --accent: #0050d8;\n}';
    const sampleFixtureHtml = '<!doctype html>\n<html lang="en">\n  <body><button class="btn btn-primary">Subscribe</button></body>\n</html>';

    it('appends BOTH a tokens block and a fixture block when both inputs are present', () => {
      const prompt = composeSystemPrompt({
        designSystemTitle: 'default',
        designSystemBody: '# Neutral Modern\n\n> Category: Utility\n\nProse description.',
        designSystemTokensCss: sampleTokensCss,
        designSystemFixtureHtml: sampleFixtureHtml,
      });

      expect(prompt).toContain('## Active design system tokens — default');
      expect(prompt).toContain('Paste the unscoped `:root { ... }` block verbatim');
      expect(prompt).toContain('--accent: #0050d8;');

      expect(prompt).toContain('## Reference fixture — default');
      expect(prompt).toContain('Match its component shapes');
      expect(prompt).toContain('class="btn btn-primary"');
    });

    it('keeps the prompt byte-equivalent to the legacy path when both inputs are omitted', () => {
      const baseline = composeSystemPrompt({
        designSystemTitle: 'default',
        designSystemBody: '# Neutral Modern\n\nProse only.',
      });
      const withFlagOffEquivalent = composeSystemPrompt({
        designSystemTitle: 'default',
        designSystemBody: '# Neutral Modern\n\nProse only.',
        designSystemTokensCss: undefined,
        designSystemFixtureHtml: undefined,
      });

      expect(withFlagOffEquivalent).toBe(baseline);
      expect(withFlagOffEquivalent).not.toContain('## Active design system tokens');
      expect(withFlagOffEquivalent).not.toContain('## Reference fixture');
    });

    it('gates the tokens and fixture blocks independently — either may be absent', () => {
      const tokensOnly = composeSystemPrompt({
        designSystemTitle: 'default',
        designSystemBody: '# x\n\nbody',
        designSystemTokensCss: sampleTokensCss,
      });
      expect(tokensOnly).toContain('## Active design system tokens — default');
      expect(tokensOnly).not.toContain('## Reference fixture');

      const fixtureOnly = composeSystemPrompt({
        designSystemTitle: 'default',
        designSystemBody: '# x\n\nbody',
        designSystemFixtureHtml: sampleFixtureHtml,
      });
      expect(fixtureOnly).not.toContain('## Active design system tokens');
      expect(fixtureOnly).toContain('## Reference fixture — default');
    });

    it('places the tokens + fixture blocks AFTER the DESIGN.md prose block (prose sets voice, structured form binds names)', () => {
      const prompt = composeSystemPrompt({
        designSystemTitle: 'default',
        designSystemBody: 'PROSE_BODY_MARKER',
        designSystemTokensCss: sampleTokensCss,
        designSystemFixtureHtml: sampleFixtureHtml,
      });
      const proseAt = prompt.indexOf('PROSE_BODY_MARKER');
      const tokensAt = prompt.indexOf('## Active design system tokens');
      const fixtureAt = prompt.indexOf('## Reference fixture');
      expect(proseAt).toBeGreaterThan(0);
      expect(tokensAt).toBeGreaterThan(proseAt);
      expect(fixtureAt).toBeGreaterThan(tokensAt);
    });

    it('treats whitespace-only inputs as absent (defensive, matches DESIGN.md block behavior)', () => {
      const prompt = composeSystemPrompt({
        designSystemTitle: 'default',
        designSystemBody: '# x\n\nbody',
        designSystemTokensCss: '   \n  \t  ',
        designSystemFixtureHtml: '\n\n',
      });
      expect(prompt).not.toContain('## Active design system tokens');
      expect(prompt).not.toContain('## Reference fixture');
    });
  });
});
