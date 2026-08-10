import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Self-hosted behind Cloudflare/Hostinger: trust the forwarded host so auth URLs
  // (OAuth callback, redirects) use the real domain, not the internal localhost:3000.
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Block anyone whose Google account email is not the admin email.
    signIn({ user }) {
      if (!ADMIN_EMAIL) {
        console.error('[auth] ADMIN_EMAIL env var is not set - blocking all logins')
        return false
      }
      return user.email === ADMIN_EMAIL
    },

    // Expose email + isAdmin flag on the JWT.
    jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name  = user.name
        token.picture = user.image
        token.isAdmin = user.email === ADMIN_EMAIL
      }
      return token
    },

    // Forward email + isAdmin to the session object - and re-verify the token's
    // email is STILL the admin. If ADMIN_EMAIL was rotated (owner changed, or the
    // admin's Google account was compromised and locked out), any pre-rotation JWT
    // is invalidated here: the identity is stripped so every auth()-gated API route
    // (which checks `!session?.user`) rejects it, not just the admin pages.
    session({ session, token }) {
      if (!ADMIN_EMAIL || token.email !== ADMIN_EMAIL) {
        // Clear identity so every `!session?.user` guard rejects this stale token.
        session.user = undefined as unknown as typeof session.user
        return session
      }
      if (session.user) {
        session.user.email   = token.email as string
        session.user.name    = token.name  as string
        session.user.image   = token.picture as string
        // @ts-expect-error - custom field not in default Session type
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },

    // Allow access only to authenticated admins on /admin/* routes.
    authorized({ auth: session, request: { nextUrl } }) {
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage  = nextUrl.pathname === '/admin/login'
      const isLoggedIn   = !!session?.user

      if (isAdminRoute && !isLoginPage) {
        return isLoggedIn
      }
      return true
    },
  },
})

/**
 * Server-side admin gate for route handlers. Returns the session only for the
 * authenticated admin (email === ADMIN_EMAIL), else null - mirroring the page
 * guard in app/admin/(protected)/layout.tsx. Existing routes also benefit from
 * the session() callback above, which already strips a non-admin/stale identity.
 */
export async function requireAdmin() {
  const session = await auth()
  if (!ADMIN_EMAIL || !session?.user || session.user.email !== ADMIN_EMAIL) return null
  return session
}
