import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { site } from '@/lib/site'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

// Behind Hostinger's reverse proxy the request's own URL resolves to the internal
// localhost:3000 - so redirects built from req.url would send admins there. In
// production redirect against the canonical site URL; in dev use the request origin.
function baseUrl(req: NextRequest): string {
  return process.env.NODE_ENV === 'production' ? site.url : req.nextUrl.origin
}

export default auth((req: NextRequest & { auth: { user?: { email?: string | null } } | null }) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  const userEmail    = req.auth?.user?.email ?? null
  const isLoggedIn   = !!userEmail
  const isAdmin      = isLoggedIn && userEmail === ADMIN_EMAIL

  // Redirect unauthenticated users away from protected admin routes
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', baseUrl(req)))
  }

  // Block authenticated non-admin users (wrong Google account)
  if (isAdminRoute && !isLoginPage && isLoggedIn && !isAdmin) {
    const url = new URL('/admin/login', baseUrl(req))
    url.searchParams.set('error', 'AccessDenied')
    return NextResponse.redirect(url)
  }

  // Already logged in → skip login page
  if (isLoginPage && isAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', baseUrl(req)))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
