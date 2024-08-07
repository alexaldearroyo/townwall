'use client';

import React, { useState, useEffect } from 'react';
import Wall from './Wall';
import Posts from './Posts';
import UserFriends from './Friends';
import Comments from './Comments';
import Friends from './Friends';

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
    <div className="w-full min-h-screen p-8 flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full md:w-1/2 flex flex-col space-y-8">
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <Wall user={user} loggedInUserId={loggedInUserId} />
        </div>
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <Comments username={user.username} />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col space-y-8">
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <Posts posts={posts} username={user.username} />
        </div>
        <div className="w-full p-8 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-center">
          <Friends user={user} /> {/* Use the new Friends component */}
        </div>
      </div>
    </div>
  );
}
