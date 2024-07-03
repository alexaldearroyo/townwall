'use client';

import React, { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors ? data.errors[0].message : 'Unknown error');
        return;
      }

      setSuccess('User registered successfully');
    } catch (error) {
      setError('Failed to register user');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Register</h1>
      <form
        className="bg-white p-6 rounded-lg shadow-md w-80"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username:
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password:
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      {!!error && <p className="mt-4 text-red-500">{error}</p>}
      {!!success && <p className="mt-4 text-green-500">{success}</p>}
    </div>
  );
}
