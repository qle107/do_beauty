import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export const { handlers, auth, signIn, signOut } = NextAuth({
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

    // Forward email + isAdmin to the session object.
    session({ session, token }) {
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
