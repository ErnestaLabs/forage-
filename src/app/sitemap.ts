import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

interface BlogPostMeta {
  slug: string
  publishDate: string
}

function loadBlogMeta(): BlogPostMeta[] {
  const blogDir = path.join(process.cwd(), 'src', 'app', 'blog')
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.json'))
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(blogDir, f), 'utf-8')
    const data = JSON.parse(raw)
    return { slug: data.slug as string, publishDate: data.publishDate as string }
  })
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = loadBlogMeta()

  const blogPostEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://useforage.xyz/blog/${post.slug}`,
    lastModified: new Date(post.publishDate + 'T00:00:00Z'),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://useforage.xyz',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://useforage.xyz/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPostEntries,
  ]
}
