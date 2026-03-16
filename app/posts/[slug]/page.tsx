import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .split('\n\n')
    .map(para => {
      para = para.trim()
      if (!para) return ''
      if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<blockquote')) return para
      return `<p>${para.replace(/\n/g, '<br/>')}</p>`
    })
    .filter(Boolean)
    .join('\n')
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  if (!post || !post.published) {
    notFound()
  }

  const html = renderMarkdown(post.content)

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl tracking-tight" style={{ color: 'var(--ink)' }}>
            MONO
          </Link>
          <nav className="flex gap-6 text-xs" style={{ color: 'var(--mid)' }}>
            <Link href="/" className="hover:text-black transition-colors">writing</Link>
            <Link href="/about" className="hover:text-black transition-colors">about</Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-6 py-14 fade-up">
        {/* Meta */}
        <div className="mb-10">
          <p className="text-xs mb-5" style={{ color: 'var(--mid)', letterSpacing: '0.08em' }}>
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
            {post.tags.length > 0 && (
              <span className="ml-3">{post.tags.map(t => `#${t}`).join(' ')}</span>
            )}
          </p>
          <h1
            className="font-display mb-6"
            style={{ fontSize: '2.6rem', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--ink)' }}
          >
            {post.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--mid)', lineHeight: 1.7, maxWidth: '44ch' }}>
            {post.excerpt}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t mb-12" style={{ borderColor: 'var(--border)' }} />

        {/* Content */}
        <div
          className="prose-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {/* Back link */}
      <div className="max-w-2xl mx-auto px-6 pb-16 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/"
          className="text-xs hover:opacity-60 transition-opacity flex items-center gap-2"
          style={{ color: 'var(--ink)' }}
        >
          <span>←</span>
          <span>All writing</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-6 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--mid)' }}>
          <span>MONO © {new Date().getFullYear()}</span>
          <Link href="/admin" className="hover:text-black transition-colors">admin</Link>
        </div>
      </footer>
    </div>
  )
}
