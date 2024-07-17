import React from 'react';
import { cookies } from 'next/headers';
import { getUserByUsername } from '../../../../../database/users';
import { getSessionByToken } from '../../../../../database/sessions';
import PrivatePageClient from './PrivatePageClient';
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
  const loggedInUserId = session ? session.userId : null;

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

  const userProfile = {
    id: user.id,
    username: user.username,
    ...(user.fullName && { fullName: user.fullName }),
    ...(user.description && { description: user.description }),
    ...(user.interests && { interests: user.interests }),
    ...(user.profileLinks && { profileLinks: user.profileLinks }),
    ...(user.userImage && { userImage: user.userImage }),
    ...(user.location && { location: user.location }),
    ...(user.birthdate && { birthdate: user.birthdate.toISOString() }),
    ...(user.profession && { profession: user.profession }),
  };

  return (
    <div>
      <PrivatePageClient user={userProfile} loggedInUserId={loggedInUserId} />
    </div>
  );
}
