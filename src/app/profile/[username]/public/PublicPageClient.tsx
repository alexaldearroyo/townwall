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

type CommentType = {
  id: number;
  profileId: number;
  userId: number;
  content: string;
  createdAt: Date;
  username: string;
  userImage: string;
};

type LocationType = {
  city: string;
  country: string;
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
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');

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

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (loggedInUserId) {
        const response = await fetch(
          `/api/follows?followerId=${loggedInUserId}&followedId=${user.id}`,
        );
        const result = await response.json();
        setIsFollowing(result.isFollowing);
      }
    };

    checkIfFollowing();
  }, [loggedInUserId, user.id]);

  const handleFollow = async () => {
    await fetch('/api/follows', {
      method: isFollowing ? 'DELETE' : 'POST',
      body: JSON.stringify({ followerId: loggedInUserId, followedId: user.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    setIsFollowing(!isFollowing);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/profile/comments?profileId=${user.id}`,
        );
        if (response.ok) {
          const profileComments = await response.json();
          setComments(profileComments);
        } else {
          setError('Failed to fetch comments');
        }
      } catch (err) {
        setError('Failed to fetch comments');
      }
    };

    fetchComments();
  }, [user.id]);

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/profile/comments', {
        method: 'POST',
        body: JSON.stringify({ profileId: user.id, content: newComment }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

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
        {!!loggedInUserId && loggedInUserId !== user.id && (
          <button
            onClick={handleFollow}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mt-8">
          Comments
        </h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-100 rounded-md dark:bg-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
              <small className="text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleString()} by{' '}
                {comment.username}
              </small>
            </div>
          ))}
        </div>

        {isFollowing && (
          <form onSubmit={handleCommentSubmit} className="space-y-4 mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
