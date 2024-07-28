import { NextRequest, NextResponse } from 'next/server';
import { getFollowersByUsername } from '../../../../../database/follows';

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
    const followers = await getFollowersByUsername(username);
    return NextResponse.json(followers);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
