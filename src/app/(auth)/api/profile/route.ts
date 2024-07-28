import { NextResponse } from 'next/server';
import {
  getUserById,
  updateUserProfile,
  UserProfile,
} from '../../../../../database/users';
import { getSessionByToken } from '../../../../../database/sessions';
import { z } from 'zod';
import { NextRequest } from 'next/server';

const profileSchema = z.object({
  fullName: z.string().optional(),
  description: z.string().optional(),
  interests: z.string().optional(),
  profileLinks: z.string().optional(),
  userImage: z.string().optional(),
  // location: z.string().optional(),
  birthdate: z.string().optional(),
  profession: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.issues },
        { status: 400 },
      );
    }

    const sessionCookie = request.cookies.get('session');
    const sessionToken = sessionCookie ? sessionCookie.value : null;

    if (!sessionToken) {
      return NextResponse.json(
        { errors: [{ message: 'Not authenticated' }] },
        { status: 401 },
      );
    }

    const session = await getSessionByToken(sessionToken);
    if (!session) {
      return NextResponse.json(
        { errors: [{ message: 'Invalid session token' }] },
        { status: 401 },
      );
    }

    const interestsArray = result.data.interests
      ? JSON.parse(result.data.interests)
      : [];
    const updatedUser = await updateUserProfile(session.userId, {
      ...result.data,
      interests: interestsArray,
    } as Partial<UserProfile>);

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: [{ message: 'Internal server error' }] },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    const sessionToken = sessionCookie ? sessionCookie.value : null;

    if (!sessionToken) {
      return NextResponse.json(
        { errors: [{ message: 'Not authenticated' }] },
        { status: 401 },
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

    console.log(user);

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: [{ message: 'Internal server error' }] },
      { status: 500 },
    );
  }
}
