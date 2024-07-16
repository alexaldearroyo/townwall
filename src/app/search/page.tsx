'use client';

import React, { useState } from 'react';

type UserType = {
  id: number;
  username: string;
  userImage: string | null;
  icon: string | null;
  location: string | null;
};

export default function SearchPage() {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Search
            </button>
          </div>
        </form>
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <ul className="space-y-4">
          {results.map((user) => (
            <li key={`user-${user.id}`} className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-10 w-10">{user.userImage}</div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.username}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {/* {!!user.icon && <span>{user.icon} </span>} */}
                  {user.location ? user.location : 'Location not available'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
