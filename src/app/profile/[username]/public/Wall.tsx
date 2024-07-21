'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCityAndCountry } from '../../../../../util/geocode';

const Map = dynamic(() => import('../../../../components/Map'), { ssr: false });

type LocationType = {
  city: string;
  country: string;
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

export default function Wall({
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
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full md:w-1/2 p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        {user.username}'s Wall
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
          {/* <Map latitude={user.location.y} longitude={user.location.x} /> */}
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
      {!!loggedInUserId && loggedInUserId !== user.id && (
        <button
          onClick={handleFollow}
          className="w-full h-10 px-4 bg-indigo-600 text-white rounded-md"
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
      {!!error && <p className="text-red-500 text-center">{error}</p>}
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
      {/* {isFollowing && ( */}
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
          className="w-full h-10 px-4 bg-indigo-600 text-white rounded-md"
        >
          Submit
        </button>
      </form>
      {/* )} */}
    </div>
  );
}