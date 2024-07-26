import { NextRequest, NextResponse } from 'next/server';
import { getPostsByUserId } from '../../../../../../database/posts';
import { getPostCategories } from '../../../../../../database/categories';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const posts = await getPostsByUserId(userId);

    const postsWithCategories = await Promise.all(
      posts.map(async (post) => {
        const categories = await getPostCategories(post.id);
        return { ...post, categories };
      }),
    );

    return NextResponse.json(postsWithCategories);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
