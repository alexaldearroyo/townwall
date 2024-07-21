import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../database/sessions';
import { getFollowers } from '../../../../../database/follows';

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  const session = await getSessionByToken(sessionToken);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  const followers = await getFollowers(session.userId);

  return NextResponse.json(followers);
}
