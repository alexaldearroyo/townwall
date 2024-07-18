import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../database/sessions';
import {
  createComment,
  getCommentsByPostId,
} from '../../../../database/comments';

export async function POST(request: NextRequest) {
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

  const { postId, content } = await request.json();

  if (!postId || !content) {
    return NextResponse.json(
      { error: 'Post ID and content are required' },
      { status: 400 },
    );
  }

  const comment = await createComment(postId, session.userId, content);
  return NextResponse.json(comment, { status: 201 });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  const comments = await getCommentsByPostId(parseInt(postId, 10));
  return NextResponse.json(comments);
}
