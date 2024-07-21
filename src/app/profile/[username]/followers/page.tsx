// src/app/profile/[username]/followers/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import FollowersList from './FollowersList';

type UserType = {
  email: string;
  id: number;
  username: string;
  userImage: string | null;
};

export default function FollowersPage() {
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch('/api/followers');
        if (!response.ok) {
          throw new Error('Failed to fetch followers');
        }
        const data = await response.json();
        setFollowers(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchFollowers();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <FollowersList followers={followers} error={error} />
    </div>
  );
}