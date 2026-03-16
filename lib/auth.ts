import { cookies } from 'next/headers'

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'monoblog2024'
const SESSION_SECRET = process.env.SESSION_SECRET || 'mono-secret-key-change-in-production'
const SESSION_COOKIE = 'mono_session'

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS
}

export function createSession(): string {
  const token = Buffer.from(`${SESSION_SECRET}:${Date.now()}`).toString('base64')
  return token
}

export function validateSession(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return decoded.startsWith(SESSION_SECRET + ':')
  } catch {
    return false
  }
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value || null
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  return validateSession(session)
}

export { SESSION_COOKIE }
