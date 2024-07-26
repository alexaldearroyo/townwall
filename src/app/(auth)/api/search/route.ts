import { NextRequest, NextResponse } from 'next/server';
import { getCategoryByName } from '../../../../../database/categories';
import { getPostsByCategory } from '../../../../../database/posts';
import { getUsersByCategory } from '../../../../../database/users';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const category = await getCategoryByName(query);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 },
      );
    }

    const posts = await getPostsByCategory(category.id);
    const users = await getUsersByCategory(category.id);

    return NextResponse.json({ posts, users });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
