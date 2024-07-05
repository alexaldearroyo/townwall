// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionByToken } from '../../database/sessions';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.redirect('/login');
  }

  const session = await getSessionByToken(sessionToken);

  if (!session) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile'], // Protected routes
};
