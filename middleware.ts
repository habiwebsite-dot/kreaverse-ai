import { NextResponse, type NextRequest } from 'next/server';

function readJwtPayload(token?: string) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('kreaverse_session')?.value;
  const payload = readJwtPayload(token);
  const { pathname } = request.nextUrl;

  const requiresAuth = ['/results', '/settings'];
  if (requiresAuth.some((path) => pathname.startsWith(path)) && !payload) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && payload?.role !== 'ADMIN') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/results/:path*', '/settings/:path*'],
};
