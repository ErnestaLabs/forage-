import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgress from './ReadingProgress';

interface FaqItem {
  question: string;
  answer: string;
}

interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishDate: string;
  readingTime: string;
  tags: string[];
  content: string;
  faqSchema: FaqItem[];
}

function getBlogDir() {
  return path.join(process.cwd(), 'src', 'app', 'blog');
}

function loadPost(slug: string): BlogPost | null {
  const blogDir = getBlogDir();
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const data: BlogPost = JSON.parse(raw);
    if (data.slug === slug) return data;
  }
  return null;
}

function getAllSlugs(): string[] {
  const blogDir = getBlogDir();
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.json'));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(blogDir, f), 'utf-8');
    return JSON.parse(raw).slug as string;
  });
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = loadPost(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://useforage.xyz/blog/${post.slug}`,
      siteName: 'Forage',
      type: 'article',
      publishedTime: post.publishDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

// ─── Dynamic SVG Hero ─────────────────────────────────────────────────────────

function PostHero({ tag }: { tag: string }) {
  if (tag === 'ai-agents' || tag === 'hallucination') {
    return <HeroDotGrid />;
  }
  if (tag === 'mcp' || tag === 'knowledge-graph') {
    return <HeroNodeGraph />;
  }
  if (tag === 'ai-memory') {
    return <HeroConcentricRings />;
  }
  return <HeroWaveform />;
}

// Dot-grid with arc connections — for ai-agents / hallucination
function HeroDotGrid() {
  // Grid of dots with some connected by arcs
  const cols = 14;
  const rows = 6;
  const dotSpacing = 52;
  const offsetX = 24;
  const offsetY = 28;
  const width = cols * dotSpacing + offsetX * 2;
  const height = rows * dotSpacing + offsetY * 2;

  // Pre-defined active nodes and arcs
  const activeNodes = [
    [1, 1], [3, 0], [5, 2], [7, 1], [9, 3], [11, 1], [12, 4],
    [2, 3], [4, 4], [6, 3], [8, 5], [10, 2], [0, 4], [13, 2],
  ] as [number, number][];

  const arcs: [number, number, number, number][] = [
    [1, 1, 3, 0],
    [3, 0, 5, 2],
    [5, 2, 7, 1],
    [7, 1, 9, 3],
    [9, 3, 11, 1],
    [11, 1, 13, 2],
    [2, 3, 4, 4],
    [4, 4, 6, 3],
    [6, 3, 8, 5],
    [0, 4, 2, 3],
    [5, 2, 6, 3],
    [7, 1, 8, 5],
    [10, 2, 11, 1],
    [12, 4, 13, 2],
  ];

  const nx = (c: number) => offsetX + c * dotSpacing;
  const ny = (r: number) => offsetY + r * dotSpacing;

  const activeSet = new Set(activeNodes.map(([c, r]) => `${c},${r}`));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="280"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="arcGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="nodePulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="glow1">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width={width} height={height} fill="#0a0a0b" />

      {/* Passive dots */}
      {Array.from({ length: cols }, (_, c) =>
        Array.from({ length: rows }, (_, r) => {
          if (activeSet.has(`${c},${r}`)) return null;
          return (
            <circle
              key={`d-${c}-${r}`}
              cx={nx(c)}
              cy={ny(r)}
              r={1.5}
              fill="rgba(255,255,255,0.07)"
            />
          );
        })
      )}

      {/* Arc connections */}
      {arcs.map(([c1, r1, c2, r2], i) => {
        const x1 = nx(c1);
        const y1 = ny(r1);
        const x2 = nx(c2);
        const y2 = ny(r2);
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 22;
        return (
          <path
            key={`arc-${i}`}
            d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
            fill="none"
            stroke="url(#arcGrad1)"
            strokeWidth="1"
            strokeOpacity="0.45"
          />
        );
      })}

      {/* Active nodes */}
      {activeNodes.map(([c, r], i) => {
        const isCyan = i % 3 === 2;
        const color = isCyan ? '#22d3ee' : '#8b5cf6';
        const glowColor = isCyan ? 'rgba(34,211,238,0.35)' : 'rgba(139,92,246,0.35)';
        return (
          <g key={`n-${c}-${r}`} filter="url(#glow1)">
            <circle cx={nx(c)} cy={ny(r)} r={8} fill={glowColor} />
            <circle
              cx={nx(c)}
              cy={ny(r)}
              r={3.5}
              fill={color}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.75"
            />
          </g>
        );
      })}

      {/* Fade out edges */}
      <rect
        width={width}
        height={height}
        fill="url(#edgeFade)"
      />
      <defs>
        <linearGradient id="edgeFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a0a0b" stopOpacity="0.6" />
          <stop offset="12%" stopColor="#0a0a0b" stopOpacity="0" />
          <stop offset="88%" stopColor="#0a0a0b" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a0b" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Node-and-edge graph — for mcp / knowledge-graph
function HeroNodeGraph() {
  const W = 760;
  const H = 280;

  // 7 nodes with positions
  const nodes = [
    { id: 0, x: 120, y: 140, label: 'Entity', primary: true },
    { id: 1, x: 260, y: 70,  label: 'Memory',  primary: false },
    { id: 2, x: 260, y: 210, label: 'Signal',  primary: false },
    { id: 3, x: 400, y: 140, label: 'Graph',   primary: true  },
    { id: 4, x: 540, y: 70,  label: 'Agent',   primary: false },
    { id: 5, x: 540, y: 210, label: 'Source',  primary: false },
    { id: 6, x: 650, y: 140, label: 'Output',  primary: true  },
  ];

  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 3],
    [3, 4], [3, 5], [4, 6], [5, 6],
    [0, 3], [3, 6],
  ] as [number, number][];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="280"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="ngEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
        </linearGradient>
        <filter id="ngGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="ngBg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.06)" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="#0a0a0b" />
      <rect width={W} height={H} fill="url(#ngBg)" />

      {/* Edges — curved */}
      {edges.map(([a, b], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2 + (i % 2 === 0 ? -18 : 18);
        return (
          <path
            key={`e-${i}`}
            d={`M${na.x},${na.y} Q${mx},${my} ${nb.x},${nb.y}`}
            fill="none"
            stroke="url(#ngEdgeGrad)"
            strokeWidth="1.25"
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const color = n.primary ? '#8b5cf6' : '#22d3ee';
        const glow = n.primary ? 'rgba(139,92,246,0.3)' : 'rgba(34,211,238,0.25)';
        const r = n.primary ? 22 : 16;
        return (
          <g key={`n-${n.id}`} filter="url(#ngGlow)">
            <circle cx={n.x} cy={n.y} r={r + 6} fill={glow} />
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill="#0f0f12"
              stroke={color}
              strokeWidth={n.primary ? 1.5 : 1}
            />
            <text
              x={n.x}
              y={n.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={n.primary ? 9 : 8}
              fontFamily="'JetBrains Mono', monospace"
              fill={color}
              letterSpacing="0.04em"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Concentric rings with dots — for ai-memory
function HeroConcentricRings() {
  const W = 760;
  const H = 280;
  const cx = W / 2;
  const cy = H / 2;
  const radii = [40, 75, 110, 148];
  const dotCounts = [4, 7, 10, 13];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="280"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id="ringBg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.08)" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </radialGradient>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#0a0a0b" />
      <rect width={W} height={H} fill="url(#ringBg)" />

      {/* Rings */}
      {radii.map((r, ri) => (
        <circle
          key={`ring-${ri}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={ri % 2 === 0 ? 'rgba(139,92,246,0.22)' : 'rgba(34,211,238,0.18)'}
          strokeWidth="1"
          strokeDasharray={ri === 1 ? '4 6' : ri === 3 ? '2 5' : 'none'}
        />
      ))}

      {/* Dots at ring intersections */}
      {radii.map((r, ri) => {
        const count = dotCounts[ri];
        return Array.from({ length: count }, (_, di) => {
          const angle = (di / count) * Math.PI * 2 - Math.PI / 2;
          const dx = cx + r * Math.cos(angle);
          const dy = cy + r * Math.sin(angle);
          const isAccent = di % 3 === 0;
          const color = isAccent
            ? ri % 2 === 0 ? '#8b5cf6' : '#22d3ee'
            : 'rgba(255,255,255,0.18)';
          const dotR = isAccent ? 3.5 : 2;
          return (
            <g key={`rd-${ri}-${di}`} filter={isAccent ? 'url(#ringGlow)' : undefined}>
              {isAccent && (
                <circle cx={dx} cy={dy} r={dotR + 4} fill={ri % 2 === 0 ? 'rgba(139,92,246,0.2)' : 'rgba(34,211,238,0.18)'} />
              )}
              <circle cx={dx} cy={dy} r={dotR} fill={color} />
            </g>
          );
        });
      })}

      {/* Center node */}
      <g filter="url(#ringGlow)">
        <circle cx={cx} cy={cy} r={16} fill="rgba(139,92,246,0.2)" />
        <circle cx={cx} cy={cy} r={8} fill="#0f0f12" stroke="#8b5cf6" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={3} fill="#8b5cf6" />
      </g>

      {/* Side fade */}
      <defs>
        <linearGradient id="ringFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a0a0b" stopOpacity="1" />
          <stop offset="18%" stopColor="#0a0a0b" stopOpacity="0" />
          <stop offset="82%" stopColor="#0a0a0b" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a0b" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ringFade)" />
    </svg>
  );
}

// Abstract waveform — default fallback
function HeroWaveform() {
  const W = 760;
  const H = 280;
  const mid = H / 2;

  // Two overlapping sine-like waveforms built from bezier curves
  const buildWave = (amp: number, freq: number, phase: number, pts = 32) => {
    const step = W / pts;
    let d = '';
    for (let i = 0; i <= pts; i++) {
      const x = i * step;
      const y = mid + amp * Math.sin((i / pts) * freq * Math.PI * 2 + phase);
      if (i === 0) {
        d += `M${x.toFixed(1)},${y.toFixed(1)}`;
      } else {
        const px = (i - 0.5) * step;
        const py = mid + amp * Math.sin(((i - 0.5) / pts) * freq * Math.PI * 2 + phase);
        d += ` Q${px.toFixed(1)},${py.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
      }
    }
    return d;
  };

  // Vertical tick marks along center line
  const ticks = Array.from({ length: 38 }, (_, i) => ({
    x: (i / 37) * W,
    h: i % 6 === 0 ? 18 : i % 3 === 0 ? 11 : 6,
    accent: i % 6 === 0,
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="280"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="wfGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wfGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <filter id="wfGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="wfBg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.05)" />
          <stop offset="100%" stopColor="#0a0a0b" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="#0a0a0b" />
      <rect width={W} height={H} fill="url(#wfBg)" />

      {/* Center baseline */}
      <line x1="0" y1={mid} x2={W} y2={mid} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <rect
          key={`t-${i}`}
          x={t.x - 0.5}
          y={mid - t.h / 2}
          width="1"
          height={t.h}
          fill={t.accent ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}
        />
      ))}

      {/* Primary waveform */}
      <path
        d={buildWave(68, 3, 0)}
        fill="none"
        stroke="url(#wfGrad1)"
        strokeWidth="2"
        filter="url(#wfGlow)"
      />

      {/* Secondary waveform — offset phase */}
      <path
        d={buildWave(38, 5, 1.1)}
        fill="none"
        stroke="url(#wfGrad2)"
        strokeWidth="1.25"
      />

      {/* Accent dots at wave peaks */}
      {[0.12, 0.29, 0.46, 0.63, 0.80].map((t, i) => {
        const x = t * W;
        const y = mid + 68 * Math.sin(t * 3 * Math.PI * 2);
        const isCyan = i % 2 === 1;
        return (
          <g key={`wd-${i}`} filter="url(#wfGlow)">
            <circle cx={x} cy={y} r={6} fill={isCyan ? 'rgba(34,211,238,0.2)' : 'rgba(139,92,246,0.2)'} />
            <circle cx={x} cy={y} r={3} fill={isCyan ? '#22d3ee' : '#8b5cf6'} />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Minimal markdown → HTML renderer (no external dependencies) ──────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text: string): string {
  return (
    text
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  );
}

// Check if a paragraph is "all-bold" — contains only **text** spans and spaces
function isAllBold(text: string): boolean {
  // Remove all **...** spans and check if anything non-whitespace/punctuation remains
  const stripped = text.replace(/\*\*[^*]+\*\*/g, '').trim();
  return stripped.length === 0 && /\*\*[^*]+\*\*/.test(text);
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const output: string[] = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines: string[] = [];
  let listType: null | 'ul' | 'ol' = null;
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const text = paragraphLines.join(' ').trim();
    if (text) {
      if (isAllBold(text)) {
        // Render as a stat callout
        const inner = text.replace(/\*\*/g, '');
        output.push(`<p class="stat-callout">${escapeHtml(inner)}</p>`);
      } else {
        output.push(`<p>${renderInline(text)}</p>`);
      }
    }
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listType) return;
    output.push(listType === 'ul' ? '</ul>' : '</ol>');
    listType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        flushList();
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        const escaped = codeLines.map(escapeHtml).join('\n');
        output.push(
          `<div class="code-block"><div class="code-block-header"><div class="code-block-dots"><div class="code-block-dot" style="background:#ef4444"></div><div class="code-block-dot" style="background:#f59e0b"></div><div class="code-block-dot" style="background:#10b981"></div></div>${codeLang ? `<span style="font-family:var(--font-mono);font-size:11px;color:var(--foreground-muted);margin-left:8px;">${escapeHtml(codeLang)}</span>` : ''}</div><div class="code-block-content"><pre>${escaped}</pre></div></div>`
        );
        inCodeBlock = false;
        codeLines = [];
        codeLang = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const h4 = line.match(/^####\s+(.+)/);
    const h3 = !h4 && line.match(/^###\s+(.+)/);
    const h2 = !h4 && !h3 && line.match(/^##\s+(.+)/);
    const h1 = !h4 && !h3 && !h2 && line.match(/^#\s+(.+)/);

    if (h1 || h2 || h3 || h4) {
      flushParagraph();
      flushList();
      if (h4) output.push(`<h4>${renderInline(h4[1])}</h4>`);
      else if (h3) output.push(`<h3>${renderInline(h3[1])}</h3>`);
      else if (h2) output.push(`<h2>${renderInline(h2[1])}</h2>`);
      else if (h1) output.push(`<h1>${renderInline(h1[1])}</h1>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      output.push('<hr />');
      continue;
    }

    const blockquote = line.match(/^>\s+(.+)/);
    if (blockquote) {
      flushParagraph();
      flushList();
      output.push(`<blockquote><span class="bq-mark">\u201C</span><span class="bq-text">${renderInline(blockquote[1])}</span></blockquote>`);
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.+)/);
    if (listItem) {
      flushParagraph();
      if (listType !== 'ul') {
        flushList();
        output.push('<ul>');
        listType = 'ul';
      }
      output.push(`<li>${renderInline(listItem[1])}</li>`);
      continue;
    }

    const orderedItem = line.match(/^\d+\.\s+(.+)/);
    if (orderedItem) {
      flushParagraph();
      if (listType !== 'ol') {
        flushList();
        output.push('<ol>');
        listType = 'ol';
      }
      output.push(`<li>${renderInline(orderedItem[1])}</li>`);
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
      flushList();
      continue;
    }

    if (listType) {
      flushList();
    }
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return output.join('\n');
}

// ─── Date formatting ──────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = loadPost(slug);
  if (!post) notFound();

  const contentWithoutFaq = post.content
    .replace(/\n---\n\n## Frequently Asked Questions[\s\S]*$/i, '')
    .replace(/\n## Frequently Asked Questions[\s\S]*$/i, '')
    .trim();
  const htmlContent = markdownToHtml(contentWithoutFaq);

  const primaryTag = post.tags[0] ?? '';

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqSchema.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishDate,
    author: {
      '@type': 'Organization',
      name: 'Forage',
      url: 'https://useforage.xyz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Forage',
      url: 'https://useforage.xyz',
    },
    url: `https://useforage.xyz/blog/${post.slug}`,
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        position: 'relative',
      }}
    >
      {/* Reading progress bar (client component) */}
      <ReadingProgress />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Background grid */}
      <div
        className="grid-pattern"
        style={{ position: 'fixed', inset: 0, opacity: 0.35, pointerEvents: 'none' }}
      />

      {/* Gradient orb */}
      <div
        style={{
          position: 'fixed',
          top: -200,
          right: '10%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 820,
        }}
      >
        {/* Navigation row */}
        <div
          style={{
            paddingTop: 80,
            paddingBottom: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Link
            href="/blog"
            className="blog-back-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--foreground-tertiary)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M8.5 2.5L4 7l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All posts
          </Link>

          <span style={{ color: 'var(--border-hover)', fontSize: 12 }}>/</span>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.04em',
              color: 'var(--foreground-muted)',
            }}
          >
            {post.readingTime} read
          </span>
        </div>

        {/* Dynamic SVG hero — fills full container width, rounded card */}
        <div
          style={{
            width: '100%',
            borderRadius: 16,
            marginBottom: 52,
            border: '1px solid var(--border)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <PostHero tag={primaryTag} />

          {/* Tag chip overlay in bottom-left */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 20,
              display: 'flex',
              gap: 6,
            }}
          >
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="badge badge-accent"
                style={{ fontSize: 10, padding: '4px 10px', backdropFilter: 'blur(8px)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Article header */}
        <header style={{ marginBottom: 52 }}>
          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 46px)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              margin: '0 0 24px',
              background: 'linear-gradient(160deg, var(--foreground) 0%, rgba(250,250,250,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {post.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              paddingBottom: 32,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.02em',
                  flexShrink: 0,
                }}
              >
                F
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>
                  Forage Team
                </div>
                <div style={{ fontSize: 12, color: 'var(--foreground-tertiary)' }}>
                  {formatDate(post.publishDate)}
                </div>
              </div>
            </div>

            {/* Divider dot */}
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--border-hover)',
                flexShrink: 0,
              }}
            />

            {/* Reading time */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--foreground-muted)',
                letterSpacing: '0.04em',
              }}
            >
              {post.readingTime} read
            </span>
          </div>
        </header>

        {/* Article content */}
        <article
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{ paddingBottom: 80 }}
        />

        {/* FAQ section */}
        {post.faqSchema.length > 0 && (
          <section
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 64,
              paddingBottom: 80,
            }}
          >
            <p className="section-label" style={{ marginBottom: 8 }}>
              FAQ
            </p>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: 'var(--foreground)',
                margin: '0 0 40px',
              }}
            >
              Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {post.faqSchema.map((item, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{ padding: '24px 28px' }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      color: 'var(--foreground)',
                      margin: '0 0 12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: 'var(--accent-dim)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--accent-light)',
                        marginTop: 1,
                      }}
                    >
                      Q
                    </span>
                    {item.question}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: 'var(--foreground-secondary)',
                      margin: 0,
                      paddingLeft: 34,
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Conversion CTA panel ────────────────────────────────────────────── */}
        <div
          style={{
            paddingBottom: 112,
            paddingTop: 16,
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              padding: '2px',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.55) 0%, rgba(34,211,238,0.35) 50%, rgba(139,92,246,0.2) 100%)',
            }}
          >
            {/* Inner glass card */}
            <div
              style={{
                borderRadius: 18,
                padding: '48px 52px',
                background: 'linear-gradient(160deg, rgba(18,18,22,0.97) 0%, rgba(12,12,16,0.99) 100%)',
                backdropFilter: 'blur(24px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background glow blobs */}
              <div
                style={{
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -40,
                  left: -40,
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Label */}
              <p
                className="section-label"
                style={{ marginBottom: 16, position: 'relative' }}
              >
                Give your agents memory
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontSize: 'clamp(22px, 3.5vw, 30px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  color: 'var(--foreground)',
                  margin: '0 0 14px',
                  position: 'relative',
                  maxWidth: 560,
                }}
              >
                Your agents are starting from zero.{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, var(--accent-light), var(--cyan))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Every session.
                </span>
              </h2>

              {/* Subline */}
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: 'var(--foreground-secondary)',
                  margin: '0 0 36px',
                  position: 'relative',
                  maxWidth: 500,
                }}
              >
                Forage gives them memory, live data, and causal reasoning.
                One connection.
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 28,
                  position: 'relative',
                }}
              >
                <a
                  href="https://useforage.xyz/#signup"
                  className="btn btn-primary"
                  style={{ fontSize: 14, padding: '13px 28px' }}
                >
                  Start Free — $5 Credits
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3.5L11.5 7 8 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="/#how-it-works"
                  className="btn btn-secondary"
                  style={{ fontSize: 14, padding: '13px 24px' }}
                >
                  See How It Works
                </a>
              </div>

              {/* Trust signals */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                  position: 'relative',
                }}
              >
                {['Pay per call', 'No subscription', 'Works with Claude, n8n, GPT-4'].map((sig, i) => (
                  <span key={sig} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.04em',
                        color: 'var(--foreground-muted)',
                      }}
                    >
                      {sig}
                    </span>
                    {i < 2 && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 3,
                          height: 3,
                          borderRadius: '50%',
                          background: 'var(--border-hover)',
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prose styles ──────────────────────────────────────────────────────── */}
      <style>{`
        /* ── Headings ───────────────────────────────────────────────────────── */
        article h1 {
          font-size: clamp(26px, 4vw, 36px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.15;
          color: var(--foreground);
          margin: 56px 0 20px;
        }
        article h1:first-child {
          margin-top: 0;
        }
        article h2 {
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.25;
          color: var(--foreground);
          margin: 56px 0 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        article h2::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, var(--accent), transparent);
        }
        article h3 {
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.3;
          color: var(--foreground);
          margin: 40px 0 14px;
        }
        article h4 {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 32px 0 10px;
        }

        /* ── Body text ──────────────────────────────────────────────────────── */
        article p {
          font-size: 16.5px;
          line-height: 1.85;
          color: var(--foreground-secondary);
          margin: 0 0 22px;
        }
        article strong {
          font-weight: 600;
          color: var(--foreground);
        }
        article em {
          font-style: italic;
          color: var(--foreground-secondary);
        }
        article a {
          color: var(--accent-light);
          text-decoration: none;
          border-bottom: 1px solid rgba(139, 92, 246, 0.3);
          transition: border-color var(--transition-fast), color var(--transition-fast);
        }
        article a:hover {
          color: var(--foreground);
          border-color: var(--accent);
        }
        article code {
          font-family: var(--font-mono);
          font-size: 13px;
          background: var(--background-tertiary);
          color: var(--cyan);
          padding: 2px 7px;
          border-radius: 5px;
          border: 1px solid var(--border);
        }

        /* ── Lists ──────────────────────────────────────────────────────────── */
        article ul {
          margin: 4px 0 24px;
          padding: 0;
          list-style: none;
        }
        article ol {
          margin: 4px 0 24px;
          padding: 0 0 0 22px;
        }
        article ul li {
          font-size: 16.5px;
          line-height: 1.8;
          color: var(--foreground-secondary);
          padding: 5px 0 5px 24px;
          position: relative;
        }
        article ul li::before {
          content: '';
          position: absolute;
          left: 2px;
          top: 14px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent-glow);
        }
        article ol li {
          font-size: 16.5px;
          line-height: 1.8;
          color: var(--foreground-secondary);
          padding: 5px 0;
        }
        article ol li::marker {
          color: var(--accent);
          font-weight: 600;
          font-family: var(--font-mono);
          font-size: 13px;
        }

        /* ── Horizontal rule ────────────────────────────────────────────────── */
        article hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 56px 0;
        }

        /* ── Code blocks ────────────────────────────────────────────────────── */
        article .code-block {
          margin: 28px 0;
        }
        article .code-block pre {
          font-size: 13px;
          line-height: 1.7;
          color: var(--foreground-secondary);
        }

        /* ── Pull quote — magazine style ────────────────────────────────────── */
        article blockquote {
          position: relative;
          margin: 44px 0;
          padding: 32px 36px 32px 52px;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.1) 0%,
            rgba(34, 211, 238, 0.05) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-left: none;
          border-radius: 0 16px 16px 0;
          overflow: visible;
        }
        article blockquote::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--accent) 0%, var(--cyan) 100%);
          border-radius: 2px 0 0 2px;
        }
        article blockquote .bq-mark {
          position: absolute;
          top: 10px;
          left: 18px;
          font-size: 52px;
          line-height: 1;
          font-family: Georgia, 'Times New Roman', serif;
          color: var(--accent);
          opacity: 0.6;
          pointer-events: none;
          user-select: none;
        }
        article blockquote .bq-text {
          display: block;
          font-size: 18px;
          font-weight: 500;
          line-height: 1.65;
          color: var(--foreground);
          letter-spacing: -0.015em;
          font-style: italic;
        }

        /* ── Stat callout — all-bold paragraph ──────────────────────────────── */
        article p.stat-callout {
          margin: 36px 0;
          padding: 22px 28px;
          background: linear-gradient(
            135deg,
            rgba(34, 211, 238, 0.08) 0%,
            rgba(139, 92, 246, 0.06) 100%
          );
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--foreground);
          text-align: center;
          line-height: 1.5;
          box-shadow: inset 0 1px 0 rgba(34, 211, 238, 0.1);
        }

        /* ── Responsive tweaks ──────────────────────────────────────────────── */
        @media (max-width: 640px) {
          article blockquote {
            padding: 24px 24px 24px 40px;
            margin: 32px 0;
          }
          article blockquote .bq-mark {
            font-size: 40px;
            left: 14px;
          }
          article blockquote .bq-text {
            font-size: 16px;
          }
          article p.stat-callout {
            font-size: 16px;
            padding: 18px 20px;
          }
        }
      `}</style>
    </main>
  );
}
