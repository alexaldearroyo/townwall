// src/app/posts/[username]/new/NewPostForm.tsx:

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
  categoryIds: string[] | null; // Ajuste aquí
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
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug = generateSlug(title);

    try {
      // Verifica que categories sea un array
      const categoriesArray = Array.isArray(categories) ? categories : [];

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          title,
          content,
          slug,
          categoryNames: categoriesArray,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const post: PostType = await response.json();
        router.push(`/posts/${user.username}/${post.slug}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
    } catch (catchError: any) {
      setError(catchError.message);
    }
  }

  function handleAddCategory() {
    const titleCaseCategory = toTitleCase(newCategory);

    if (
      newCategory &&
      categories.length < 7 &&
      !categories.includes(titleCaseCategory)
    ) {
      setCategories([...categories, titleCaseCategory]);
      setNewCategory('');
    } else if (categories.includes(titleCaseCategory)) {
      setError('Category already added');
    }
  }

  function handleRemoveCategory(categoryToRemove: string) {
    setCategories(
      categories.filter((category) => category !== categoryToRemove),
    );
  }

  function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
  }

  return (
    <div className="flex items-center justify-center mt-20 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Create a New Post
        </h1>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
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
              className="mt-1 block w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Categories
            </label>
            <div className="flex space-x-2">
              <input
                id="newCategory"
                name="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add a new category"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
                text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Add
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {categories.map((category) => (
                <span
                  key={`category-${category}`}
                  className="inline-block bg-amber-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <button className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
