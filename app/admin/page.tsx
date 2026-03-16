import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import { getAllPosts } from '@/lib/posts'
import AdminActions from './AdminActions'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authed = await isAuthenticated()
  if (!authed) redirect('/admin/login')

  const posts = await getAllPosts()

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-xl tracking-tight" style={{ color: 'var(--ink)' }}>
              MONO
            </Link>
            <span className="text-xs px-2 py-0.5 border" style={{ color: 'var(--mid)', borderColor: 'var(--border)', letterSpacing: '0.06em' }}>
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/posts/new"
              className="text-xs px-4 py-2 transition-opacity hover:opacity-70"
              style={{ background: 'var(--ink)', color: 'var(--paper)', letterSpacing: '0.08em' }}
            >
              + NEW POST
            </Link>
            <AdminActions />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Posts', value: posts.length },
            { label: 'Published', value: posts.filter(p => p.published).length },
            { label: 'Drafts', value: posts.filter(p => !p.published).length },
          ].map((stat, i) => (
            <div key={i} className="border p-6 fade-up" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--mid)', letterSpacing: '0.06em' }}>
                {stat.label.toUpperCase()}
              </p>
              <p className="font-display" style={{ fontSize: '2.4rem', color: 'var(--ink)', lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Posts table */}
        <div className="border" style={{ borderColor: 'var(--border)' }}>
          <div
            className="grid text-xs px-5 py-3 border-b"
            style={{
              gridTemplateColumns: '1fr 100px 80px 120px',
              borderColor: 'var(--border)',
              color: 'var(--mid)',
              letterSpacing: '0.06em',
              background: 'rgba(0,0,0,0.02)'
            }}
          >
            <span>TITLE</span>
            <span>DATE</span>
            <span>STATUS</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {posts.length === 0 ? (
            <div className="px-5 py-10 text-center text-xs" style={{ color: 'var(--mid)' }}>
              No posts yet. <Link href="/admin/posts/new" className="underline">Create your first post.</Link>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="grid items-center px-5 py-4 border-b last:border-b-0 hover:bg-black/[0.02] transition-colors"
                style={{ gridTemplateColumns: '1fr 100px 80px 120px', borderColor: 'var(--border)' }}
              >
                <div>
                  <p className="text-sm font-medium truncate pr-4" style={{ color: 'var(--ink)' }}>
                    {post.title}
                  </p>
                  {post.tags.length > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--mid)' }}>
                      {post.tags.map(t => `#${t}`).join(' ')}
                    </p>
                  )}
                </div>
                <span className="text-xs" style={{ color: 'var(--mid)' }}>
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                </span>
                <span
                  className="text-xs"
                  style={{ color: post.published ? 'var(--ink)' : 'var(--mid)' }}
                >
                  {post.published ? '● live' : '○ draft'}
                </span>
                <div className="flex items-center gap-3 justify-end">
                  {post.published && (
                    <Link
                      href={`/posts/${post.slug}`}
                      target="_blank"
                      className="text-xs hover:opacity-60 transition-opacity"
                      style={{ color: 'var(--mid)' }}
                    >
                      view
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/edit?id=${post.id}`}
                    className="text-xs hover:opacity-60 transition-opacity"
                    style={{ color: 'var(--ink)' }}
                  >
                    edit
                  </Link>
                  <DeleteButton id={post.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={`/api/posts/${id}`} method="POST">
      <button
        type="button"
        onClick={async () => {
          if (!confirm('Delete this post?')) return
          await fetch(`/api/posts/${id}`, { method: 'DELETE' })
          window.location.reload()
        }}
        className="text-xs hover:opacity-60 transition-opacity"
        style={{ color: '#c00' }}
      >
        delete
      </button>
    </form>
  )
}
