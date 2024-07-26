import { NextRequest, NextResponse } from 'next/server';
import {
  createCategory,
  getCategories,
  removePostCategory,
} from '../../../../../database/categories';

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { categoryName, description } = await request.json();
    const category = await createCategory(categoryName, description);
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { categoryName, postId } = await request.json();
    await removePostCategory(postId, categoryName);
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
