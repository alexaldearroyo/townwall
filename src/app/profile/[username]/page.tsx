import React from 'react';
import { cookies } from 'next/headers';
import { getUserByUsername } from '../../../../database/users';
import { getSessionByToken } from '../../../../database/sessions';
import ProfilePageClient from '../../profile/ProfilePageClient';
import Link from 'next/link';

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session');

  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">You are not logged in</p>
      </div>
    );
  }

  const session = await getSessionByToken(sessionToken.value);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">You are not logged in</p>
      </div>
    );
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">User not found</p>
      </div>
    );
  }

  if (session.userId !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">Access denied</p>
      </div>
    );
  }

  return (
    <div>
      <ProfilePageClient user={user} />
      {session.userId === user.id && (
        <div className="flex justify-center mt-4">
          <Link href="/profile/edit" className="btn btn-primary">
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  );
}
