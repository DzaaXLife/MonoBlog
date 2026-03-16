import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'mono_session'
const SESSION_SECRET = process.env.SESSION_SECRET || 'mono-secret-key-change-in-production'

function validateSession(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return decoded.startsWith(SESSION_SECRET + ':')
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (!token || !validateSession(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protect API routes (except auth)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (!token || !validateSession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*'],
}
