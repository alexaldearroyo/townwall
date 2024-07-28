'use client';

import React, { useEffect, useState } from 'react';
import FollowersList from './FollowersList';

type UserType = {
  email: string;
  id: number;
  username: string;
  userImage: string | null;
};

export default function FollowersPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(`/api/followers?username=${username}`);
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
  }, [username]);

  return <FollowersList followers={followers} error={error} />;
}
