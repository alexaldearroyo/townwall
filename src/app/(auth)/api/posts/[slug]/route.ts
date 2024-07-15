import { NextRequest, NextResponse } from 'next/server';
import { getPostByUserAndId } from '../../../../../database/posts';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { slug } = request.query;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const post = await getPostByUserAndId(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
