'use client';

import { motion } from 'framer-motion';

export function ConsequenceSection() {
  return (
    <section className="section" style={{ background: 'var(--background-secondary)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* 3b — Future Pace: Dream State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--success)',
            margin: '0 0 16px',
          }}>
            Picture what this actually looks like
          </p>

          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--foreground)',
            lineHeight: 1.15,
            margin: '0 0 48px',
          }}>
            You run 1,000 emails.
            <br />
            <span style={{ color: 'var(--success)' }}>You don't analyse the results.</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                when: 'Monday',
                what: "Your outbound agent pulls 50 leads. Not from scratch — from a graph that already knows the companies, the signal history, every prior enrichment pass your agents have made on that domain. It starts from month three of context, not day one.",
              },
              {
                when: 'Tuesday',
                what: "Your reply agent classifies an intent signal — 'this ICP responds to pricing transparency' — and that signal joins a running pattern graph. The next time you touch a company in that segment, the graph already knows what worked.",
              },
              {
                when: 'Wednesday',
                what: "Your Apify actors run overnight. Competitor pricing changed. New job postings at a target account. Instead of disappearing into a JSON file, it writes as a timestamped delta on those entities. Your GTM agent wakes up and already knows.",
              },
              {
                when: 'Thursday',
                what: "Your Polymarket agent enters a market. Before making a call, it queries every prior decision on similar markets: the rationale, the signal sources, the outcome. It inherits collective decision history.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  gap: 24,
                  paddingBottom: i < 3 ? 32 : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline line */}
                {i < 3 && (
                  <div style={{
                    position: 'absolute',
                    left: 11,
                    top: 24,
                    bottom: 0,
                    width: 1,
                    background: 'var(--border)',
                  }} />
                )}
                {/* Dot */}
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1px solid var(--success-dim)',
                  background: 'var(--background-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                  zIndex: 1,
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--success)',
                  }} />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--success)',
                    margin: '0 0 6px',
                    letterSpacing: '0.02em',
                  }}>
                    {item.when}
                  </p>
                  <p style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'var(--foreground-secondary)',
                    margin: 0,
                  }}>
                    {item.what}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dream state pull quote */}
          <div style={{
            marginTop: 48,
            padding: '32px 40px',
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 16,
          }}>
            <p style={{
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--foreground)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              You don't predict the market. Your agents do — because they've already lived through every version of it that ever ran on your graph.
            </p>
            <p style={{
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--success)',
              margin: '16px 0 0',
              lineHeight: 1.6,
            }}>
              That's not automation. That's a system that thinks ahead of you.
            </p>
          </div>
        </motion.div>

        {/* 3c — Consequence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginTop: 80 }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--error)',
            margin: '0 0 16px',
          }}>
            And on the flip side
          </p>

          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--foreground)',
            lineHeight: 1.15,
            margin: '0 0 40px',
          }}>
            Without this, you're the bottleneck.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                when: 'Two weeks from now',
                what: "You're still the one writing follow-up prompts. Every insight lives in your head or a CSV. Your next move needs a prompt from you. You're running the agent — not the other way around.",
                dotColor: '#f59e0b',
              },
              {
                when: 'Two months from now',
                what: "You've enriched 500 leads three times because nothing persisted. Your trading agent has made 200 decisions and none of them informed the next one. Every run starts from the same place you started on day one.",
                dotColor: '#f97316',
              },
              {
                when: 'Two years from now',
                what: "No compounding signal. Your competitor's agent has profiled 10,000 companies and simulated every campaign variant. It found the pattern. You're still paying for intelligence that evaporates.",
                dotColor: 'var(--error)',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  gap: 24,
                  paddingBottom: i < 2 ? 32 : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline line */}
                {i < 2 && (
                  <div style={{
                    position: 'absolute',
                    left: 11,
                    top: 24,
                    bottom: 0,
                    width: 1,
                    background: 'var(--border)',
                  }} />
                )}
                {/* Dot */}
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: 'var(--background-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                  zIndex: 1,
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: item.dotColor,
                  }} />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent-light)',
                    margin: '0 0 6px',
                    letterSpacing: '0.02em',
                  }}>
                    {item.when}
                  </p>
                  <p style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'var(--foreground-secondary)',
                    margin: 0,
                  }}>
                    {item.what}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
