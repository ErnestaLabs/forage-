'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const timeline = [
  {
    when: 'Two days from now',
    what: "You ask the same questions about the same companies. Your agent has no idea you asked last week. You pay again. You wait again.",
    dotColor: '#f59e0b',
  },
  {
    when: 'Two weeks from now',
    what: "You have re-scraped data you already had. Your competitor's agent has added 200 entities to a graph that did not exist a month ago. Yours still has zero.",
    dotColor: '#f97316',
  },
  {
    when: 'Two months from now',
    what: "You are still paying for lookups you have done three times. Still getting fabricated email addresses with high confidence. Your lead process is still manual.",
    dotColor: 'var(--error)',
  },
  {
    when: 'Two years from now',
    what: "No institutional memory. No compounding signal. Your competitor's agent has profiled 10,000 companies. It traces connections across funding, hiring, and market shifts. You are still starting over every morning.",
    dotColor: 'var(--error)',
  },
];

export function ConsequenceSection() {
  return (
    <section className="section" style={{ background: 'var(--background-secondary)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}>
            <Clock size={18} style={{ color: 'var(--error)' }} />
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--error)',
              margin: 0,
            }}>
              What staying the same looks like
            </p>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--foreground)',
            lineHeight: 1.15,
            margin: '0 0 40px',
          }}>
            This is not a productivity problem.
            <br />
            <span style={{ color: 'var(--foreground-secondary)' }}>It is a compounding one. And it gets worse every week you wait.</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  gap: 24,
                  paddingBottom: i < timeline.length - 1 ? 32 : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline line */}
                {i < timeline.length - 1 && (
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
