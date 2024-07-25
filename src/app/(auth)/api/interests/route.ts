import { NextResponse } from 'next/server';
import {
  createCategory,
  getCategoryByName,
  addUserCategory,
  getUserCategories,
  removeUserCategory,
} from '../../../../../database/categories';
import { getSessionByToken } from '../../../../../database/sessions';
import { NextRequest } from 'next/server';

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

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
    const titleCaseCategoryName = toTitleCase(categoryName);
    let category = await getCategoryByName(titleCaseCategoryName);

    if (!category) {
      category = await createCategory(titleCaseCategoryName);
    }

    await addUserCategory(userId, category.id);

    const userCategories = await getUserCategories(userId);
    return NextResponse.json({ categories: userCategories });
  } catch (error) {
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

    const titleCaseCategoryName = toTitleCase(categoryName);
    await removeUserCategory(userId, titleCaseCategoryName);

    const userCategories = await getUserCategories(userId);
    return NextResponse.json({ categories: userCategories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
