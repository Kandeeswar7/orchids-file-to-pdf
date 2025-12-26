
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. If at root '/', explicitly do nothing so (marketing)/page.tsx renders
  // (Next.js handles (marketing) as root automatically)
  
  // 2. Protected Routes Logic (Mock for now, can expanded later)
  // If user tries to go to /convert or /dashboard and has no session (mock), redirect to login
  // Note: We don't have real "cookies" for auth in this demo yet, so we rely on client-side protection mainly.
  // But strictly speaking, middleware can't see client-side localStorage/context.
  // So for this demo, we will largely be Permissive in middleware and Strict in Client Components.
  
  // However, we can enforce:
  // If user goes to / (Landing), let them see it.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
