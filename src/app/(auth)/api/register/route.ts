import { NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '../../../../../database/users';
import { createSession } from '../../../../../database/sessions';
import { z } from 'zod';
import type { User } from '../../../../../database/users';

type RegisterResponseBodyPost =
  | { user: User }
  | { errors: { message: string }[] };

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
  email: z.string().email(),
  latitude: z.number(),
  longitude: z.number(),
});

export async function POST(
  request: Request,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  try {
    const body = await request.json();
    const result = userSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          errors: result.error.issues.map((issue) => ({
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { username, password, email, latitude, longitude } = result.data;

    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return NextResponse.json(
        { errors: [{ message: 'Username already taken' }] },
        { status: 409 },
      );
    }

    const profileId = Math.floor(Math.random() * 1000); // Generate a profile ID
    const slug = username.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(); // Generate a slug

    const user = await createUser(username, password, email, profileId, slug, {
      x: longitude,
      y: latitude,
    });

    // Create a session for the new user
    const session = await createSession(user.id);

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set('session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 12, // 12 hours
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
