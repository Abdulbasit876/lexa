import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const { pathname } = req.nextUrl

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  // Protect Student Dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
  }

  // Redirect authenticated users away from /login
  if (pathname === '/login' && isLoggedIn) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
}
