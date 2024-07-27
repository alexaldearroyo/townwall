'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Attempting login with:', { identifier, password });

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.ok ? await response.json() : null;

    if (response.ok) {
      console.log('Login successful:', data);
      router.push(`/profile/${data.user.username}/private`); // Redirect to profile page using username
    } else {
      console.log('Login failed:', data);
      setError(
        data && data.errors
          ? data.errors[0].message
          : 'Invalid username or password',
      );
    }
  }

  return (
    <div className="flex items-center justify-center mt-20 mb-20 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Sign In
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {!!error && <p className="text-red-500">{error}</p>}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(event) => setIdentifier(event.currentTarget.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-center">
            <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
