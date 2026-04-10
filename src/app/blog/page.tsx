import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Forage',
  description:
    'Insights on AI agents, knowledge graphs, MCP servers, and building intelligence that compounds. From the Forage team.',
  openGraph: {
    title: 'Blog — Forage',
    description:
      'Insights on AI agents, knowledge graphs, MCP servers, and building intelligence that compounds. From the Forage team.',
    url: 'https://useforage.xyz/blog',
    siteName: 'Forage',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Forage',
    description:
      'Insights on AI agents, knowledge graphs, MCP servers, and building intelligence that compounds. From the Forage team.',
  },
};

interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  publishDate: string;
  readingTime: string;
  tags: string[];
}

function loadPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), 'src', 'app', 'blog');
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.json'));

  const posts: BlogPost[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const data = JSON.parse(raw);
    return {
      slug: data.slug,
      title: data.title,
      metaDescription: data.metaDescription,
      publishDate: data.publishDate,
      readingTime: data.readingTime,
      tags: data.tags,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Convert a reading-time string like "5 min" into a dot count 1–5. */
function readingTimeToDots(readingTime: string): number {
  const match = readingTime.match(/\d+/);
  if (!match) return 1;
  const mins = parseInt(match[0], 10);
  if (mins <= 2) return 1;
  if (mins <= 4) return 2;
  if (mins <= 6) return 3;
  if (mins <= 8) return 4;
  return 5;
}

function ReadingMeter({ readingTime }: { readingTime: string }) {
  const filled = readingTimeToDots(readingTime);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
      title={readingTime + ' read'}
      aria-label={readingTime + ' read'}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= filled ? 'reading-dot reading-dot--filled' : 'reading-dot'}
        />
      ))}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--foreground-muted)',
          marginLeft: 6,
        }}
      >
        {readingTime}
      </span>
    </div>
  );
}

/* ─── Featured hero card (first post) ──────────────────────────────────────── */
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-featured-link">
      <article className="blog-featured-card">
        {/* Featured badge */}
        <span className="blog-featured-badge">Featured</span>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {post.tags.map((tag) => (
            <span key={tag} className="badge badge-accent" style={{ fontSize: 11 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="blog-featured-title">{post.title}</h2>

        {/* Description */}
        <p className="blog-featured-desc">{post.metaDescription}</p>

        {/* Footer row */}
        <div className="blog-featured-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                fontSize: 12,
                color: 'var(--foreground-tertiary)',
              }}
            >
              {formatDate(post.publishDate)}
            </span>
            <ReadingMeter readingTime={post.readingTime} />
          </div>

          <div className="blog-read-link">
            Read article
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6h7M6.5 3.5L9 6l-2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Secondary grid card (posts 2–3) ──────────────────────────────────────── */
function SecondaryCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-secondary-link">
      <article className="blog-secondary-card">
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-accent" style={{ fontSize: 11 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            color: 'var(--foreground)',
            margin: '0 0 12px',
            flexGrow: 0,
          }}
        >
          {post.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--foreground-secondary)',
            margin: '0 0 20px',
            flexGrow: 1,
          }}
        >
          {post.metaDescription}
        </p>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--foreground-tertiary)' }}>
            {formatDate(post.publishDate)}
          </span>
          <ReadingMeter readingTime={post.readingTime} />
        </div>

        <div className="blog-read-link" style={{ marginTop: 14 }}>
          Read article
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2.5 6h7M6.5 3.5L9 6l-2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>
    </Link>
  );
}

/* ─── List row card (posts 4+) ──────────────────────────────────────────────── */
function ListCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-list-link">
      <article className="blog-list-card">
        <div className="blog-list-main">
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="badge badge-accent" style={{ fontSize: 10, padding: '4px 10px' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Title + description */}
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              color: 'var(--foreground)',
              margin: '0 0 6px',
            }}
          >
            {post.title}
          </h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--foreground-secondary)',
              margin: 0,
            }}
          >
            {post.metaDescription}
          </p>
        </div>

        {/* Meta */}
        <div className="blog-list-meta">
          <span style={{ fontSize: 12, color: 'var(--foreground-tertiary)', whiteSpace: 'nowrap' }}>
            {formatDate(post.publishDate)}
          </span>
          <ReadingMeter readingTime={post.readingTime} />
          <div className="blog-read-link" style={{ fontSize: 12 }}>
            Read
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6h7M6.5 3.5L9 6l-2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag: activeTag } = await searchParams;

  const allPosts = loadPosts();

  /* Collect unique tags from all posts */
  const allTags: string[] = Array.from(
    new Set(allPosts.flatMap((p) => p.tags))
  ).sort();

  /* Filter posts by tag if one is selected */
  const posts =
    activeTag && activeTag !== 'all'
      ? allPosts.filter((p) => p.tags.includes(activeTag))
      : allPosts;

  const featured = posts[0] ?? null;
  const secondaryPosts = posts.slice(1, 3);
  const listPosts = posts.slice(3);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        position: 'relative',
      }}
    >
      {/* Grid background */}
      <div
        className="grid-pattern"
        style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none' }}
      />

      {/* Gradient orb */}
      <div
        style={{
          position: 'fixed',
          top: -300,
          right: '5%',
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <div
          style={{
            paddingTop: 96,
            paddingBottom: 56,
            borderBottom: '1px solid var(--border)',
            marginBottom: 48,
          }}
        >
          {/* Back to home */}
          <Link
            href="/"
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
              marginBottom: 40,
              transition: 'color 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M8.5 2.5L4 7l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            useforage.xyz
          </Link>

          <p className="section-label" style={{ marginBottom: 16 }}>
            Intelligence
          </p>

          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              margin: '0 0 20px',
              background:
                'linear-gradient(180deg, var(--foreground) 0%, var(--foreground-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Forage Blog
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: 'var(--foreground-secondary)',
              margin: 0,
              maxWidth: 520,
            }}
          >
            AI agents, knowledge graphs, and intelligence that compounds. No fluff.
          </p>
        </div>

        {/* ── Category filter bar ── */}
        <div className="blog-filter-bar" style={{ marginBottom: 48 }}>
          <Link
            href="/blog"
            className={
              !activeTag || activeTag === 'all'
                ? 'blog-filter-pill blog-filter-pill--active'
                : 'blog-filter-pill'
            }
          >
            All
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={
                activeTag === tag
                  ? 'blog-filter-pill blog-filter-pill--active'
                  : 'blog-filter-pill'
              }
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* ── Content ── */}
        {posts.length === 0 ? (
          <p
            style={{
              color: 'var(--foreground-secondary)',
              fontSize: 15,
              paddingBottom: 96,
            }}
          >
            No posts found for this tag.
          </p>
        ) : (
          <div style={{ paddingBottom: 96 }}>
            {/* Featured */}
            {featured && <FeaturedCard post={featured} />}

            {/* 2-column secondary grid */}
            {secondaryPosts.length > 0 && (
              <div className="blog-secondary-grid">
                {secondaryPosts.map((post) => (
                  <SecondaryCard key={post.slug} post={post} />
                ))}
              </div>
            )}

            {/* Stacked list for posts 4+ */}
            {listPosts.length > 0 && (
              <div className="blog-list-stack">
                {listPosts.map((post) => (
                  <ListCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
