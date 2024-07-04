// src/app/(auth)/api/login/route.ts

import { NextResponse } from 'next/server';
import { getUserByUsername } from '../../../../../database/users';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import type { User } from '../../../../../database/users';

type LoginResponseBodyPost = { user: User } | { errors: { message: string }[] };

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export async function POST(
  request: Request,
): Promise<NextResponse<LoginResponseBodyPost>> {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 },
      );
    }

    const user = await getUserByUsername(result.data.username);

    if (!user) {
      return NextResponse.json(
        { errors: [{ message: 'Invalid username or password' }] },
        { status: 401 },
      );
    }

    const passwordMatch = user.passwordHash
      ? await bcrypt.compare(result.data.password, user.passwordHash)
      : false;

    if (!passwordMatch) {
      return NextResponse.json(
        { errors: [{ message: 'Invalid username or password' }] },
        { status: 401 },
      );
    }

    // Example using NextResponse cookie setting
    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set('session', 'your-session-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: [{ message: 'Internal server error' }] },
      { status: 500 },
    );
  }
}
