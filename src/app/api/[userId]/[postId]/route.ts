// src/app/api/posts/[userId]/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPostByUserAndId } from '../../../../../database/posts';

interface CustomRequest extends NextRequest {
  params: {
    userId: string;
    postId: string;
  };
}

export async function GET(request: CustomRequest) {
  const userId = parseInt(request.params.userId, 10);
  const postId = parseInt(request.params.postId, 10);
  const post = await getPostByUserAndId(userId, postId);
  if (post) {
    return NextResponse.json(post);
  } else {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}
