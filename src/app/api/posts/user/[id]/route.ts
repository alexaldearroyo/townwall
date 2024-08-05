import { NextRequest, NextResponse } from 'next/server';
import {
  getPostsByUserId,
  updatePost,
  deletePostById,
  getPostById,
  updatePostCategories,
} from '../../../../../../database/posts';
import {
  getPostCategories,
  findOrCreateCategory,
} from '../../../../../../database/categories';
import { getSessionByToken } from '../../../../../../database/sessions';

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

export async function PATCH(request: NextRequest) {
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

    const { id, title, content, slug, categoryNames } = await request.json();

    if (!id || !title || !content || !slug) {
      return NextResponse.json(
        { error: 'ID, title, content, and slug are required' },
        { status: 400 },
      );
    }

    // Verify that the user is the author of the post
    const post = await getPostById(id);
    if (!post || post.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Not authorized to edit this post' },
        { status: 403 },
      );
    }

    // Update the post
    await updatePost(id, title, content, slug);

    // Update categories if necessary
    const categoryIds = await Promise.all(
      categoryNames.map(async (categoryName: string) => {
        const category = await findOrCreateCategory(categoryName);
        return category ? category.id : null;
      }),
    );

    // Remove current categories and add new ones
    await updatePostCategories(
      id,
      categoryIds.filter((id) => id !== null),
    );

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 },
      );
    }

    // Verify that the user is the author of the post
    const post = await getPostById(id);
    if (!post || post.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this post' },
        { status: 403 },
      );
    }

    await deletePostById(id);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
