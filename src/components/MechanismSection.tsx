'use client';

import { motion } from 'framer-motion';
import { DatabaseZap, GitBranch, Plug, Zap } from 'lucide-react';

const pillars = [
  {
    icon: DatabaseZap,
    title: 'A graph that never forgets',
    description: 'Not a cache. A structured knowledge graph with ~1M entities: companies, people, funding rounds, competitors, technologies, signals. Every session writes back to it. Every future session reads from it. Nothing resets.',
    highlight: '~1M entities',
  },
  {
    icon: GitBranch,
    title: 'Reasoning, not retrieval',
    description: 'Ask what is upstream of a company failure. Simulate a market shock downstream. Trace contagion across competitors, supply chains, and hiring signals. It finds connections across entities, not just within them.',
    highlight: '200+ relation types',
  },
  {
    icon: Plug,
    title: 'One Apify token. Done.',
    description: 'MCP server for Claude and any MCP client. Native n8n node. Apify actor for direct API access. Paste one config block, add your Apify token. Your agent has 36 tools and a memory graph in under five minutes.',
    highlight: 'Claude · n8n · GPT',
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <p className="section-label">Why it works</p>
          <h2 className="section-title">
            Three things your current agent cannot do.
            <br />
            Forage is built entirely around them.
          </h2>
        </motion.div>

        {/* Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                padding: 32,
                borderRadius: 16,
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                transition: 'all 0.3s',
              }}
              whileHover={{
                borderColor: 'var(--border-hover)',
                y: -4,
              }}
            >
              {/* Icon with glow */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--cyan-dim) 100%)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                }}
              >
                <pillar.icon size={24} style={{ color: 'var(--accent-light)' }} />
              </motion.div>

              {/* Title */}
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--foreground)',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
              }}>
                {pillar.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--foreground-secondary)',
                margin: '0 0 20px',
              }}>
                {pillar.description}
              </p>

              {/* Highlight badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'var(--background)',
                border: '1px solid var(--border)',
              }}>
                <Zap size={12} style={{ color: 'var(--accent)' }} />
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--foreground-tertiary)',
                }}>
                  {pillar.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
