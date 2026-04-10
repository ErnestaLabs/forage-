'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Component as Globe } from './ui/interactive-globe';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      {/* Background grid pattern */}
      <div
        className="grid-pattern"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
        }}
      />

      {/* Gradient orbs */}
      <motion.div
        style={{ y, opacity }}
        className="gradient-orb gradient-orb-purple"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div style={{
          position: 'absolute',
          top: -200,
          right: '10%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </motion.div>

      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <div style={{
          position: 'absolute',
          bottom: -100,
          left: '5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </motion.div>

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: 64,
          alignItems: 'center',
        }}>
          {/* Left column - Text */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span
                className="badge badge-accent"
                style={{ marginBottom: 24 }}
              >
                <Sparkles size={14} />
                $5 free credits. No credit card. No subscription.
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontSize: 'clamp(40px, 6vw, 64px)',
                fontWeight: 600,
                letterSpacing: '-0.035em',
                lineHeight: 1.05,
                margin: '0 0 20px',
                background: 'linear-gradient(180deg, var(--foreground) 0%, var(--foreground-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Your agent
              <br />
              starts from zero.
              <br />
              <span style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Every single time.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: 'var(--foreground-secondary)',
                margin: '0 0 32px',
                maxWidth: 460,
              }}
            >
              Every session, your agent forgets what it learned. Every hallucination costs you a decision.
              Every reset means your competitor pulls further ahead.
              <span style={{ color: 'var(--success)', fontWeight: 500 }}> That is the problem. Not the model. The memory.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo('#signup')}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: 15, fontWeight: 600 }}
              >
                Get $5 Free Credits
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo('#how-it-works')}
                className="btn btn-secondary"
                style={{ padding: '14px 28px', fontSize: 15 }}
              >
                See Why It Compounds
              </motion.button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginTop: 40,
                paddingTop: 32,
                borderTop: '1px solid var(--border)',
              }}
            >
              {[
                'No hallucinations. Data is sourced live, not recalled.',
                'Every session builds on the last. Nothing resets.',
                '36 tools. Pay per call. No subscription.',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px var(--accent-glow)',
                  }} />
                  <span style={{ fontSize: 14, color: 'var(--foreground-tertiary)' }}>{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Globe */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: -105 }}>
            <Globe size={550} />
          </div>
        </div>

        {/* Integration bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{
            marginTop: 80,
            paddingTop: 40,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '24px 48px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--foreground-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Works with
          </span>
          {['Claude Desktop', 'n8n', 'GPT-4', 'Apify', 'Any MCP Client'].map(name => (
            <span
              key={name}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--foreground-tertiary)',
                transition: 'color 0.2s',
              }}
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
