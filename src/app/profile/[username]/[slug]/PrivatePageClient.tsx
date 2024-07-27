'use client';

import React, { useState, useEffect } from 'react';
import { getCityAndCountry } from '../../../../../util/geocode';
import UserProfile from './UserProfile';
import UserPosts from './UserPosts';
import UserFriends from './UserFriends';
import UserComments from './UserComments';

type CategoryType = {
  id: number;
  categoryName: string;
};

type PostType = {
  id: number;
  userId: number;
  icon: string | null;
  title: string;
  content: string;
  categories: CategoryType[];
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
    email: string;
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
    <div className="w-full min-h-screen p-8 flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full md:w-1/2 flex flex-col space-y-8">
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <UserProfile
            user={user}
            location={location}
            error={error}
            handleLogout={handleLogout}
          />
        </div>
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <UserComments userId={user.id} />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col space-y-8">
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <UserPosts user={user} posts={posts} handleNewPost={handleNewPost} />
        </div>
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <UserFriends user={user} />
        </div>
      </div>
    </div>
  );
}
