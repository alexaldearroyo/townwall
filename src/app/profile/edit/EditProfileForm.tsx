'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfileForm({ user }: { user: any }) {
  const [formData, setFormData] = useState(user);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setFormData(user);
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push(`/profile/${formData.username}`); // Redirect using the username
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (catchError: any) {
      setError(catchError.message);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Edit Profile
        </h1>
        <div className="p-4 mb-4 bg-gray-200 dark:bg-gray-700 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Current User Data
          </h2>
          <p>
            <strong>Username:</strong> {formData.username}
          </p>
          <p>
            <strong>Full Name:</strong> {formData.fullName || 'N/A'}
          </p>
          <p>
            <strong>Description:</strong> {formData.description || 'N/A'}
          </p>
          <p>
            <strong>Interests:</strong> {formData.interests || 'N/A'}
          </p>
          <p>
            <strong>Profile Links:</strong> {formData.profileLinks || 'N/A'}
          </p>
          <p>
            <strong>Picture URL:</strong> {formData.userImage || 'N/A'}
          </p>
          <p>
            <strong>Location:</strong> {formData.location || 'N/A'}
          </p>
          <p>
            <strong>Birthdate:</strong> {formData.birthdate || 'N/A'}
          </p>
          <p>
            <strong>Profession:</strong> {formData.profession || 'N/A'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!!error && <p className="text-red-500">{error}</p>}
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
              value={formData.username}
              onChange={handleChange}
              disabled // Disable editing of username
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={formData.fullName ? '' : 'Enter your full name'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="interests"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Interests
            </label>
            <input
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="profileLinks"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Personal Links
            </label>
            <input
              id="profileLinks"
              name="profileLinks"
              value={formData.profileLinks}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="userImage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Picture URL
            </label>
            <input
              id="userImage"
              name="userImage"
              value={formData.userImage}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Birth Date
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="profession"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Profession
            </label>
            <input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
