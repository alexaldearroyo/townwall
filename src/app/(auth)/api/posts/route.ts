import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../database/sessions';
import { createPost, getPostsByUserId } from '../../../../../database/posts';
import { addPostCategories } from '../../../../../database/categories';

// Crear Post
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

    // Verifica que categoryNames esté definido y sea un array
    const categoriesArray = Array.isArray(categoryNames) ? categoryNames : [];

    // Crear nuevas categorías y obtener sus IDs
    const newCategoryResponses = await Promise.all(
      categoriesArray.map(async (categoryName) => {
        const response = await fetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify({ categoryName, description: '' }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.category || !jsonResponse.category.id) {
          console.error('Invalid category response:', jsonResponse);
          throw new Error('Invalid category response');
        }
        return jsonResponse.category.id;
      }),
    );

    const post = await createPost(
      session.userId,
      title,
      content,
      slug,
      icon,
      newCategoryResponses,
    );

    return NextResponse.json(
      { ...post, userId: session.userId },
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

// Obtener Posts por Usuario
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
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
