import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    
    const token = req.nextauth.token
    const isAuth = !!token
    const isHomePage = req.nextUrl.pathname === '/'

    // กรณี: ล็อกอินแล้ว แต่ดันกลับมาหน้าแรก (/) -> ดีดไปหน้า Dashboard ตาม Role
    if (isAuth && isHomePage) {
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url))
      } else {
        return NextResponse.redirect(new URL('/user', req.url))
      }
    }
    
    //ป้องกัน User ธรรมดา แอบเข้าหน้า Admin
    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/user', req.url))
    }
    //ป้องกัน admin เข้าหน้า user
    if (req.nextUrl.pathname.startsWith('/user') && token?.role ==='admin') {
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/') {
          return true 
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/', '/admin/:path*', '/user/:path*']
}