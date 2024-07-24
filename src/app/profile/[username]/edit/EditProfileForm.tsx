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
        const updatedUser = await response.json();
        setFormData(updatedUser.user);
        router.push(
          `/profile/${updatedUser.user.username}/${updatedUser.user.slug}`,
        );
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (catchError: any) {
      setError(catchError.message);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/register');
      } else {
        throw new Error('Failed to delete user');
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
    <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Edit My Profile
        </h1>
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-md mx-auto"
        >
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
              placeholder={
                formData.description ? '' : 'Enter a description of yourself'
              }
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
              placeholder={formData.interests ? '' : 'Enter your interests'}
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
              placeholder={
                formData.profileLinks ? '' : 'Enter your personal links'
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {/* <div>
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
          </div> */}
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
              placeholder={formData.birthdate ? '' : 'Enter your birth date'}
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
              placeholder={formData.profession ? '' : 'Enter your profession'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-center space-x-2">
            <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
