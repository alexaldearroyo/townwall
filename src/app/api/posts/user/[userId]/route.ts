// src/app/api/posts/user/[userId]/route.ts
import { NextResponse } from 'next/server';
import { getPostsByUserId } from '../../../../../../database/posts';

export async function GET({ params }: { params: any }) {
  const userId = parseInt(params.userId, 10);
  const posts = await getPostsByUserId(userId);
  return NextResponse.json(posts);
}
