'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminActions() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs hover:opacity-60 transition-opacity"
      style={{ color: 'var(--mid)' }}
    >
      sign out
    </button>
  )
}
