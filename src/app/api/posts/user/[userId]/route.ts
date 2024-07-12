// src/app/api/posts/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPostsByUserId } from '../../../../../../database/posts';

interface CustomRequest extends NextRequest {
  params: {
    userId: string;
  };
}

export async function GET(request: CustomRequest) {
  const userId = parseInt(request.params.userId, 10);
  const posts = await getPostsByUserId(userId);
  return NextResponse.json(posts);
}
