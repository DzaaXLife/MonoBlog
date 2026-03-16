import { NextRequest, NextResponse } from 'next/server'
import { getPostById, updatePost, deletePost } from '@/lib/posts'
import { isAuthenticated } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Props) {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const post = await getPostById(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: Props) {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const updated = await updatePost(params.id, body)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: Props) {
  const authed = await isAuthenticated()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ok = await deletePost(params.id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
