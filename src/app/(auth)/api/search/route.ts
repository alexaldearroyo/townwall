import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../../database/connect';
import { parseLocation, User } from '../../../../../database/users';
import { getCityAndCountry } from '../../../../../util/geocode';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const searchResults = await sql<
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
      username ILIKE ${'%' + query + '%'}
      OR location ILIKE ${'%' + query + '%'}
  `;

  const users = await Promise.all(
    searchResults.map(async (user) => {
      if (user.location) {
        const location = parseLocation(user.location as string);
        if (location) {
          const { city, country } = await getCityAndCountry(
            location.y,
            location.x,
          );
          user.location = `${city}, ${country}`;
        } else {
          user.location = 'Unknown';
        }
      }
      return user;
    }),
  );

  return NextResponse.json(users);
}
