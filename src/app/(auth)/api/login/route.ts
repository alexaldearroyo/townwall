import { NextResponse } from 'next/server';
import { getUserByUsernameOrEmail } from '../../../../../database/users'; // Cambiado
import { createSession } from '../../../../../database/sessions';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import type { User } from '../../../../../database/users';

type LoginResponseBodyPost = { user: User } | { errors: { message: string }[] };

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(3),
});

export async function POST(
  request: Request,
): Promise<NextResponse<LoginResponseBodyPost>> {
  try {
    const body = await request.json();
    console.log('Received login request:', body);

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      console.log('Validation failed:', result.error.issues);
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 },
      );
    }

    const user = await getUserByUsernameOrEmail(result.data.identifier); // Cambiado

    if (!user) {
      console.log('User not found:', result.data.identifier);
      return NextResponse.json(
        { errors: [{ message: 'Invalid username or password' }] },
        { status: 401 },
      );
    }

    // Add a log to verify the result of bcrypt.compare
    const passwordMatch = await bcrypt.compare(
      result.data.password,
      user.passwordHash,
    );
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('Password mismatch for user:', result.data.identifier);
      return NextResponse.json(
        { errors: [{ message: 'Invalid username or password' }] },
        { status: 401 },
      );
    }

    const session = await createSession(user.id);

    console.log('Session created:', session);

    const response = NextResponse.json(
      { user: { ...user, slug: user.slug } },
      { status: 200 },
    );
    response.cookies.set('session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { errors: [{ message: 'Internal server error' }] },
      { status: 500 },
    );
  }
}
