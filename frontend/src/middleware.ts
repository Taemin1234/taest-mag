import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const tier = req.cookies.get('user-tier')?.value
  const token = req.cookies.get('token')?.value

   // /admin 이하 모든 경로에 대해
  if (pathname.startsWith('/admin')) {
    // 1) 로그인되지 않았으면 로그인 페이지로 리다이렉트
    if (!token) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/snowman/elsa'
      return NextResponse.redirect(loginUrl)
    }
    // 2) human이면 접근 불가 -> no-access로 리라이트
    if (tier === 'human') {
      const noAccessUrl = req.nextUrl.clone()
      noAccessUrl.pathname = '/no-access'
      return NextResponse.rewrite(noAccessUrl)
    }
    // 3) 그 외(admin 등)은 다음으로 통과
  }

  // 이미 로그인 되었을 때 관리자페이지로 리다이렉트
   if (pathname.startsWith('/snowman') && token) {
    const toAdmin = req.nextUrl.clone()
    toAdmin.pathname = '/admin'
    return NextResponse.redirect(toAdmin)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/snowman/:path*'],
}
