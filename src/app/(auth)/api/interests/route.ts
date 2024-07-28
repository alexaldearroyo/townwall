import { NextResponse } from 'next/server';
import {
  findOrCreateCategory,
  addUserCategory,
  getUserCategories,
  removeUserCategory,
} from '../../../../../database/categories';
import { getSessionByToken } from '../../../../../database/sessions';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryName } = body;

    const sessionToken = request.cookies.get('session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSessionByToken(sessionToken.value);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;
    const category = await findOrCreateCategory(categoryName);

    if (category) {
      await addUserCategory(userId, category.id);
    }

    const userCategories = await getUserCategories(userId);
    return NextResponse.json({ categories: userCategories });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryName, userId } = body;

    const sessionToken = request.cookies.get('session');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSessionByToken(sessionToken.value);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = await findOrCreateCategory(categoryName);
    if (category) {
      await removeUserCategory(userId, category.id.toString());
    }

    const userCategories = await getUserCategories(userId);
    return NextResponse.json({ categories: userCategories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
