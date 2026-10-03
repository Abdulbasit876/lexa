import type { NextAuthConfig } from 'next-auth'

// A localhost AUTH_URL/NEXTAUTH_URL (copied from .env.example) makes Auth.js
// redirect deployed users to localhost. With trustHost enabled the request host
// is used instead, which is correct both locally and on Netlify.
for (const key of ['AUTH_URL', 'NEXTAUTH_URL'] as const) {
  if (/\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(process.env[key] ?? '')) {
    delete process.env[key]
  }
}

// Edge/middleware-safe Auth.js config: no Prisma or other Node-only imports.
// The full config in auth.ts adds the Prisma adapter and credentials provider.
export const authConfig = {
  session: { strategy: 'jwt' },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.role = (user as any).role
        token.username = (user as any).username
        token.studentId = (user as any).studentId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'ADMIN' | 'STUDENT'
        session.user.username = token.username as string
        session.user.studentId = token.studentId as string | null
      }
      return session
    },
  },
} satisfies NextAuthConfig
