// src/app/search/SearchComponent.tsx

'use client';

import React, { useState } from 'react';

type UserType = {
  id: number;
  username: string;
  userImage: string | null;
  icon: string | null;
  location: string | null;
};

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`,
      );
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (catchError: any) {
      setError(catchError.message);
    }
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
        Search Users
      </h1>
      <form onSubmit={handleSearch} className="space-y-6">
        <div>
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Search by username or location
          </label>
          <input
            id="query"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter username or location"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-center">
          <button className="w-1/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
            Search
          </button>
        </div>
      </form>
      {!!error && <p className="text-red-500 text-center">{error}</p>}
      <ul className="space-y-4">
        {results.map((user) => (
          <li key={`user-${user.id}`} className="flex items-center space-x-4">
            <div className="h-15 w-15 rounded-full">{user.userImage}</div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                <a href={`/profile/${user.username}/public`}>{user.username}</a>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {user.location ? user.location : 'Location not available'}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
