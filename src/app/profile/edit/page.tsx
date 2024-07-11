import React from 'react';
import { cookies } from 'next/headers';
import { getUserById, getUserByUsername } from '../../../../database/users';
import { getSessionByToken } from '../../../../database/sessions';
import EditProfileForm from './EditProfileForm';

export default async function EditProfilePage() {
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
        <p className="text-xl text-red-500">User not found</p>
      </div>
    );
  }

  const userProfile = {
    username: user.username,
    fullName: user.fullName || '',
    description: user.description || '',
    interests: user.interests || '',
    profileLinks: user.profileLinks || '',
    userImage: user.userImage || '',
    location: user.location || '',
    birthdate: user.birthdate ? user.birthdate.toISOString().split('T')[0] : '',
    profession: user.profession || '',
  };

  return (
    <div className="main-content form-container bg-white dark:bg-gray-900">
      <EditProfileForm user={userProfile} />
    </div>
  );
}
