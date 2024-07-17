'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getCityAndCountry } from '../../../../../util/geocode';

const Map = dynamic(() => import('../../../../components/Map'), { ssr: false });

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

export default function PublicPageClient({
  user,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {user.username}'s Profile
        </h1>
        <div className="text-center mx-auto">
          <span className="text-9xl">{user.userImage}</span>
        </div>

        {!!user.fullName && user.fullName.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Full Name: {user.fullName}
          </p>
        )}
        {!!user.description && user.description.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Description: {user.description}
          </p>
        )}
        {!!user.interests && user.interests.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Interests: {user.interests}
          </p>
        )}
        {!!user.profileLinks && user.profileLinks.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Links: {user.profileLinks}
          </p>
        )}
        {!!user.location && (
          <div className="w-full">
            <Map latitude={user.location.y} longitude={user.location.x} />
            {!!location && (
              <p className="text-center text-gray-700 dark:text-gray-300">
                Location: {location.city}, {location.country}
              </p>
            )}
          </div>
        )}
        {!!user.birthdate && user.birthdate.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Birthdate: {user.birthdate}
          </p>
        )}
        {!!user.profession && user.profession.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Profession: {user.profession}
          </p>
        )}
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <ul>
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={`post-${post.id}`} className="mb-4">
                <Link
                  href={`/posts/${user.username}/${post.slug}`}
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-gray-700 dark:text-gray-300">
                  {post.content.slice(0, 100)}...
                </p>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300">
              No posts yet
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
