'use client';

import React, { useState, useEffect } from 'react';
import Wall from './Wall';
import Posts from './Posts';

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

export default function PublicPageClient({
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
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 space-y-8">
      <div className="w-full max-w-4xl p-8 flex flex-col md:flex-row space-y-8 md:space-y-0 bg-white rounded-lg shadow dark:bg-gray-800">
        <Wall user={user} loggedInUserId={loggedInUserId} />
        <div className="w-0 md:w-4" />
        <Posts posts={posts} username={user.username} />
      </div>
    </div>
  );
}
