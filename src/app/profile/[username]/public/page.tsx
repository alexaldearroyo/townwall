import React from 'react';
import { cookies } from 'next/headers';
import { getUserByUsername } from '../../../../../database/users';
import PublicPageClient from './PublicPageClient';

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  const user = await getUserByUsername(username);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">User not found</p>
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
      <PublicPageClient user={userProfile} />
    </div>
  );
}
