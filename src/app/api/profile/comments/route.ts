import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '../../../../../database/sessions';
import {
  createProfileComment,
  getCommentsByProfileId,
} from '../../../../../database/comments';
import { sql } from '../../../../../database/connect';

export async function POST(request: NextRequest) {
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

    const { profileId, content } = await request.json();

    if (!profileId || !content) {
      return NextResponse.json(
        { error: 'Profile ID and content are required' },
        { status: 400 },
      );
    }

    // Verificar si el profileId existe en la tabla de comentarios de perfil
    const [profileExists] = await sql<{ id: number | null }[]>`
      SELECT
        id
      FROM
        profile_comments
      WHERE
        profile_id = ${Number(profileId)}
    `;

    if (!profileExists) {
      return NextResponse.json(
        { error: 'Profile ID does not exist' },
        { status: 400 },
      );
    }

    const comment = await createProfileComment(
      profileId,
      session.userId,
      content,
    );

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const profileId = url.searchParams.get('profileId');

  if (!profileId) {
    return NextResponse.json(
      { error: 'Profile ID is required' },
      { status: 400 },
    );
  }

  const comments = await getCommentsByProfileId(parseInt(profileId, 10));
  return NextResponse.json(comments);
}
