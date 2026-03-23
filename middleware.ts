import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes with Supabase session check
  if (pathname.startsWith('/admin')) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Not logged in → send to login page
    if (!user && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (user) {
      const role = (user.app_metadata?.role as string) ?? 'cashier'

      // Already logged in → skip login page, redirect based on role
      if (pathname === '/admin/login') {
        const dest = role === 'admin' ? '/admin/dashboard' : '/admin/pos'
        return NextResponse.redirect(new URL(dest, request.url))
      }

      // Cashier can only access /admin/pos
      if (role === 'cashier' && pathname !== '/admin/pos') {
        return NextResponse.redirect(new URL('/admin/pos', request.url))
      }
    }

    return supabaseResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
