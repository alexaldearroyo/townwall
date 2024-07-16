import { NextRequest, NextResponse } from 'next/server';
import { getPostsByUserId } from '../../../../../../database/posts';

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
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
