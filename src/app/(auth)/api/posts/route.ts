import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../database/sessions';
import {
  createPost,
  addPostCategories,
  getPostsByUserId,
} from '../../../../../database/posts';

// Create Post
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

    const { title, content, slug, icon, categoryNames } = await request.json();

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 },
      );
    }

    const post = await createPost(session.userId, title, content, slug, icon);

    if (categoryNames && categoryNames.length > 0) {
      await addPostCategories(post.id, categoryNames);
    }

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

// Obtain Posts by User
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const posts = await getPostsByUserId(parseInt(userId, 10));
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
