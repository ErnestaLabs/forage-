'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'Is this a search wrapper?',
    a: "No. Search is one capability. Forage searches, scrapes, discovers emails, extracts LinkedIn data, pulls Crunchbase, checks reviews, maps markets, analyzes competitors, detects hiring signals, and synthesizes it all into a knowledge graph that remembers. Every result feeds the graph. Every query checks the graph first.",
  },
  {
    q: 'Does the knowledge graph actually persist between sessions?',
    a: "Yes. Everything your agent discovers stays in the graph permanently. You can query it, add claims to it, analyze causal chains, simulate interventions. Your agent's institutional knowledge grows every session. Next time you ask about the same company, it already knows — and adds only what changed.",
  },
  {
    q: 'Do I need multiple API keys?',
    a: "No. One Apify token. We orchestrate everything server-side. No SerpAPI key. No Jina key. No Apollo key. No Google Places key. You bring Apify credentials. We handle sourcing, orchestration, deduplication, graph enrichment, and causal analysis.",
  },
  {
    q: 'How fresh is the data?',
    a: "Real-time for web searches and scrapes. Graph data is what your agent discovered — plus what others using Forage have discovered and shared into the graph. You own your queries; the graph is shared intelligence that compounds across the entire network.",
  },
  {
    q: 'What are Skills exactly?',
    a: "Skills are pre-built multi-source workflows wrapped in a single tool call. Instead of chaining 5 tools yourself, you call one Skill and get a complete structured result. Company Dossier fires 6 sources in parallel — web, LinkedIn, Crunchbase, Clearbit, email finders, tech stack — and merges them into one response.",
  },
  {
    q: 'What happens if your service goes down?',
    a: "Your agent keeps working on cached graph data. It just can't do live research. You'll hear from us immediately if there's an outage. And because the graph is persistent, everything it already learned is still there the moment we're back.",
  },
];

function FaqItem({ q, a, isLast }: { q: string; a: string; isLast: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: 15,
          fontWeight: 500,
          color: 'var(--foreground)',
          lineHeight: 1.4,
        }}>
          {q}
        </span>
        <span style={{
          flexShrink: 0,
          color: open ? 'var(--accent)' : 'var(--foreground-tertiary)',
          marginTop: 2,
          transition: 'color 0.2s',
        }}>
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: 'var(--foreground-secondary)',
              paddingBottom: 20,
              margin: 0,
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="section" style={{ position: 'relative' }}>
      {/* Grid pattern */}
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

      <div className="container" style={{ maxWidth: 720, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">FAQ</p>
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 48 }}>
            Frequently asked questions
          </h2>

          <div className="card" style={{ padding: '0 28px' }}>
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} isLast={i === faqs.length - 1} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
