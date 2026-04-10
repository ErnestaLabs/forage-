'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

const stats = [
  { value: 500, suffix: '+', label: 'Agents using Forage' },
  { display: '£0.0025', label: 'Per lead — 95% cheaper' },
  { value: 3000, suffix: '+', label: 'Live web data sources' },
  { display: '~1M', label: 'Entities in knowledge graph' },
];

const testimonials = [
  {
    quote: 'I asked my agent about a prospect. It already knew them from a call three weeks ago. The graph had competitors, tech stack, hiring signals — all there. That\'s not a search tool.',
    name: 'Beta Tester',
    company: 'Sales Lead · London',
    avatar: 'B',
  },
  {
    quote: 'The knowledge graph answered a question about the Berlin fintech scene that would have taken me 50 scrapes to compile. My agent remembered every company we\'d ever touched.',
    name: 'Beta Tester',
    company: 'AI Engineer · Berlin',
    avatar: 'B',
  },
  {
    quote: 'My agent stopped hallucinating the moment I connected Forage. Real data, sourced live, stored permanently. It knows what it doesn\'t know now.',
    name: 'Beta Tester',
    company: 'Growth Lead · Amsterdam',
    avatar: 'B',
  },
];

function CountUp({ end, duration = 1400 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const frame = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * end));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function SocialProofSection() {
  return (
    <section className="section" style={{ position: 'relative' }}>
      {/* Grid pattern */}
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

      <div className="container" style={{ position: 'relative' }}>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1,
            background: 'var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 80,
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                padding: 32,
                background: 'var(--background-secondary)',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: 'clamp(32px, 5vw, 44px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, var(--foreground) 0%, var(--foreground-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 8,
              }}>
                {stat.display ? stat.display : (
                  <><CountUp end={stat.value!} />{stat.suffix}</>
                )}
              </div>
              <div style={{
                fontSize: 13,
                color: 'var(--foreground-tertiary)',
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          marginBottom: 64,
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card"
              style={{ padding: 32, display: 'flex', flexDirection: 'column' }}
            >
              {/* Quote icon */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--accent-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Quote size={18} style={{ color: 'var(--accent)' }} />
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--foreground)',
                margin: '0 0 24px',
                flexGrow: 1,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'white',
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--foreground)',
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--foreground-tertiary)',
                  }}>
                    {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--foreground-muted)',
            marginBottom: 24,
          }}>
            Integrates with
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px 48px',
          }}>
            {[
              { name: 'Apify', sub: 'Built on' },
              { name: 'n8n', sub: 'Official node' },
              { name: 'Claude', sub: 'MCP native' },
              { name: 'GPT-4', sub: 'Function calls' },
              { name: 'Cursor', sub: 'MCP native' },
            ].map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{
                  fontSize: 10,
                  color: 'var(--foreground-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {l.sub}
                </span>
                <span style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'var(--foreground-tertiary)',
                  letterSpacing: '-0.02em',
                }}>
                  {l.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
