// src/app/(auth)/api/logout/route.ts
import { deleteSessionByToken } from '../../../../../database/sessions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { errors: [{ message: 'No session token found' }] },
      { status: 400 },
    );
  }

  await deleteSessionByToken(sessionToken);

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('session', '', { maxAge: -1 });

  return response;
}
