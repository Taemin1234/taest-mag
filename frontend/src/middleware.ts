import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const tier = req.cookies.get('user-tier')?.value

  // /admin 이하 모든 경로에 대해 human 접근 차단
  if (req.nextUrl.pathname.startsWith('/admin') && tier === 'human') {
    // 리라이트로 대체 페이지 서빙
    const url = req.nextUrl.clone()
    url.pathname = '/no-access'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
