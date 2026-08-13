import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const OWNER_EMAIL = 'ricardods9512@gmail.com'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

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
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isStudentArea = pathname.startsWith('/portal')
  const isStudentPublicRoute = pathname === '/portal/login' || pathname === '/portal/signup'
  const isOwnerPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isPublicRoute = isStudentPublicRoute || isOwnerPublicRoute

  if (!user && isStudentArea && !isStudentPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal/login'
    return NextResponse.redirect(url)
  }

  if (!user && !isStudentArea && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const isOwner = user?.email === OWNER_EMAIL

  // Un alumno nunca debe ver el panel de administración del negocio.
  if (user && !isOwner && !isStudentArea) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal'
    return NextResponse.redirect(url)
  }

  if (user && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = isStudentPublicRoute && !isOwner ? '/portal' : '/'
    return NextResponse.redirect(url)
  }

  return response
}
