/**
 * lib/posts.ts — Supabase PostgreSQL storage
 *
 * Setup:
 * 1. Jalankan SQL di supabase/schema.sql di Supabase SQL Editor
 * 2. npm install @supabase/supabase-js
 * 3. Isi env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  published: boolean
  tags: string[]
}

interface PostRow {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  published: boolean
  tags: string[]
  created_at: string
}

function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    published: row.published,
    tags: row.tags ?? [],
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw new Error(`getAllPosts: ${error.message}`)
  return (data as PostRow[]).map(rowToPost)
}

export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })
  if (error) throw new Error(`getPublishedPosts: ${error.message}`)
  return (data as PostRow[]).map(rowToPost)
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return undefined
  return rowToPost(data as PostRow)
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return undefined
  return rowToPost(data as PostRow)
}

export async function createPost(input: Omit<Post, 'id' | 'date'>): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      published: input.published,
      tags: input.tags,
      date: new Date().toISOString().split('T')[0],
    }])
    .select()
    .single()
  if (error || !data) throw new Error(`createPost: ${error?.message}`)
  return rowToPost(data as PostRow)
}

export async function updatePost(id: string, input: Partial<Post>): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.published !== undefined && { published: input.published }),
      ...(input.tags !== undefined && { tags: input.tags }),
    })
    .eq('id', id)
    .select()
    .single()
  if (error || !data) return null
  return rowToPost(data as PostRow)
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
  return !error
}
