'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PostPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (response.ok) {
          const postData = await response.json();
          setPost(postData);
        } else {
          setFetchError('Post not found');
        }
      } catch {
        setFetchError('Failed to fetch post');
      }
    };

    if (postId) {
      fetchPost().catch(() => {
        setFetchError('Failed to fetch post');
      });
    }
  }, [postId]);

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        {post ? (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <p className="text-center text-gray-700 dark:text-gray-300">
              {post.content}
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PostPage;
