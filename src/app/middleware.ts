import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionByToken } from '../../database/sessions';
import { getUserById } from '../../database/users';

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.redirect('/login');
  }

  const session = await getSessionByToken(sessionToken);

  if (!session) {
    return NextResponse.redirect('/login');
  }

  const user = await getUserById(session.userId);

  const pathname = request.nextUrl.pathname;

  // Check if the user is trying to access the profile of another user
  const editProfileMatch = pathname.match(/^\/profile\/edit$/);
  if (editProfileMatch && user.id !== session.userId) {
    return NextResponse.redirect(`/profile/${user.username}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'], // Protected routes
};
