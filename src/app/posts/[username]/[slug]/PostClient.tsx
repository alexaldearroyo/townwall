'use client';

import React, { useState, useEffect } from 'react';

type CommentType = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
  username: string;
};

type CategoryType = {
  id: number;
  categoryName: string;
};

type PostClientProps = {
  post: any;
  currentUser: any;
};

export default function PostClient({ post, currentUser }: PostClientProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${post.id}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch(() => setError('Failed to fetch comments'));
  }, [post.id]);

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ postId: post.id, content: newComment }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment('');
    } catch {
      setError('Failed to add comment');
    }
  };

  const handleEditPost = async () => {
    const updatedTitle = prompt('Edit title', post.title);
    const updatedContent = prompt('Edit content', post.content);

    if (updatedTitle && updatedContent) {
      try {
        const response = await fetch('/api/posts', {
          method: 'PATCH',
          body: JSON.stringify({
            id: post.id,
            title: updatedTitle,
            content: updatedContent,
            slug: post.slug,
            categoryNames: post.categories.map(
              (c: CategoryType) => c.categoryName,
            ),
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          window.location.reload();
        } else {
          throw new Error('Failed to update post');
        }
      } catch {
        setError('Failed to update post');
      }
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post?',
    );
    if (confirmDelete) {
      try {
        const response = await fetch('/api/posts', {
          method: 'DELETE',
          body: JSON.stringify({ id: post.id }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          window.location.href = `/posts/${post.author}`;
        } else {
          throw new Error('Failed to delete post');
        }
      } catch {
        setError('Failed to delete post');
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-8 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full max-w-3xl mx-auto p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            {post.title}
          </h1>
          {currentUser?.id === post.userId && (
            <div className="space-x-2">
              <button
                onClick={handleEditPost}
                className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          By{' '}
          <a
            href={`/profile/${post.author}/public`}
            className="text-sky-700 dark:text-sky-400"
          >
            {post.author}
          </a>{' '}
          on {new Date(post.createdAt).toLocaleDateString()}
          {post.categories && post.categories.length > 0 && (
            <span className="ml-2 inline-block text-sm text-gray-500 dark:text-gray-400">
              {post.categories.map((category: CategoryType) => (
                <span
                  key={`category-${category.id}`}
                  className="ml-1 inline-block bg-orange-100 rounded-full px-2 py-1 text-sm font-semibold text-gray-700"
                >
                  {category.categoryName}
                </span>
              ))}
            </span>
          )}
        </p>
        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        <h2 className="text-lg font-bold text-center text-gray-800 dark:text-white">
          Comments
        </h2>

        {!!error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={`comment-${comment.id}`}
              className="p-4 bg-gray-100 rounded-md dark:bg-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
              <small className="text-gray-500">
                {new Date(comment.createdAt).toLocaleString()} by{' '}
                <a
                  href={`/profile/${comment.username}/public`}
                  className="text-sky-700 dark:text-sky-600 hover:text-sky-800"
                >
                  {comment.username}
                </a>
              </small>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="flex justify-center">
            <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
