import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export default auth((req: NextRequest & { auth: { user?: { email?: string | null } } | null }) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  const userEmail    = req.auth?.user?.email ?? null
  const isLoggedIn   = !!userEmail
  const isAdmin      = isLoggedIn && userEmail === ADMIN_EMAIL

  // Redirect unauthenticated users away from protected admin routes
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Block authenticated non-admin users (wrong Google account)
  if (isAdminRoute && !isLoginPage && isLoggedIn && !isAdmin) {
    const url = new URL('/admin/login', req.url)
    url.searchParams.set('error', 'AccessDenied')
    return NextResponse.redirect(url)
  }

  // Already logged in → skip login page
  if (isLoginPage && isAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
