import { sql } from './connect';
import bcrypt from 'bcrypt';

const animalEmojis = [
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🐯',
  '🦁',
  '🐮',
  '🐷',
  '🐸',
  '🐙',
];

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  userImage: string | null;
  email: string;
  fullName?: string | null;
  description?: string | null;
  interests?: string | null;
  profileLinks?: string | null;
  location?: { x: number; y: number } | null | unknown;
  birthdate?: Date | null;
  profession?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  profileId: number;
  slug: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  description: string | null;
  interests: string | null;
  profileLinks: string | null;
  userImage: string | null;
  location: { x: number; y: number } | null;
  birthdate: Date | null;
  profession: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  profileId: number;
  slug: string;
};

export async function createUser(
  username: string,
  password: string,
  email: string,
  profileId: number,
  slug: string,
  location: { x: number; y: number },
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10);
  const randomEmoji =
    animalEmojis[Math.floor(Math.random() * animalEmojis.length)] || '';

  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
      userImage: string;
      email: string;
      fullName: string | null;
      description: string | null;
      interests: string | null;
      profileLinks: string | null;
      location: string | null;
      birthdate: Date | null;
      profession: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      profileId: number;
      slug: string;
    }[]
  >`
    INSERT INTO
      users (
        username,
        password_hash,
        user_image,
        email,
        profile_id,
        slug,
        location
      )
    VALUES
      (
        ${username},
        ${passwordHash},
        ${randomEmoji},
        ${email},
        ${profileId},
        ${slug},
        st_setsrid (
          st_point (
            ${location.x},
            ${location.y}
          ),
          4326
        )
      )
    RETURNING
      id,
      username,
      password_hash AS "passwordHash",
      user_image AS "userImage",
      email,
      full_name AS "fullName",
      description,
      interests,
      profile_links AS "profileLinks",
      st_astext (location) AS "location",
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      profile_id AS "profileId",
      slug
  `;

  if (users.length === 0) {
    throw new Error('User creation failed');
  }

  const user = users[0] as User;
  if (user.location) {
    user.location = parseLocation(user.location as string);
  }
  return user;
}

export async function getUserByUsername(
  username: string,
): Promise<User | undefined> {
  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
      email: string;
      fullName: string | null;
      description: string | null;
      interests: string | null;
      profileLinks: string | null;
      userImage: string;
      location: unknown | null;
      birthdate: Date | null;
      profession: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      profileId: number;
      slug: string;
    }[]
  >`
    SELECT
      id,
      username,
      password_hash AS "passwordHash",
      email,
      full_name AS "fullName",
      description,
      interests,
      profile_links AS "profileLinks",
      user_image AS "userImage",
      st_astext (location) AS "location",
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      profile_id AS "profileId",
      slug
    FROM
      users
    WHERE
      username = ${username}
  `;

  if (users.length === 0) {
    return undefined;
  }

  const user = users[0];
  if (user) {
    user.location = user.location
      ? parseLocation(user.location as string)
      : null;
  }

  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
      email: string;
      fullName: string | null;
      description: string | null;
      interests: string | null;
      profileLinks: string | null;
      userImage: string;
      location: unknown | null;
      birthdate: Date | null;
      profession: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      profileId: number;
      slug: string;
    }[]
  >`
    SELECT
      id,
      username,
      password_hash AS "passwordHash",
      email,
      full_name AS "fullName",
      description,
      interests,
      profile_links AS "profileLinks",
      user_image AS "userImage",
      st_astext (location) AS "location",
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      profile_id AS "profileId",
      slug
    FROM
      users
    WHERE
      email = ${email}
  `;

  if (users.length === 0) {
    return undefined;
  }

  const user = users[0];
  if (user) {
    user.location = user.location
      ? parseLocation(user.location as string)
      : null;
  }

  return user;
}

