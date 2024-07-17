import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../database/sessions';
import { followUser, unfollowUser } from '../../../../../database/follows';
import { sql } from '../../../../../database/connect';

export async function POST(request: NextRequest) {
  const { followerId, followedId } = await request.json();
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  const session = await getSessionByToken(sessionToken);
  if (!session || session.userId !== followerId) {
    return NextResponse.json(
      { error: 'Invalid session or follower ID' },
      { status: 401 },
    );
  }

  await followUser(followerId, followedId);
  return NextResponse.json(
    { message: 'Followed successfully' },
    { status: 200 },
  );
}

export async function DELETE(request: NextRequest) {
  const { followerId, followedId } = await request.json();
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  const session = await getSessionByToken(sessionToken);
  if (!session || session.userId !== followerId) {
    return NextResponse.json(
      { error: 'Invalid session or follower ID' },
      { status: 401 },
    );
  }

  await unfollowUser(followerId, followedId);
  return NextResponse.json(
    { message: 'Unfollowed successfully' },
    { status: 200 },
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const followerId = parseInt(url.searchParams.get('followerId') || '0', 10);
  const followedId = parseInt(url.searchParams.get('followedId') || '0', 10);

  if (!followerId || !followedId) {
    return NextResponse.json(
      { error: 'Follower ID and Followed ID are required' },
      { status: 400 },
    );
  }

  const [result] = await sql<{ '?column?': number }[]>`
    SELECT
      1
    FROM
      follows
    WHERE
      follower_id = ${followerId}
      AND followed_id = ${followedId}
    LIMIT
      1
  `;

  const isFollowing = result !== undefined;
  return NextResponse.json({ isFollowing }, { status: 200 });
}
