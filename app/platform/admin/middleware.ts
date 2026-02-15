import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 1. Verifica a sessão
  const { data: { session } } = await supabase.auth.getSession()

  // 2. Proteção da rota /platform/admin
  if (request.nextUrl.pathname.startsWith('/platform/admin')) {
    // Ignora a página de login para não dar loop infinito
    if (request.nextUrl.pathname === '/platform/admin/login') {
      return response
    }

    if (!session) {
      return NextResponse.redirect(new URL('/platform/admin/login', request.url))
    }

    // 3. Verifica se é ADMIN na tabela de profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'ADMIN') {
      // Se não for admin, desloga por segurança e manda pro login
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/platform/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/platform/admin/:path*'],
}