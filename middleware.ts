import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect license page from direct access
  if (pathname === '/license') {
    const referer = request.headers.get('referer')
    const userAgent = request.headers.get('user-agent')
    
    // Allow access from allowed domains
    const allowedDomains = [
      'https://thekingsbakerysl.com',
      'http://localhost:3000',
      'https://localhost:3000'
    ]
    
    const isFromAllowedDomain = allowedDomains.some(domain => 
      referer?.startsWith(domain)
    )
    
    // Check for admin access parameters
    const url = new URL(request.url)
    const adminKey = url.searchParams.get('admin')
    const timestamp = url.searchParams.get('t')
    
    // If no referer (direct access) and no admin key, redirect to home
    if (!referer && !adminKey) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // If admin key is provided, validate timestamp
    if (adminKey === 'alpha_dev_2024' && timestamp) {
      const currentTime = Date.now()
      const requestTime = parseInt(timestamp, 10)
      const timeDiff = currentTime - requestTime
      
      // If request is older than 5 minutes, redirect
      if (timeDiff > 300000) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  // Continue with normal request processing
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 