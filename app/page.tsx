import Link from 'next/link'
import { getPublishedPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const posts = await getPublishedPosts()

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

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 py-16 fade-up">
        <p className="text-xs mb-3" style={{ color: 'var(--mid)', letterSpacing: '0.12em' }}>
          EST. {new Date().getFullYear()}
        </p>
        <h1 className="font-display mb-4" style={{ fontSize: '3rem', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
          Ideas, stripped<br />to their bones.
        </h1>
        <p className="text-sm" style={{ color: 'var(--mid)', maxWidth: '38ch' }}>
          A quiet space for long-form writing. No noise. No color. Just words.
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="border-t" style={{ borderColor: 'var(--border)' }} />
      </div>

      {/* Posts */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--mid)' }}>No posts yet.</p>
        ) : (
          <ul className="space-y-0">
            {posts.map((post, i) => (
              <li
                key={post.id}
                className={`fade-up fade-up-${Math.min(i + 1, 5)} border-b py-8`}
                style={{ borderColor: 'var(--border)' }}
              >
                <Link href={`/posts/${post.slug}`} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs mb-3" style={{ color: 'var(--mid)', letterSpacing: '0.08em' }}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {post.tags.length > 0 && (
                          <span className="ml-3">
                            {post.tags.map(t => `#${t}`).join(' ')}
                          </span>
                        )}
                      </p>
                      <h2
                        className="font-display mb-2 group-hover:opacity-60 transition-opacity"
                        style={{ fontSize: '1.5rem', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--ink)' }}
                      >
                        {post.title}
                      </h2>
                      <p className="text-sm" style={{ color: 'var(--mid)', lineHeight: 1.65 }}>
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="text-xs mt-1 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--mid)' }}>
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-6 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--mid)' }}>
          <span>MONO © {new Date().getFullYear()}</span>
          <Link href="/admin" className="hover:text-black transition-colors">
            admin
          </Link>
        </div>
      </footer>
    </div>
  )
}
