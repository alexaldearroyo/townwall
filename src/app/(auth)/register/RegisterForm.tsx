'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function generateSlug(username: string): string {
  return username.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
}

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (geolocationError) => {
        console.error('Error obtaining geolocation', error);
        setError('Unable to obtain geolocation');
      },
    );
  }, []);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (latitude === null || longitude === null) {
      setError('Geolocation is required');
      return;
    }

    const slug = generateSlug(username);

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        email,
        latitude,
        longitude,
        slug,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.ok ? await response.json() : null;

    if (response.ok) {
      setError('User registered successfully');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/login');
    } else {
      setError(
        data ? data.errors[0].message : 'Invalid username, email or password',
      );
    }
  }

  return (
    <div className="flex items-center justify-center mt-20 mb-20 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Sign Up
        </h1>
        <form onSubmit={handleRegister} className="space-y-6">
          {!!error && (
            <p
              className={
                error === 'User registered successfully'
                  ? 'text-green-700 text-center'
                  : 'text-red-500 text-center'
              }
            >
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
