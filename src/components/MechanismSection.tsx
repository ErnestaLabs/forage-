'use client';

import { motion } from 'framer-motion';
import { Network, Brain, Plug } from 'lucide-react';

const pillars = [
  {
    icon: Network,
    title: 'Every agent writes to the same graph. Every future agent reads from it.',
    description: 'Forage maintains a persistent, typed entity graph — companies, contacts, markets, competitors, decisions — that any agent in your stack can read from and write to via API. When your Claygent enriches a company, it goes to the graph. When your Apify actor detects a pricing change, it writes a timestamped delta. When your reply agent classifies an intent signal, it joins the pattern graph for that ICP segment. The next agent starts where the last one left off.',
    highlight: 'Shared entity graph',
    buyIn: 'Do you feel like that would actually change how your stack operates?',
  },
  {
    icon: Brain,
    title: 'Not what happened. Why it happened. What came next.',
    description: 'Most agent stacks store outputs. Forage stores decisions. Every time an agent makes a call — a trade executed, a sequence triggered, a prospect qualified — Forage logs the decision, the rationale, the context that informed it, and the outcome. A new agent entering a market queries: "Show me every decision made on markets like this, including the reasoning and the outcome." It inherits the collective intelligence of every prior agent.',
    highlight: 'Decision + rationale archive',
    buyIn: 'Does that solve the problem you described?',
  },
  {
    icon: Plug,
    title: 'Your agents query it like they think. Your orchestration writes to it like they breathe.',
    description: 'Natural language query interface built for agent calls. An agent asks: "What do we know about this company?" and gets structured, cited context back. On the write side: n8n node, Instantly connector, Apify integration, Polymarket hooks, OpenClaw AgentSkill, LangGraph/CrewAI native adapter. No schema maintenance. No custom pipelines. Wire it once. It compounds forever.',
    highlight: 'Agent-native wiring',
    buyIn: 'Does that solve the build-it-yourself problem?',
  },
];

export function MechanismSection() {
  return (
    <section id="features" className="section" style={{ position: 'relative' }}>
      {/* Grid pattern */}
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

      {/* Gradient orbs */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative' }}>
        {/* Header — Pitch transition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 720, marginBottom: 64 }}
        >
          <p className="section-label">The pitch</p>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Based on everything above.
            <br />
            Three things. Each maps directly to the problem your stack has right now.
          </h2>
        </motion.div>

        {/* Pillars */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}>
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
                gap: 40,
                alignItems: 'start',
                padding: '40px 0',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div>
                {/* Pillar number */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  color: 'var(--accent-light)',
                  display: 'block',
                  marginBottom: 16,
                }}>
                  PILLAR {i + 1}
                </span>

                {/* Title */}
                <h3 style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                }}>
                  {pillar.title}
                </h3>

                {/* Buy-in question */}
                <p style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--success)',
                  margin: 0,
                  fontStyle: 'italic',
                }}>
                  {pillar.buyIn}
                </p>
              </div>

              <div>
                {/* Description */}
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: 'var(--foreground-secondary)',
                  margin: '0 0 24px',
                }}>
                  {pillar.description}
                </p>

                {/* Highlight */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                }}>
                  <pillar.icon size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--accent-light)',
                  }}>
                    {pillar.highlight}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sell themselves */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: 64,
            padding: '40px 48px',
            background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--cyan-dim) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: 24,
            fontWeight: 600,
            color: 'var(--foreground)',
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}>
            Based on all three — do you actually feel like this would change what your stack is capable of?
          </p>
          <p style={{
            fontSize: 16,
            color: 'var(--foreground-secondary)',
            margin: 0,
          }}>
            And what would be different for you first — the lead graph, the trading archive, or the wiring layer?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
