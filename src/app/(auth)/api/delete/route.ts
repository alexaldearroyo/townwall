// src/app/(auth)/api/delete/route.ts

import { NextResponse } from 'next/server';
import { getUserById, deleteUserById } from '../../../../../database/users';
import {
  getSessionByToken,
  deleteSessionByToken,
} from '../../../../../database/sessions';

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = new Map(
    cookieHeader?.split(';').map((cookie) => {
      const [name, ...valueParts] = cookie.trim().split('=');
      return [name, valueParts.join('=')];
    }),
  );

  const sessionToken = cookies.get('session');

  if (!sessionToken) {
    return NextResponse.json(
      { errors: [{ message: 'No session token found' }] },
      { status: 400 },
    );
  }

  const session = await getSessionByToken(sessionToken);

  if (!session) {
    return NextResponse.json(
      { errors: [{ message: 'Invalid session token' }] },
      { status: 401 },
    );
  }

  const user = await getUserById(session.userId);

  await deleteUserById(user.id);
  await deleteSessionByToken(sessionToken);

  const response = NextResponse.json({ message: 'User deleted successfully' });
  response.headers.set('Set-Cookie', 'session=; Max-Age=0; Path=/');

  return response;
}
