import { sql } from './connect';

export async function followUser(followerId: number, followedId: number) {
  await sql`
    INSERT INTO
      follows (follower_id, followed_id)
    VALUES
      (
        ${followerId},
        ${followedId}
      )
  `;
}

export async function unfollowUser(followerId: number, followedId: number) {
  await sql`
    DELETE FROM follows
    WHERE
      follower_id = ${followerId}
      AND followed_id = ${followedId}
  `;
}

export async function getFollowers(userId: number) {
  return await sql<
    {
      id: number;
      username: string;
      email: string;
      passwordHash: string;
      profileId: number;
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
      slug: string;
    }[]
  >`
    SELECT
      users.*
    FROM
      users
      JOIN follows ON users.id = follows.follower_id
    WHERE
      follows.followed_id = ${userId}
  `;
}

export async function getFollowing(userId: number) {
  return await sql<
    {
      id: number;
      username: string;
      email: string;
      passwordHash: string;
      profileId: number;
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
      slug: string;
    }[]
  >`
    SELECT
      users.*
    FROM
      users
      JOIN follows ON users.id = follows.followed_id
    WHERE
      follows.follower_id = ${userId}
  `;
}

export async function getFollowingUsers(userId: number) {
  return await sql<
    { id: number; username: string; email: string; userImage: string }[]
  >`
    SELECT
      users.id,
      users.username,
      users.email,
      users.user_image AS "userImage"
    FROM
      users
      JOIN follows ON users.id = follows.followed_id
    WHERE
      follows.follower_id = ${userId}
  `;
}
