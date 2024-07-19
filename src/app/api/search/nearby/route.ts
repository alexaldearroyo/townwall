import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../../database/connect';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const latitude = parseFloat(url.searchParams.get('latitude') || '0');
  const longitude = parseFloat(url.searchParams.get('longitude') || '0');
  const radius = parseInt(url.searchParams.get('radius') || '10'); // Radius in kilometers

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: 'Latitude and Longitude are required' },
      { status: 400 },
    );
  }

  const users = await sql<
    {
      id: number;
      username: string;
      email: string;
      userImage: string;
      location: unknown | null;
    }[]
  >`
    SELECT
      id,
      username,
      email,
      user_image AS "userImage",
      st_astext (location) AS location
    FROM
      users
    WHERE
      st_dwithin (
        location,
        st_setsrid (
          st_makepoint (
            ${longitude},
            ${latitude}
          ),
          4326
        ),
        ${radius} * 1000
      )
  `;

  return NextResponse.json(users);
}
