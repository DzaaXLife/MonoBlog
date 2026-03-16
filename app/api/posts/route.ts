import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/posts'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const posts = await getAllPosts()
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, slug, excerpt, content, published, tags } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const post = await createPost({ title, slug, excerpt, content, published: !!published, tags: tags || [] })
  return NextResponse.json(post, { status: 201 })
}
