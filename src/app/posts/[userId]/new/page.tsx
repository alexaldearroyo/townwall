'use client';

import React from 'react';
import PostForm from '../../PostForm';

const NewPostPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create New Post
        </h1>
        <PostForm />
      </div>
    </div>
  );
};

export default NewPostPage;
