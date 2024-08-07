import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../database/sessions';
import { createPost, getPostsByUserId } from '../../../../../database/posts';
import {
  addPostCategories,
  findOrCreateCategory,
  getPostCategories,
} from '../../../../../database/categories';

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

    const categoriesArray = Array.isArray(categoryNames) ? categoryNames : [];

    const post = await createPost(session.userId, title, content, slug, icon);

    const categoryIds = await Promise.all(
      categoriesArray.map(async (categoryName) => {
        const category = await findOrCreateCategory(categoryName);
        if (category) {
          return category.id;
        }
        return null;
      }),
    );

    await addPostCategories(
      post.id,
      categoryIds.filter((id): id is number => id !== null),
    );

    return NextResponse.json(
      { ...post, userId: session.userId, categoryIds },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const posts = await getPostsByUserId(parseInt(userId, 10));

    const postsWithCategories = await Promise.all(
      posts.map(async (post) => {
        const categories = await getPostCategories(post.id);
        return { ...post, categories };
      }),
    );

    return NextResponse.json(postsWithCategories);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
