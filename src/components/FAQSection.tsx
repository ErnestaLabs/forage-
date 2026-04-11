'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "Can't I just save agent outputs to a database?",
    a: "You can store the data. Forage makes it reasoned over. The difference is an agent querying 'what pattern worked on campaigns like this?' versus you writing a SQL query, interpreting the results, and re-prompting. Forage is the layer between the data and the agent's next autonomous decision.",
  },
  {
    q: 'I already use a vector database / RAG pipeline.',
    a: "Vector search finds similar content. Forage tracks typed entities, temporal deltas, causal decision chains, and outcome history. You can't ask Pinecone why a trade worked or what changed at a competitor last Tuesday. That requires a reasoning graph, not similarity retrieval.",
  },
  {
    q: 'My agents already have memory.',
    a: "Per-agent memory is per-agent. Your Instantly agent and your Polymarket agent and your Apify actors are not sharing context. Forage is cross-agent, cross-stack, cross-session. Every agent contributes to the same graph — and inherits from every other agent that ran before it.",
  },
  {
    q: "Why can't I just build this myself?",
    a: "You could build the storage. The hard part is the schema that stays coherent as your stack evolves, the natural language query layer agents can actually use, and the temporal + causal structure that makes pattern recognition possible. Forage is the opinionated, agent-native version of what you'd spend six months building — and probably rebuilding twice.",
  },
  {
    q: "What's the actual network effect?",
    a: "Every agent that writes to Forage makes every future agent smarter. 1,000 email campaigns don't just produce results — they produce a simulation library. Your agent doesn't wait to be asked. It's already run 100 variations, found the pattern, and built the next strategy. The longer you run, the wider the gap between your stack and one starting from scratch.",
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
          <p className="section-label">Questions</p>
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 48 }}>
            The objections you're already thinking about.
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
