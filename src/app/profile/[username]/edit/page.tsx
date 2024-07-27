import React from 'react';
import { cookies } from 'next/headers';
import { getSessionByToken } from '../../../../../database/sessions';
import { getUserById } from '../../../../../database/users';
import EditProfileForm from './EditProfileForm';

export default async function EditProfilePage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session');

  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-centered text-red-500">
          You are not logged in
        </p>
      </div>
    );
  }

  const session = await getSessionByToken(sessionToken.value);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-centered text-red-500">
          You are not logged in
        </p>
      </div>
    );
  }

  const user = await getUserById(session.userId);

  const userProfile = {
    username: user.username,
    email: user.email,
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
    <div className="main-content form-container">
      <EditProfileForm user={userProfile} />
    </div>
  );
}
