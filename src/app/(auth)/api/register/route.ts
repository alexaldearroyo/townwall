import { NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '../../../../../database/users';
import { z } from 'zod';
import type { User } from '../../../../../database/users';

type RegisterResponseBodyPost =
  | { user: User }
  | { errors: { message: string }[] };

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export async function POST(
  request: Request,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  try {
    const body = await request.json();
    const result = userSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 },
      );
    }

    const existingUser = await getUserByUsername(result.data.username);

    if (existingUser) {
      return NextResponse.json(
        { errors: [{ message: 'Username already taken' }] },
        { status: 409 },
      );
    }

    const user = await createUser(result.data.username, result.data.password);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: [{ message: 'Internal server error' }] },
      { status: 500 },
    );
  }
}
