// src/app/api/posts/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPostsByUserId } from '../../../../../../database/posts';
import { getSessionByToken } from '../../../../../../database/sessions';

interface CustomRequest extends NextRequest {
  params: {
    userId: string;
  };
}

export async function GET(request: CustomRequest) {
  const userId = parseInt(request.params.userId, 10);
  const posts = await getPostsByUserId(userId);
  return NextResponse.json(posts);
}

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
    return NextResponse.json({ error: 'Session not valid' }, { status: 401 });
  }

  const { title, content } = await request.json();
  const post = await createPost(session.userId, title, content);

  return NextResponse.json(post);
}
