'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCityAndCountry } from '../../../../../util/geocode';

const Map = dynamic(() => import('../../../../components/MapComponent'), {
  ssr: false,
});

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
    <div className="w-full space-y-6">
      <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
        {user.username}'s Wall
      </h1>
      <div className="text-center mx-auto">
        <span className="text-9xl">{user.userImage}</span>
      </div>
      {!!user.fullName && user.fullName.trim() !== 'null' && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-800 font-bold dark:text-sky-600">
            Full Name:{' '}
          </span>
          {user.fullName}
        </p>
      )}
      {!!user.description && user.description.trim() !== 'null' && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-800 font-bold dark:text-sky-600">
            Description:{' '}
          </span>
          {user.description}
        </p>
      )}
      {!!user.interests && user.interests.trim() !== 'null' && (
        <div className="text-center text-gray-700 dark:text-gray-300">
          {/* <h3 className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Interests
          </h3> */}
          <div className="text-center text-gray-700 dark:text-gray-300">
            {user.interests.split(',').map((interest) => (
              <span
                key={`interest-${interest}`}
                className="inline-block bg-amber-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {!!user.profileLinks && user.profileLinks.trim() !== 'null' && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-800 font-bold dark:text-sky-600">
            Links:{' '}
          </span>
          {user.profileLinks}
        </p>
      )}
      {!!user.location && (
        <div className="w-full">
          {/* <Map latitude={user.location.y} longitude={user.location.x} /> */}
          {!!location && (
            <p className="text-center text-gray-700 dark:text-gray-300">
              <span className="text-sky-800 font-bold dark:text-sky-600">
                Location:{' '}
              </span>
              {location.city}, {location.country}
            </p>
          )}
        </div>
      )}
      {!!user.birthdate && user.birthdate.trim() !== 'null' && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-800 font-bold dark:text-sky-600">
            Birthdate:{' '}
          </span>
          {user.birthdate}
        </p>
      )}
      {!!user.profession && user.profession.trim() !== 'null' && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-800 font-bold dark:text-sky-600">
            Profession:{' '}
          </span>
          {user.profession}
        </p>
      )}
      {!!loggedInUserId && loggedInUserId !== user.id && (
        <div className="flex justify-center">
          <button
            onClick={handleFollow}
            className={`w-0.5/2 h-10 px-4 text-white rounded-md ${
              isFollowing ? 'bg-red-600' : 'bg-sky-600'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      )}
      <hr className="my-8 border-gray-300 dark:border-gray-600" />

      {!!error && <p className="text-red-500 text-center">{error}</p>}
      <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mt-8">
        Comments
      </h2>
      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No comments yet
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-100 rounded-md dark:bg-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
              <small className="text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleString()} by{' '}
                <a
                  href={`/profile/${comment.username}/public`}
                  className="text-blue-700 dark:text-sky-600 hover:text-indigo-800"
                >
                  {comment.username}
                </a>
              </small>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleCommentSubmit} className="space-y-4 mt-4">
        <div className="flex justify-center w-full">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-0.5/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
