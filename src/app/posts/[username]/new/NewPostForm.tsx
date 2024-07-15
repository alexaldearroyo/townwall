'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type UserType = {
  id: number;
  username: string;
};

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

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
}

export default function NewPostForm({ user }: { user: UserType }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug = generateSlug(title);

    console.log('Form data:', { userId: user.id, title, content, slug });

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, title, content, slug }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const post: PostType = await response.json();
        router.push(`/posts/${post.slug}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
    } catch (catchError: any) {
      setError(catchError.message);
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write the title here"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Post
          </button>
        </div>
      </form>
    </div>
  );
}
