import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import { getPostById } from '@/lib/posts'
import PostForm from '../../PostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Post' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: { id?: string }
}

export default async function EditPostPage({ searchParams }: Props) {
  const authed = await isAuthenticated()
  if (!authed) redirect('/admin/login')

  const { id } = searchParams
  if (!id) notFound()

  const post = await getPostById(id)
  if (!post) notFound()

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/" className="font-display text-xl tracking-tight" style={{ color: 'var(--ink)' }}>
            MONO
          </Link>
          <span className="text-xs px-2 py-0.5 border" style={{ color: 'var(--mid)', borderColor: 'var(--border)', letterSpacing: '0.06em' }}>
            EDIT POST
          </span>
        </div>
      </header>
      <PostForm mode="edit" post={post} />
    </div>
  )
}
