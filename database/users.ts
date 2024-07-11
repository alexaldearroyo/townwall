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
  userImage?: string | null;
  email?: string | null;
  fullName?: string | null;
  description?: string | null;
  interests?: string | null;
  profileLinks?: string | null;
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
  const passwordHash = await bcrypt.hash(password, 10);
  const randomEmoji =
    animalEmojis[Math.floor(Math.random() * animalEmojis.length)] || '';

  const users = await new Promise<any>((resolve, reject) => {
    sql<
      {
        id: number;
        username: string;
        passwordHash: string;
        userImage: string | null;
      }[]
    >`
      INSERT INTO
        users (
          username,
          password_hash,
          user_image
        )
      VALUES
        (
          ${username},
          ${passwordHash},
          ${randomEmoji}
        )
      RETURNING
        id,
        username,
        password_hash AS "passwordHash",
        user_image AS "userImage"
    `
      .then(resolve)
      .catch(reject);
  });

  if (users.length === 0) {
    throw new Error('User creation failed');
  }

  const user = users[0];
  return {
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
    userImage: user.userImage,
    email: user.email,
    fullName: user.fullName,
    description: user.description,
    interests: user.interests,
    profileLinks: user.profileLinks,
    location: user.location,
    birthdate: user.birthdate,
    profession: user.profession,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// Function to get a user by their username
export async function getUserByUsername(
  username: string,
): Promise<User | undefined> {
  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
      email: string | null;
      fullName: string | null;
      description: string | null;
      interests: string | null;
      profileLinks: string | null;
      userImage: string | null;
      location: unknown | null;
      birthdate: Date | null;
      profession: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
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

// Función para obtener un usuario por su ID
export async function getUserById(id: number): Promise<User | undefined> {
  const users = await sql<
    {
      id: number;
      username: string;
      passwordHash: string;
      userImage: string | null;
    }[]
  >`
    SELECT
      id,
      username,
      password_hash AS "passwordHash",
      user_image AS "userImage"
    FROM
      users
    WHERE
      id = ${id}
  `;

  return users[0] || undefined;
}

// Función para eliminar un usuario por su ID
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
