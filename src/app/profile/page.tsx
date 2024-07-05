// src/app/profile/page.tsx

import React from 'react';
import { cookies } from 'next/headers';
import { getUserById } from '../../../database/users';
import { getSessionByToken } from '../../../database/sessions';
import ProfilePageClient from './ProfilePageClient';

export default async function ProfilePage() {
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

  const user = await getUserById(session.userId);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">You are not logged in</p>
      </div>
    );
  }

  return <ProfilePageClient user={user} />;
}
