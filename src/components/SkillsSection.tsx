'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';

interface Skill {
  name: string;
  description: string;
  steps: string[];
  perTrigger: string;
  monthly: string;
  category: string;
  categoryColor: string;
}

const skills: Skill[] = [
  {
    name: 'Company Dossier',
    description: 'Your agent gets a complete company profile — financials, contacts, web presence — stored in the graph for every future session.',
    steps: ['get_company_info()', 'find_emails()', 'search_web()', 'enrich_entity()', 'synthesise_dossier()'],
    perTrigger: '$0.50',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
  {
    name: 'Prospect This Company',
    description: 'Your agent gets verified decision-maker contacts — name, email, seniority — ready to act on without any follow-up research.',
    steps: ['find_leads()', 'find_emails()', 'score_by_seniority()', 'enrich_profiles()'],
    perTrigger: '$0.75',
    monthly: '$0',
    category: 'Sales',
    categoryColor: 'var(--accent)',
  },
  {
    name: 'Outbound List Builder',
    description: 'Your agent gets 100 enriched leads with verified emails, export-ready — what used to take a day takes one call.',
    steps: ['find_leads(100)', 'verify_emails()', 'enrich()', 'format_for_export()'],
    perTrigger: '$3.50',
    monthly: '$0',
    category: 'Sales',
    categoryColor: 'var(--accent)',
  },
  {
    name: 'Local Market Map',
    description: 'Your agent gets every business of a type in a location — with contacts — mapped and stored so the next local query costs nothing.',
    steps: ['search_local_businesses()', 'get_contact_details()', 'enrich()', 'map_output()'],
    perTrigger: '$0.80',
    monthly: '$0',
    category: 'Local',
    categoryColor: 'var(--success)',
  },
  {
    name: 'Competitor Intelligence',
    description: 'Your agent gets current pricing, features, and positioning from any competitor site — compared against what it already knows in the graph.',
    steps: ['scrape_site()', 'extract_pricing()', 'extract_features()', 'knowledge_graph_compare()'],
    perTrigger: '$0.80',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
  {
    name: 'Decision Maker Finder',
    description: 'Your agent gets 20 verified senior contacts at any company — scored by seniority, ready to hand off to outreach immediately.',
    steps: ['find_leads()', 'verify_emails()', 'get_linkedin()', 'score_seniority()'],
    perTrigger: '$1.00',
    monthly: '$0',
    category: 'Sales',
    categoryColor: 'var(--accent)',
  },
  {
    name: 'Competitor Ads',
    description: 'Your agent gets every active ad from any competitor — copy, creative angle, and landing page — without you having to monitor anything.',
    steps: ['scrape_ads_library()', 'extract_ad_copy()', 'analyze_landing_pages()'],
    perTrigger: '$0.65',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
  {
    name: 'Job Signals',
    description: 'Your agent reads hiring patterns as strategy signals — knowing a company is scaling its data team before anyone else does.',
    steps: ['scrape_job_board()', 'extract_tech_roles()', 'analyze_growth_signals()'],
    perTrigger: '$0.55',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
  {
    name: 'Tech Stack',
    description: 'Your agent knows exactly what tools a company runs — so it can qualify, compare, or pitch with full context from the first message.',
    steps: ['scrape_builtwith()', 'detect_frameworks()', 'categorize_tools()'],
    perTrigger: '$0.45',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
  {
    name: 'Funding Intel',
    description: 'Your agent gets full funding history and investor relationships — so it understands who has budget, who is being watched, and why.',
    steps: ['scrape_crunchbase()', 'extract_rounds()', 'identify_investors()'],
    perTrigger: '$0.70',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
  {
    name: 'Social Proof',
    description: 'Your agent surfaces what real customers say — ratings, recurring complaints, standout praise — so it can position against the truth.',
    steps: ['scrape_g2()', 'extract_ratings()', 'analyze_sentiment()'],
    perTrigger: '$0.55',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
  {
    name: 'Market Map',
    description: 'Your agent gets every player in a market with their positioning — stored in the graph so it never has to rediscover the landscape.',
    steps: ['search_market()', 'scrape_competitors()', 'analyze_positioning()'],
    perTrigger: '$1.20',
    monthly: '$0',
    category: 'Research',
    categoryColor: 'var(--cyan)',
  },
];

function SkillCard({ skill }: { skill: Skill }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: 28, flex: 1 }}>
        {/* Category */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.1em',
          color: skill.categoryColor,
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 12,
        }}>
          {skill.category}
        </span>

        {/* Title */}
        <h3 style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--foreground)',
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}>
          {skill.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 14,
          color: 'var(--foreground-secondary)',
          margin: '0 0 20px',
          lineHeight: 1.5,
        }}>
          {skill.description}
        </p>

        {/* Under the hood toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--foreground-tertiary)',
            letterSpacing: '0.02em',
            transition: 'color 0.2s',
          }}
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
          Under the hood
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 10,
                background: 'var(--background)',
                border: '1px solid var(--border)',
              }}>
                {skill.steps.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '4px 0',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: skill.categoryColor,
                      width: 18,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--foreground-secondary)',
                    }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 28px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--glass)',
      }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--foreground)',
                letterSpacing: '-0.02em',
              }}>
                {skill.perTrigger}
              </span>
              <span style={{ fontSize: 12, color: 'var(--foreground-tertiary)' }}>/trigger</span>
            </div>
          </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'transparent',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 14px',
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
        >
          <Play size={12} />
          Try it
        </motion.button>
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="section" style={{ background: 'var(--background-secondary)' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 720, marginBottom: 64 }}
        >
          <p className="section-label">Skills</p>
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            12 Skills. Each one fires
            <br />
            6 sources in parallel.
          </h2>

          {/* Primitive vs Skill callout */}
          <div style={{
            borderLeft: '2px solid var(--accent)',
            paddingLeft: 20,
            marginTop: 24,
          }}>
            <p style={{
              fontSize: 15,
              color: 'var(--foreground)',
              fontWeight: 500,
              margin: '0 0 8px',
            }}>
              One call. Multiple data sources merged, deduplicated, and enriched into the graph.
            </p>
            <p style={{
              fontSize: 14,
              color: 'var(--foreground-secondary)',
              margin: 0,
            }}>
              Your agent gets the result and the memory.
            </p>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
          marginBottom: 48,
        }}>
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <SkillCard skill={skill} />
            </motion.div>
          ))}
        </div>

        {/* Pricing model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--cyan-dim) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 40,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 40,
          }}
        >
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--foreground)',
              margin: '0 0 8px',
            }}>
              Pay per call
            </h3>
            <p style={{
              fontSize: 14,
              color: 'var(--foreground-secondary)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              No subscriptions. No minimums. Each tool call shows its cost in the response.
            </p>
          </div>
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--foreground)',
              margin: '0 0 8px',
            }}>
              $1.00 credit included
            </h3>
            <p style={{
              fontSize: 14,
              color: 'var(--foreground-secondary)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              No card required. Cancel anytime. Use it on any tool or Skill.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
