'use client';

import React, { useEffect, useState } from 'react';
import FollowingList from './FollowingList';

type UserType = {
  email: React.ReactNode;
  id: number;
  username: string;
  userImage: string | null;
};

export default function FollowingPage() {
  const [following, setFollowing] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch('/api/following');
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
  }, []);

  return <FollowingList following={following} error={error} />;
}
