import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../../database/sessions';
import {
  createProfileComment,
  getCommentsByProfileUserId,
} from '../../../../../../database/profiles_comments';
import { getUserByUsername } from '../../../../../../database/users';

export async function POST(request: NextRequest) {
  try {
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

    const { content } = await request.json();
    const username = request.nextUrl.pathname.split('/')[3];

    if (!username || !content) {
      return NextResponse.json(
        { error: 'Username and content are required' },
        { status: 400 },
      );
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: `User with username ${username} not found` },
        { status: 404 },
      );
    }

    const comment = await createProfileComment(
      user.id,
      session.userId,
      content,
    );

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: `Failed to add comment: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split('/')[3];

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 },
      );
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: `User with username ${username} not found` },
        { status: 404 },
      );
    }

    const comments = await getCommentsByProfileUserId(user.id);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: `Failed to fetch comments: ${(error as any).message}` },
      { status: 500 },
    );
  }
}
