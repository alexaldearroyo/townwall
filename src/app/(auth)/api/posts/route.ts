// src/app/(auth)/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../database/sessions';
import { createPost } from '../../../../../database/posts';

export async function POST(request: NextRequest): Promise<NextResponse> {
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
      return NextResponse.json({ error: 'Session not valid' }, { status: 401 });
    }

    const { title, content, icon, categoryId } = await request.json();
    const post = await createPost(
      session.userId,
      title,
      content,
      icon,
      categoryId,
    );

    return NextResponse.json(
      { ...post, userId: session.userId },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
