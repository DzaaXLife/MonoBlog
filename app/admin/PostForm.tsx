'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'

interface PostFormProps {
  post?: Post
  mode: 'create' | 'edit'
}

export default function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (mode === 'create') setSlug(autoSlug(value))
  }

  function renderPreview(text: string): string {
    return text
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .split('\n\n')
      .map(p => {
        p = p.trim()
        if (!p) return ''
        if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<blockquote')) return p
        return `<p>${p.replace(/\n/g, '<br/>')}</p>`
      })
      .filter(Boolean)
      .join('\n')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title,
      slug,
      excerpt,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      published,
    }

    const url = mode === 'edit' ? `/api/posts/${post!.id}` : '/api/posts'
    const method = mode === 'edit' ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
      setSaving(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <form onSubmit={handleSubmit}>
      {/* Toolbar */}
      <div
        className="sticky top-0 z-10 border-b flex items-center justify-between px-6 py-3"
        style={{ background: 'var(--paper)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="text-xs hover:opacity-60 transition-opacity"
            style={{ color: 'var(--mid)' }}
          >
            ← Back
          </button>
          <span className="text-xs" style={{ color: 'var(--mid)' }}>
            {wordCount} words
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs px-3 py-1.5 border transition-colors hover:opacity-70"
            style={{
              borderColor: 'var(--border)',
              color: preview ? 'var(--paper)' : 'var(--ink)',
              background: preview ? 'var(--ink)' : 'transparent',
            }}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--mid)' }}>
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              className="accent-black"
            />
            Publish
          </label>
          <button
            type="submit"
            disabled={saving}
            className="text-xs px-5 py-1.5 transition-opacity hover:opacity-70 disabled:opacity-40"
            style={{ background: 'var(--ink)', color: 'var(--paper)', letterSpacing: '0.08em' }}
          >
            {saving ? 'SAVING...' : mode === 'edit' ? 'UPDATE' : 'PUBLISH'}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-3 text-xs border-b" style={{ color: '#c00', borderColor: 'var(--border)', background: 'rgba(200,0,0,0.04)' }}>
          {error}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {preview ? (
          /* Preview Mode */
          <div className="fade-up">
            <p className="text-xs mb-4" style={{ color: 'var(--mid)', letterSpacing: '0.08em' }}>PREVIEW</p>
            <h1 className="font-display mb-4" style={{ fontSize: '2.6rem', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
              {title || 'Untitled'}
            </h1>
            {excerpt && (
              <p className="text-sm mb-8" style={{ color: 'var(--mid)', lineHeight: 1.7 }}>
                {excerpt}
              </p>
            )}
            <div className="border-t mb-10" style={{ borderColor: 'var(--border)' }} />
            <div
              className="prose-mono"
              dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
            />
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6 fade-up">
            {/* Title */}
            <div>
              <textarea
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Post title..."
                rows={2}
                required
                className="w-full resize-none outline-none font-display"
                style={{
                  fontSize: '2.2rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--ink)',
                  fontFamily: "'DM Serif Display', serif",
                }}
              />
            </div>

            <div className="border-t" style={{ borderColor: 'var(--border)' }} />

            {/* Slug */}
            <div className="flex items-center gap-3">
              <label className="text-xs shrink-0" style={{ color: 'var(--mid)', letterSpacing: '0.06em', width: '72px' }}>
                SLUG
              </label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="admin-input"
                placeholder="my-post-slug"
                required
              />
            </div>

            {/* Excerpt */}
            <div className="flex items-start gap-3">
              <label className="text-xs shrink-0 mt-2.5" style={{ color: 'var(--mid)', letterSpacing: '0.06em', width: '72px' }}>
                EXCERPT
              </label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                className="admin-input"
                placeholder="A short summary shown on the homepage..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3">
              <label className="text-xs shrink-0" style={{ color: 'var(--mid)', letterSpacing: '0.06em', width: '72px' }}>
                TAGS
              </label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="admin-input"
                placeholder="writing, philosophy, design (comma separated)"
              />
            </div>

            <div className="border-t" style={{ borderColor: 'var(--border)' }} />

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs" style={{ color: 'var(--mid)', letterSpacing: '0.06em' }}>
                  CONTENT (Markdown supported)
                </label>
                <div className="flex gap-2 text-xs" style={{ color: 'var(--mid)' }}>
                  <span>**bold**</span>
                  <span>*italic*</span>
                  <span>## heading</span>
                  <span>&gt; quote</span>
                </div>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="admin-textarea"
                placeholder={`Start writing...\n\nMarkdown is supported:\n\n## Heading\n\n**bold** and *italic*\n\n> Blockquote`}
                required
              />
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
