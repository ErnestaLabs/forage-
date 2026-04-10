'use client';

import { motion } from 'framer-motion';
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';

const problems = [
  {
    icon: Brain,
    title: 'It forgets everything overnight',
    description: "You asked about Stripe last Tuesday. Competitors, investors, tech stack, hiring signals. Today you ask again. It starts from zero. Every single session. All that work, gone. There is no accumulation.",
    stat: '0',
    statLabel: 'entities carried forward',
  },
  {
    icon: AlertTriangle,
    title: 'It invents what it does not know',
    description: "Ask for 50 qualified leads. It returns email addresses with 90% confidence. Half do not exist. Ask who the real competitors are. It names companies that folded two years ago. You are not running intelligence. You are running a very confident guesser.",
    stat: '~30%',
    statLabel: 'of outputs fabricated',
  },
  {
    icon: TrendingUp,
    title: 'The gap compounds daily',
    description: "While your agent resets each morning, a competitor is adding 200 entities to a graph it has been building for six months. That graph knows your market better than you do. The gap is not static. It widens every day you wait.",
    stat: '6 mo',
    statLabel: 'head start lost while waiting',
  },
];

export function ProblemSection() {
  return (
    <section className="section" style={{ background: 'var(--background-secondary)' }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 640, marginBottom: 64 }}
        >
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--foreground)',
            lineHeight: 1.1,
            margin: 0,
          }}>
            The model is not the problem.
            <br />
            <span style={{ color: 'var(--error)' }}>The problem is that it forgets you exist.</span>
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card"
              style={{
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <problem.icon size={22} style={{ color: 'var(--accent-light)' }} />
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--foreground)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {problem.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--foreground-secondary)',
                margin: 0,
                flex: 1,
              }}>
                {problem.description}
              </p>

              {/* Stat */}
              <div style={{
                paddingTop: 20,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
              }}>
                <span style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'var(--error)',
                  letterSpacing: '-0.03em',
                }}>
                  {problem.stat}
                </span>
                <span style={{
                  fontSize: 14,
                  color: 'var(--foreground-tertiary)',
                }}>
                  {problem.statLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
