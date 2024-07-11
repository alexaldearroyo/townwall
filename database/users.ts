import { sql } from './connect';
import bcrypt from 'bcrypt';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  email?: string | null;
  fullName?: string | null;
  description?: string | null;
  interests?: string | null;
  profileLinks?: string | null;
  userImage?: string | null;
  location?: any;
  birthdate?: Date | null;
  profession?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string | null;
  fullName: string | null;
  description: string | null;
  interests: string | null;
  profileLinks: string | null;
  userImage: string | null;
  location: any;
  birthdate: Date | null;
  profession: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Function to create a user
export async function createUser(
  username: string,
  password: string,
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10); // Hash password

  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
    }[]
  >`
    INSERT INTO
      users (username, password_hash)
    VALUES
      (
        ${username},
        ${passwordHash}
      )
    RETURNING
      id,
      username,
      password_hash AS "passwordHash"
  `;

  const user = users[0] as {
    id: number;
    username: string;
    passwordHash: string;
  };

  if (!user) {
    throw new Error('User creation failed');
  }

  return {
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
  };
}

// Function to get a user by their username
export async function getUserByUsername(
  username: string,
): Promise<User | undefined> {
  const users = await sql<User[]>`
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
      location,
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM
      users
    WHERE
      username = ${username}
  `;

  return users[0] || undefined;
}

// Function to get a user by their ID
export async function getUserById(id: number): Promise<User | undefined> {
  const users = await sql<User[]>`
    SELECT
      id,
      username,
      password_hash AS "passwordHash"
    FROM
      users
    WHERE
      id = ${id}
  `;

  return users[0] || undefined;
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
    ? `(${profileData.location
        .split(',')
        .map((c: string) => parseFloat(c).toFixed(2))
        .join(',')})`
    : null;
  const users = await sql<UserProfile[]>`
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
        ${locationValue}::POINT,
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
      location,
      birthdate,
      profession,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  const updatedUser = users[0];

  if (!updatedUser) {
    throw new Error('Profile update failed');
  }

  return updatedUser;
}
