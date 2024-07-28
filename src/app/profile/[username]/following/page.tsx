'use client';

import React, { useEffect, useState } from 'react';
import FollowingList from './FollowingList';

type UserType = {
  email: React.ReactNode;
  id: number;
  username: string;
  userImage: string | null;
};

export default function FollowingPage({ params }: { params: { username: string } }) {
  const [following, setFollowing] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { username } = params;

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`/api/following?username=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch following users');
        }
        const data = await response.json();
        setFollowing(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchFollowing();
  }, [username]);

  // Assume you have a way to get the logged in user's username, for example from cookies or context
  const loggedInUsername = 'loggedInUser'; // Replace this with the actual logic

  return <FollowingList following={following} error={error} username={username} loggedInUsername={loggedInUsername} />;
}
