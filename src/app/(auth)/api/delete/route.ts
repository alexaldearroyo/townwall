// src/app/(auth)/api/delete/route.ts

import { NextResponse } from 'next/server';
import { getUserById, deleteUserById } from '../../../../../database/users';
import {
  getSessionByToken,
  deleteSessionByToken,
} from '../../../../../database/sessions';

import { Request } from 'express';

export async function POST(request: Request) {
  const sessionToken = request.cookies.get('session')?.value;

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

  if (!user) {
    return NextResponse.json(
      { errors: [{ message: 'User not found' }] },
      { status: 404 },
    );
  }

  await deleteUserById(user.id);
  await deleteSessionByToken(sessionToken);

  const response = NextResponse.json({ message: 'User deleted successfully' });
  response.cookies.set('session', '', { maxAge: -1 });

  return response;
}
