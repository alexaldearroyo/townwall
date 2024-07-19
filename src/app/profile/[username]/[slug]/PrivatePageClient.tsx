'use client';

import React, { useState, useEffect } from 'react';
import { getCityAndCountry } from '../../../../../util/geocode';
import UserProfile from './UserProfile';
import UserPosts from './UserPosts';
import UserFriends from './UserFriends';

type PostType = {
  id: number;
  userId: number;
  icon: string | null;
  title: string;
  content: string;
  categoryId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  slug: string;
};

type LocationType = {
  city: string;
  country: string;
};

export default function PrivatePageClient({
  user,
  loggedInUserId,
}: {
  user: {
    id: number;
    username: string;
    fullName?: string;
    description?: string;
    interests?: string;
    profileLinks?: string;
    userImage?: string;
    location?: { x: number; y: number } | null;
    birthdate?: string;
    profession?: string;
  };
  loggedInUserId: number | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [location, setLocation] = useState<LocationType | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/user/${user.id}`);
        if (response.ok) {
          const userPosts = await response.json();
          setPosts(userPosts);
        } else {
          setError('Failed to fetch posts');
        }
      } catch (err) {
        setError('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, [user.id]);

  useEffect(() => {
    if (user.location) {
      getCityAndCountry(user.location.y, user.location.x)
        .then((loc) => setLocation(loc))
        .catch((err) => setError('Failed to fetch location data'));
    }
  }, [user.location]);

  async function handleLogout() {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      window.location.href = '/login'; // Redirect to login page after logout
    } else {
      setError('Failed to log out');
    }
  }

  function handleNewPost() {
    window.location.href = `/posts/${user.username}/new`;
  }

  return (
    <div className="min-h-screen pt-32 px-4 lg:px-16 flex flex-col lg:flex-row items-start justify-start bg-gray-100 dark:bg-gray-900 space-y-8 lg:space-y-0 lg:space-x-8">
      <UserProfile
        user={user}
        location={location}
        error={error}
        handleLogout={handleLogout}
      />
      <div className="flex flex-col w-full lg:w-3/5 space-y-8">
        <UserPosts user={user} posts={posts} handleNewPost={handleNewPost} />
        <UserFriends user={user} />
      </div>
    </div>
  );
}
