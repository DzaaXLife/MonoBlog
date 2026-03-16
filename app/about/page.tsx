import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About this blog.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
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

      <main className="max-w-2xl mx-auto px-6 py-16 fade-up">
        <h1 className="font-display mb-8" style={{ fontSize: '2.6rem', letterSpacing: '-0.03em', color: 'var(--ink)' }}>
          About
        </h1>
        <div className="prose-mono">
          <p>
            MONO is a minimalist writing space. The name refers not just to the monochromatic palette
            but to the idea of a single, sustained voice — one perspective, offered without distraction.
          </p>
          <p>
            The design is intentional. No images. No sidebar. No recommended posts. Just writing.
          </p>
          <p>
            If you want to get in touch, you know where to find me.
          </p>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto px-6 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--mid)' }}>
          <span>MONO © {new Date().getFullYear()}</span>
          <Link href="/admin" className="hover:text-black transition-colors">admin</Link>
        </div>
      </footer>
    </div>
  )
}
