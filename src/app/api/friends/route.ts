import { NextRequest, NextResponse } from 'next/server';
import {
  getFollowersWithLocation,
  getFollowingWithLocation,
} from '../../../../database/follows';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const followers = await getFollowersWithLocation(Number(userId));
    const following = await getFollowingWithLocation(Number(userId));
    const allFriends = [...followers, ...following].map((friend) => ({
      ...friend,
      location: friend.location as string,
    }));
    return NextResponse.json(allFriends);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 },
    );
  }
}
