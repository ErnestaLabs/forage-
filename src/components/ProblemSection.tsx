'use client';

import { motion } from 'framer-motion';

export function ProblemSection() {
  return (
    <section className="section" style={{ background: 'var(--background-secondary)' }}>
      <div className="container" style={{ maxWidth: 800, position: 'relative' }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-light)',
            margin: '0 0 16px',
          }}>
            Here's what's actually happening
          </p>

          {/* Root cause — Logical Certainty stage */}
          <p style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: 'var(--foreground-secondary)',
            margin: '0 0 32px',
          }}>
            You've built something impressive.
          </p>

          <p style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: 'var(--foreground-secondary)',
            margin: '0 0 32px',
          }}>
            You've got Claygent enriching leads, Apify scraping competitors, Instantly managing replies, n8n wiring it all together. Maybe a Polymarket agent making calls on prediction markets. Maybe Cursor shipping features while you sleep.
          </p>

          <p style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: 'var(--foreground-secondary)',
            margin: '0 0 32px',
          }}>
            It works. You know it works.
          </p>

          <p style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: 'var(--foreground-secondary)',
            margin: '0 0 32px',
          }}>
            But here's what you've probably noticed — and maybe haven't said out loud yet.
          </p>
        </motion.div>

        {/* Force yes sequence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            {
              q: 'Every time an agent runs, it starts from the same place it started last time.',
              a: 'The lead it enriched two weeks ago? Gone. The rationale behind that trade? Nowhere. The competitor pricing shift from Tuesday? Lost in a log file nobody reads. The reply intent signal that told you this ICP actually converts? Buried in a CRM field no future agent will ever touch.',
            },
            {
              q: 'Your agents are doing good work. Individual, isolated, non-compounding work.',
              a: 'And every day you run them that way, you are leaving the most valuable thing on the table — the accumulated intelligence those runs should be building.',
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{
                borderLeft: '2px solid var(--accent)',
                paddingLeft: 24,
              }}
            >
              <p style={{
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--foreground)',
                margin: '0 0 12px',
                letterSpacing: '-0.01em',
                lineHeight: 1.4,
              }}>
                {block.q}
              </p>
              <p style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--foreground-secondary)',
                margin: 0,
              }}>
                {block.a}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pull quote — the line that defines the category */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: 64,
            marginBottom: 0,
            padding: '32px 40px',
            background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--cyan-dim) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 16,
          }}
        >
          <p style={{
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--foreground)',
            margin: 0,
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
          }}>
            "The bottleneck isn't that your agents can't think.
            It's that most of their thinking dies where it was created."
          </p>
        </motion.blockquote>

        {/* Force yes — "you like what you built" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginTop: 64 }}
        >
          <p style={{
            fontSize: 24,
            fontWeight: 600,
            color: 'var(--foreground)',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}>
            You like what you've built, right?
          </p>

          <p style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: 'var(--foreground-secondary)',
            margin: '0 0 24px',
          }}>
            Fair. It's fast. It's automated. It handles work that used to take an entire team.
          </p>

          <p style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: 'var(--foreground-secondary)',
            margin: '0 0 24px',
          }}>
            But if you could change one thing — just one — would it be that every run starts fresh? That the lead your agent spent 20 API calls enriching last month has to be re-enriched again today because nothing persisted? That your trading agent has no memory of the market context that led to a winning call six weeks ago?
          </p>

          <p style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: 'var(--foreground-secondary)',
            margin: 0,
          }}>
            Because here's the problem — and it's not the agents, it's not the tools, and it's not the prompts:
          </p>

          <p style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--accent)',
            margin: '24px 0 0',
            letterSpacing: '-0.01em',
          }}>
            Your stack has no shared substrate.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