export async function getUserById(id: number): Promise<User> {
  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
      email: string;
      fullName: string | null;
      description: string | null;
      interests: string | null;
      profileLinks: string | null;
      userImage: string;
      location: unknown | null;
      birthdate: Date | null;
      profession: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      profileId: number;
      slug: string;
    }[]
  >`
    SELECT
      id,
      username,
      password_hash AS "passwordHash",
      email,
      full_name AS "fullName",
      description,
      interests,
      profile_links AS "profileLinks",
      user_image AS "userImage",
      st_astext (location) AS "location",
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      profile_id AS "profileId",
      slug
    FROM
      users
    WHERE
      id = ${id}
  `;

  if (users.length === 0) {
    throw new Error(`User with username ${id} not found`);
  }

  const user = users[0];
  if (!user) {
    throw new Error(`User with username ${id} not found`);
  }

  user.location = user.location ? parseLocation(user.location as string) : null;

  return user;
}

export async function deleteUserById(id: number): Promise<void> {
  await sql`
    DELETE FROM users
    WHERE
      id = ${id}
  `;
}

export async function updateUserProfile(
  userId: number,
  profileData: Partial<UserProfile>,
): Promise<UserProfile> {
  const birthdateValue = profileData.birthdate
    ? `to_date('${new Date(profileData.birthdate).toISOString().split('T')[0]}', 'YYYY-MM-DD')`
    : null;
  const locationValue = profileData.location
    ? `ST_SetSRID(ST_Point(${profileData.location.x}, ${profileData.location.y}), 4326)`
    : null;

  const users = await sql<
    {
      id: number;
      username: string;
      email: string;
      fullName: string | null;
      description: string | null;
      interests: string | null;
      profileLinks: string | null;
      userImage: string;
      location: string | null;
      birthdate: Date | null;
      profession: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      profileId: number;
      slug: string;
    }[]
  >`
    UPDATE users
    SET
      full_name = coalesce(
        ${profileData.fullName ?? 'null'},
        full_name
      ),
      description = coalesce(
        ${profileData.description ?? 'null'},
        description
      ),
      interests = coalesce(
        ${profileData.interests ?? 'null'},
        interests
      ),
      profile_links = coalesce(
        ${profileData.profileLinks ?? 'null'},
        profile_links
      ),
      user_image = coalesce(
        ${profileData.userImage ?? 'null'},
        user_image
      ),
      location = coalesce(
        ${locationValue}::geometry,
        location
      ),
      birthdate = coalesce(
        ${birthdateValue}::date,
        birthdate
      ),
      profession = coalesce(
        ${profileData.profession ?? 'null'},
        profession
      ),
      updated_at = now()
    WHERE
      id = ${userId}
    RETURNING
      id,
      username,
      email,
      full_name AS "fullName",
      description,
      interests,
      profile_links AS "profileLinks",
      user_image AS "userImage",
      st_astext (location) AS "location",
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      profile_id AS "profileId",
      slug
  `;

  const updatedUser = users[0];

  if (!updatedUser) {
    throw new Error('Profile update failed');
  }

  if (updatedUser.location) {
    const parsedLocation = parseLocation(updatedUser.location);
    updatedUser.location = parsedLocation
      ? JSON.stringify(parsedLocation)
      : null;
  }

  return updatedUser as UserProfile;
}

// Helper function to parse location from string to { x: number; y: number }
export function parseLocation(
  locationString: string,
): { x: number; y: number } | null {
  const match = locationString.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (!match) {
    return null;
  }
  const [, x, y] = match;
  return { x: parseFloat(x || '0'), y: parseFloat(y || '0') };
}

export async function getUserByUsernameOrEmail(
  identifier: string,
): Promise<User | undefined> {
  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
      email: string;
      fullName: string | null;
      description: string | null;
      interests: string | null;
      profileLinks: string | null;
      userImage: string;
      location: unknown | null;
      birthdate: Date | null;
      profession: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      profileId: number;
      slug: string;
    }[]
  >`
    SELECT
      id,
      username,
      password_hash AS "passwordHash",
      email,
      full_name AS "fullName",
      description,
      interests,
      profile_links AS "profileLinks",
      user_image AS "userImage",
      st_astext (location) AS "location",
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      profile_id AS "profileId",
      slug
    FROM
      users
    WHERE
      username = ${identifier}
      OR email = ${identifier}
  `;

  if (users.length === 0) {
    return undefined;
  }

  const user = users[0];
  if (user) {
    user.location = user.location
      ? parseLocation(user.location as string)
      : null;
  }

  return user;
}
