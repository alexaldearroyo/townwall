import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '../../../../../../database/users';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const { username } = params;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
