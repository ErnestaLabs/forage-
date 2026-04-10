'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    title: 'One config block. Five minutes.',
    lang: 'json',
    code: `// claude_desktop_config.json
{
  "mcpServers": {
    "forage": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-proxy", "https://ernesta-labs--forage.apify.actor/mcp"],
      "env": { "APIFY_API_TOKEN": "YOUR_APIFY_TOKEN" }
    }
  }
}`,
  },
  {
    n: '02',
    title: 'Your agent calls tools. The graph remembers.',
    lang: 'typescript',
    code: `// Pull 100 verified B2B leads at £0.0025 each
const leads = await forage.find_leads({
  job_title: "CTO",
  location: "London",
  industry: "SaaS",
  num_leads: 100
});

// One call. Full company dossier. Stored to graph.
const dossier = await forage.trigger_skill(
  "Company Dossier",
  { domain: "stripe.com" }
);

// Next session: instant recall. No API call. No cost.
const cached = await forage.query_knowledge({
  query: "stripe competitors fintech",
  limit: 10
});
// Returns from graph — your agent already knows this`,
  },
  {
    n: '03',
    title: 'Pay per call. Nothing to cancel.',
    text: "No invoice. No monthly minimum. Credits deplete per call at exact cost. Top up when you need more. Walk away when you do not. There is no contract.",
  },
];

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <div className="code-block" style={{ marginTop: 20 }}>
      <div className="code-block-header">
        <div className="code-block-dots">
          <div className="code-block-dot" style={{ background: '#ff5f57' }} />
          <div className="code-block-dot" style={{ background: '#febc2e' }} />
          <div className="code-block-dot" style={{ background: '#28c840' }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--foreground-muted)',
          marginLeft: 8,
        }}>
          {lang}
        </span>
      </div>
      <div className="code-block-content">
        <pre style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.7,
          color: 'var(--foreground-secondary)',
          whiteSpace: 'pre-wrap',
        }}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section" style={{ position: 'relative' }}>
      {/* Grid pattern */}
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

      <div className="container" style={{ position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 64 }}
        >
          <p className="section-label">Setup</p>
          <h2 className="section-title" style={{ textAlign: 'left', maxWidth: 640 }}>
            Your agent connects once.
            <br />
            Every session after that builds on the last.
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32,
        }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Step number */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--accent)',
                letterSpacing: '0.1em',
                marginBottom: 12,
              }}>
                {step.n}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--foreground)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {step.title}
              </h3>

              {step.code ? (
                <CodeBlock code={step.code} lang={step.lang!} />
              ) : (
                <div className="card" style={{
                  marginTop: 20,
                  padding: 24,
                }}>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: 'var(--foreground-secondary)',
                    margin: '0 0 24px',
                  }}>
                    {step.text}
                  </p>

                  {/* Usage estimates */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Solo builder', value: '~£5/month' },
                      { label: 'Growth team', value: '~£50/month' },
                      { label: 'Agency', value: '~£150/month' },
                    ].map((r) => (
                      <div
                        key={r.label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: 'var(--glass)',
                        }}
                      >
                        <span style={{ fontSize: 13, color: 'var(--foreground-secondary)' }}>
                          {r.label}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--success)',
                        }}>
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
