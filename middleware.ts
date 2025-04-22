import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Rotas públicas que não exigem autenticação
const publicRoutes = ['/login', '/register', '/']

export async function middleware(req: NextRequest) {
  // Criar o cliente do Supabase
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Verificar sessão para determinar se o usuário está logado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Obter o path atual da requisição
  const path = req.nextUrl.pathname

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith('/api/'))
  
  // Se o usuário não estiver logado e a rota não for pública, redirecionar para login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário estiver logado e tentar acessar login/register, redirecionar para dashboard
  if (session && (path === '/login' || path === '/register')) {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }
  
  return res
}

// Configurar quais rotas o middleware deve executar
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
} 