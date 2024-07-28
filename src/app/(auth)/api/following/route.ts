import { NextRequest, NextResponse } from 'next/server';
import { getFollowingUsersByUsername } from '../../../../../database/follows';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 },
    );
  }

  try {
    const followingUsers = await getFollowingUsersByUsername(username);
    return NextResponse.json(followingUsers);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
