import React from 'react';

export default function PostClient({ post }: { post: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {post.content}
        </p>
      </div>
    </div>
  );
}
